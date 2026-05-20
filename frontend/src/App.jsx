import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:8080/api/todos'

const filters = {
  all: 'Svi',
  active: 'Aktivni',
  completed: 'Završeni',
}

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTodos() {
      try {
        setError('')
        setIsLoading(true)
        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Zadaci trenutno ne mogu da se učitaju.')
        }

        setTodos(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [])

  async function createTodo(event) {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    try {
      setError('')
      setIsSaving(true)
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmedTitle }),
      })

      if (!response.ok) {
        throw new Error('Zadatak nije sačuvan.')
      }

      const todo = await response.json()
      setTodos((currentTodos) => [todo, ...currentTodos])
      setTitle('')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function toggleTodo(todo) {
    await updateTodo(todo.id, { completed: !todo.completed })
  }

  async function updateTodo(id, changes) {
    try {
      setError('')
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changes),
      })

      if (!response.ok) {
        throw new Error('Izmena nije sačuvana.')
      }

      const updatedTodo = await response.json()
      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === id ? updatedTodo : todo)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteTodo(id) {
    try {
      setError('')
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

      if (!response.ok) {
        throw new Error('Zadatak nije obrisan.')
      }

      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const visibleTodos = useMemo(() => {
    if (filter === 'active') {
      return todos.filter((todo) => !todo.completed)
    }

    if (filter === 'completed') {
      return todos.filter((todo) => todo.completed)
    }

    return todos
  }, [filter, todos])

  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.length - activeCount

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <span className="eyebrow">Todo lista</span>
          <h1>Organizuj dan bez buke.</h1>
          <p>Dodaj zadatke, označi završeno i filtriraj ono što je važno.</p>
        </div>
        <dl className="summary">
          <div>
            <dt>Aktivni</dt>
            <dd>{activeCount}</dd>
          </div>
          <div>
            <dt>Završeni</dt>
            <dd>{completedCount}</dd>
          </div>
        </dl>
      </section>

      <section className="todo-panel" aria-label="Lista zadataka">
        <form className="todo-form" onSubmit={createTodo}>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Unesi novi zadatak"
            aria-label="Naziv novog zadatka"
          />
          <button type="submit" disabled={isSaving || !title.trim()}>
            {isSaving ? 'Čuvam...' : 'Dodaj'}
          </button>
        </form>

        <div className="toolbar" aria-label="Filter zadataka">
          {Object.entries(filters).map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? 'active' : ''}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        {isLoading ? (
          <p className="state">Učitavanje zadataka...</p>
        ) : visibleTodos.length === 0 ? (
          <p className="state">
            {todos.length === 0
              ? 'Lista je prazna. Dodaj prvi zadatak.'
              : 'Nema zadataka za izabrani filter.'}
          </p>
        ) : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />
                  <span>{todo.title}</span>
                </label>
                <button type="button" onClick={() => deleteTodo(todo.id)}>
                  Obriši
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
