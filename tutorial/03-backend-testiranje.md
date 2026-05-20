# 03 - Backend testiranje

## Cilj lekcije

Cilj je da studenti razumeju backend test slojeve u Spring Boot aplikaciji: unit, repository, controller/API i integracione testove. Poseban fokus je na tome zasto Testcontainers PostgreSQL bolje priprema projekat za buducu produkcijsku bazu nego H2.

## Teorijsko objasnjenje

Backend testiranje proverava poslovna pravila, HTTP ugovor, rad sa bazom i konfiguraciju aplikacije. Jedan `contextLoads` test je dobar kao smoke test, ali nije dovoljan za poverenje u funkcionalnost.

Unit test proverava logiku bez Spring konteksta. Repository test proverava mapiranje entiteta i upite ka bazi. Controller ili API test proverava HTTP status kodove, JSON oblik i validaciju. Integracioni test proverava vise slojeva zajedno, idealno protiv baze koja lici na produkcijsku.

Testcontainers omogucava da test pokrene pravi PostgreSQL container. Time se hvataju razlike koje H2 moze da sakrije: SQL dijalekat, tipovi podataka, migracije i ponasanje indeksa ili ogranicenja.

## Veza sa Todo aplikacijom

Todo backend treba da testira:

- `GET /api/todos` vraca listu sortiranu od najnovijeg ka najstarijem;
- `POST /api/todos` kreira zadatak sa obaveznim `title`;
- `PATCH /api/todos/{id}` menja `title` i/ili `completed`;
- `DELETE /api/todos/{id}` brise zadatak;
- prazan `title` vraca gresku;
- nepostojeci `id` vraca 404;
- CORS prihvata `localhost:5173` i `127.0.0.1:5173`;
- seed podaci postoje samo kada baza treba da ih dobije.

## Pojmovi za pamcenje

- JUnit;
- Spring Boot test;
- repository test;
- API test;
- integration test;
- Testcontainers;
- HTTP status kod;
- CORS.

## Prakticna vezba

Napravi matricu backend testova. Redovi su endpointi, a kolone su happy path, validacija, greske i baza. Za svaki endpoint napisi najmanje jedan test koji bi student kasnije implementirao.

## Pitanja za proveru znanja

1. Zasto `contextLoads` nije dovoljan test za backend?
2. Koja je razlika izmedju controller testa i integracionog testa?
3. Zasto Testcontainers PostgreSQL bolje odgovara buducem stanju aplikacije od H2?
4. Koji test treba da proveri 404 za nepostojeci todo?
