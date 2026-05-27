import { describe, test, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import App from './App'

const API_URL = 'http://localhost:8080/api/todos'

const mockTodos = [
  {
    id: 1,
    title: 'Prvi mock zadatak',
    completed: false,
    createdAt: '2026-05-20T13:25:02.582Z',
    updatedAt: '2026-05-20T13:25:02.582Z',
  },
  {
    id: 2,
    title: 'Drugi mock zadatak',
    completed: true,
    createdAt: '2026-05-20T13:26:02.582Z',
    updatedAt: '2026-05-20T13:26:02.582Z',
  },
]

const server = setupServer(
  http.get(API_URL, () => {
    return HttpResponse.json(mockTodos)
  }),
  http.post(API_URL, async ({ request }) => {
    const body = await request.json()
    const newTodo = {
      id: 3,
      title: body.title,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(newTodo, { status: 201 })
  }),
  http.get(`${API_URL}/:id`, ({ params }) => {
    const { id } = params
    const todo = mockTodos.find((t) => t.id === Number(id))
    if (!todo) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(todo)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Todo Application Component & Integration Tests', () => {
  test('renders application header and components', async () => {
    render(<App />)

    // Check main headers
    expect(screen.getByText(/Organizuj dan bez buke/i)).toBeInTheDocument()

    // Check loading indicator is shown initially
    expect(screen.getByText(/Učitavanje zadataka/i)).toBeInTheDocument()

    // Wait for the mock items to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Prvi mock zadatak')).toBeInTheDocument()
      expect(screen.getByText('Drugi mock zadatak')).toBeInTheDocument()
    })
  })

  test('add button is disabled when input is empty and enabled on typing', async () => {
    render(<App />)

    const input = screen.getByPlaceholderText(/unesi novi zadatak/i)
    const button = screen.getByRole('button', { name: /dodaj/i })

    expect(button).toBeDisabled()

    await userEvent.type(input, 'Treći zadatak')
    expect(button).toBeEnabled()
  })

  test('successfully adds a new todo task', async () => {
    render(<App />)

    // Wait for initial load
    await screen.findByText('Prvi mock zadatak')

    const input = screen.getByPlaceholderText(/unesi novi zadatak/i)
    const button = screen.getByRole('button', { name: /dodaj/i })

    await userEvent.type(input, 'Treći zadatak')
    await userEvent.click(button)

    // Check that it gets appended to the list
    expect(await screen.findByText('Treći zadatak')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  test('renders error message when backend returns 500 error', async () => {
    // Override MSW handler for this test only
    server.use(
      http.get(API_URL, () => {
        return new HttpResponse(null, { status: 500 })
      })
    )

    render(<App />)

    const errorMessage = await screen.findByText(/Zadaci trenutno ne mogu da se učitaju/i)
    expect(errorMessage).toBeInTheDocument()
  })

  test('navigates to details view when clicking Detalji', async () => {
    render(<App />)

    // Wait for initial load
    await screen.findByText('Prvi mock zadatak')

    // Find the details link for the first item
    const detailsLinks = screen.getAllByRole('link', { name: /detalji/i })
    expect(detailsLinks.length).toBe(2)

    // Click on the first "Detalji" link
    await userEvent.click(detailsLinks[0])

    // Verify it renders the details page (Zadatak #1)
    expect(await screen.findByRole('heading', { name: /zadatak #1/i })).toBeInTheDocument()
    expect(screen.getByText('Prvi mock zadatak')).toBeInTheDocument()
    expect(screen.getByText('Aktivan')).toBeInTheDocument() // Status badge

    // Click "Nazad na listu"
    const backBtn = screen.getByRole('button', { name: /nazad na listu/i })
    await userEvent.click(backBtn)

    // Should be back to the list view
    expect(await screen.findByText('Prvi mock zadatak')).toBeInTheDocument()
  })
})
