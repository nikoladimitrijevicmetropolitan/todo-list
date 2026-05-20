# Roadmap za uvecanje Todo aplikacije

## Summary

Planirati evoluciju postojece React + Spring Boot Todo aplikacije u projekat koji jasno prikazuje sve nivoe testiranja na frontendu i backendu, uz buduci GitHub Actions CI/CD, Docker Compose lokalno okruzenje i migraciju sa H2 na PostgreSQL preko Flyway migracija.

Postojeci REST API ostaje kompatibilan.

## Key Changes

### Frontend testiranje

- Dodati Vitest + React Testing Library za unit/component testove: render liste, filteri, disabled submit za prazan unos, error/loading stanja.
- Mockovati backend pozive kroz MSW, da frontend testovi ne zavise od pravog servera.
- Dodati Playwright E2E testove za tokove: ucitavanje seed zadataka, dodavanje, zavrsavanje, filtriranje i brisanje.
- Dodati npm skripte: `test`, `test:ui`, `test:e2e`, `test:coverage`.

### Backend testiranje

- Uvesti slojeve testova: unit testovi za validaciju/seed parsing, repository testovi, controller/API testovi i integracione testove.
- Koristiti Testcontainers PostgreSQL za backend integracione testove i CI, da testovi rade protiv baze koja odgovara buducem runtime-u.
- Dodati API testove za `GET`, `POST`, `PATCH`, `DELETE`, validaciju praznog `title`, 404 za nepostojeci `id` i CORS za `localhost`/`127.0.0.1`.
- Zadrzati jedan smoke `contextLoads`, ali ga dopuniti stvarnim test pokrivanjem.

### PostgreSQL + Flyway

- Dodati PostgreSQL driver i Flyway dependency u backend.
- Uvesti Spring profile: `local-h2` kao privremeni fallback, `local-postgres` kao glavni dev profil, `test` za Testcontainers.
- Kreirati Flyway migracije kao izvor istine, na primer `V1__create_todos_table.sql` i po potrebi `V2__seed_todos.sql`.
- Prebaciti seed logiku sa runtime CSV loadera na Flyway seed migraciju ili jasno odvojiti `dev` seed migraciju, da baza bude reproduktivna.

### Docker i CI/CD

- Dodati lokalni `docker-compose.yml` sa servisima: `postgres`, `backend`, `frontend`.
- Backend Dockerfile: multi-stage Maven build, runtime Java image, konfiguracija preko environment varijabli.
- Frontend Dockerfile za dev compose, uz Vite server i API URL konfiguraciju.
- GitHub Actions workflow:
  - backend: Maven testovi + Testcontainers PostgreSQL;
  - frontend: npm install, lint, unit/component testovi, build;
  - e2e: pokretanje compose stacka i Playwright testova;
  - Docker: build image-a kao priprema za kasniji push/deploy.

## Test Plan

### Lokalno

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run test:e2e`
- `mvn test` sa Testcontainers PostgreSQL
- `docker compose up --build` i rucna provera frontend/backend komunikacije

### CI

- Pull request mora da prodje backend, frontend i E2E jobove.
- Playwright cuva trace/screenshot artifacte za neuspele E2E testove.
- Docker build job proverava da image-i mogu da se naprave bez pushovanja u registry u prvoj fazi.

## Assumptions

- CI/CD platforma je GitHub Actions.
- Frontend stack za testove je Vitest + React Testing Library + MSW + Playwright.
- Backend integracioni testovi koriste Testcontainers PostgreSQL.
- PostgreSQL postaje glavna baza; H2 ostaje samo privremeni lokalni fallback, ne dugorocni izvor istine.
- Docker prvi cilj je lokalni development compose, ne produkcijski deployment.
- REST API ostaje isti: `/api/todos` sa `GET`, `POST`, `PATCH`, `DELETE`.
