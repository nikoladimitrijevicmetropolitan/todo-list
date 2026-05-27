import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import './App.css'

const API_URL = 'http://localhost:8080/api/todos'

const filters = {
  all: 'Svi',
  active: 'Aktivni',
  completed: 'Završeni',
}

function TodoListPage() {
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
                <div className="todo-item-buttons">
                  <Link to={`/todo/${todo.id}`} className="btn-detail">
                    Detalji
                  </Link>
                  <button type="button" className="btn-delete" onClick={() => deleteTodo(todo.id)}>
                    Obriši
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

function TodoDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [todo, setTodo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTodoDetails() {
      try {
        setError('')
        setIsLoading(true)
        const response = await fetch(`${API_URL}/${id}`)

        if (!response.ok) {
          throw new Error('Zadatak ne može da se učita sa servera.')
        }

        setTodo(await response.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTodoDetails()
  }, [id])

  return (
    <main className="app-shell">
      <section className="app-header">
        <div>
          <span className="eyebrow">Detalji zadatka</span>
          <h1>Zadatak #{id}</h1>
          <p>Pregled detaljnih informacija o izabranom zadatku.</p>
        </div>
      </section>

      {error && (
        <section className="todo-panel">
          <p className="error">{error}</p>
          <div style={{ padding: '0 18px 18px' }}>
            <button type="button" onClick={() => navigate('/')}>Nazad na listu</button>
          </div>
        </section>
      )}

      {isLoading && !error && (
        <section className="todo-panel">
          <p className="state">Učitavanje detalja zadatka...</p>
        </section>
      )}

      {todo && !isLoading && !error && (
        <section className="todo-details-panel" style={{ marginTop: 0 }} aria-label="Detalji zadatka">
          <div className="todo-details-header">
            <h3>Detalji zadatka #{todo.id}</h3>
            <button type="button" onClick={() => navigate('/')}>Nazad na listu</button>
          </div>
          <div className="todo-details-content">
            <div className="todo-details-row">
              <span className="todo-details-label">Naslov:</span>
              <span className="todo-details-value">{todo.title}</span>
            </div>
            <div className="todo-details-row">
              <span className="todo-details-label">Status:</span>
              <span className={`todo-details-value badge ${todo.completed ? 'completed' : 'active'}`}>
                {todo.completed ? 'Završen' : 'Aktivan'}
              </span>
            </div>
            <div className="todo-details-row">
              <span className="todo-details-label">Kreirano:</span>
              <span className="todo-details-value">
                {new Date(todo.createdAt).toLocaleString('sr-RS')}
              </span>
            </div>
            <div className="todo-details-row">
              <span className="todo-details-label">Poslednja izmena:</span>
              <span className="todo-details-value">
                {new Date(todo.updatedAt).toLocaleString('sr-RS')}
              </span>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/todo/:id" element={<TodoDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
