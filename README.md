# Todo Full-Stack Aplikacija

React + Spring Boot Todo aplikacija sa H2 fajl bazom.

## Sta aplikacija radi

- Prikazuje todo zadatke iz backend API-ja.
- Dodaje nove zadatke.
- Oznacava zadatke kao zavrsene ili aktivne.
- Brise zadatke.
- Filtrira prikaz na `Svi`, `Aktivni` i `Zavrseni`.
- Cita pocetne seed podatke iz backend fajla `backend/todo-backend/src/main/resources/seed-todos.csv`.

## Pokretanje

Backend:

```powershell
cd D:\vibe\todo-list\backend\todo-backend
$env:TEMP='D:\vibe\todo-list\.tmp'
$env:TMP='D:\vibe\todo-list\.tmp'
$env:MAVEN_USER_HOME='D:\vibe\todo-list\.m2'
.\mvnw.cmd spring-boot:run
```

Frontend:

```powershell
cd D:\vibe\todo-list\frontend
$env:npm_config_cache='D:\vibe\todo-list\.npm-cache'
npm install
npm run dev
```

Adrese:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api/todos`
- H2 konzola: `http://localhost:8080/h2-console`

## Provere

Backend:

```powershell
cd D:\vibe\todo-list\backend\todo-backend
$env:TEMP='D:\vibe\todo-list\.tmp'
$env:TMP='D:\vibe\todo-list\.tmp'
$env:MAVEN_USER_HOME='D:\vibe\todo-list\.m2'
.\mvnw.cmd test
```

Frontend:

```powershell
cd D:\vibe\todo-list\frontend
$env:npm_config_cache='D:\vibe\todo-list\.npm-cache'
npm run lint
npm run test
npm run build
```

## API

`GET /api/todos`

Vraca sve zadatke, sortirane od najnovijeg ka najstarijem.

`POST /api/todos`

Kreira zadatak.

```json
{
  "title": "Novi zadatak"
}
```

`PATCH /api/todos/{id}`

Menja naziv i/ili status zadatka.

```json
{
  "completed": true
}
```

`DELETE /api/todos/{id}`

Brise zadatak.
