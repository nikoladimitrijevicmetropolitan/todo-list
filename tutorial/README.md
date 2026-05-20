# Tutorial: testiranje, baza, Docker i CI/CD

## Cilj lekcije

Ovaj folder je studentski vodic kroz faze uvecanja Todo aplikacije. Cilj je da studenti razumeju zasto uvodimo razlicite nivoe testiranja, kako se backend postepeno priprema za PostgreSQL i Flyway, i kako Docker i CI/CD pomazu da projekat bude ponovljiv.

## Preduslovi

Student treba da poznaje osnove:

- React komponenti i rada sa formama;
- REST API-ja;
- Spring Boot aplikacije;
- relacione baze podataka;
- rada iz komandne linije;
- osnovnog Git toka rada.

## Redosled lekcija

1. [Uvod u testiranje](01-testiranje-uvod.md)
2. [Frontend testiranje](02-frontend-testiranje.md)
3. [Backend testiranje](03-backend-testiranje.md)
4. [PostgreSQL i Flyway](04-baza-postgresql-flyway.md)
5. [Docker](05-docker.md)
6. [CI/CD kroz GitHub Actions](06-ci-cd-github-actions.md)
7. [Redosled implementacije](07-redosled-implementacije.md)

Vizuelni materijali se cuvaju u [assets](assets/README.md).

## Teorijsko objasnjenje

Todo aplikacija je mala, ali je dovoljno kompletna da prikaze realne faze razvoja: frontend poziva backend, backend cuva podatke, baza ima seed podatke, a aplikacija ima jasne korisnicke tokove. Zbog toga je dobra osnova za ucenje testiranja i isporuke softvera.

Materijal ide od najbrzih testova ka najskupljim proverama. Unit i component testovi daju brzu povratnu informaciju. API i integracioni testovi proveravaju ugovore i rad sa bazom. E2E testovi proveravaju ceo korisnicki tok. Docker i CI/CD zatvaraju pricu tako sto okruzenje cine ponovljivim.

## Veza sa Todo aplikacijom

Postojeca aplikacija ima React frontend, Spring Boot backend i H2 bazu. Tutorial objasnjava kako se taj sistem siri ka zrelijoj arhitekturi:

- frontend testovi proveravaju UI i korisnicke tokove;
- backend testovi proveravaju REST API, validaciju i bazu;
- PostgreSQL i Flyway uvode stabilniji nacin rada sa podacima;
- Docker Compose omogucava da ceo sistem radi jednim komandnim tokom;
- GitHub Actions proverava promene pre spajanja u glavnu granu.

## Pojmovi za pamcenje

- test piramida;
- unit test;
- component test;
- integration test;
- API test;
- E2E test;
- migracija baze;
- Docker image;
- Docker container;
- CI/CD pipeline.

## Prakticna vezba

Procitaj sve naslove lekcija i napravi mapu puta: koja faza proverava frontend, koja backend, koja bazu, a koja isporuku aplikacije. Zatim za svaki nivo napisi po jedan primer greske koju bi taj nivo mogao da uhvati.

## Pitanja za proveru znanja

1. Zasto nije dovoljno imati samo E2E testove?
2. Zasto je vazno da CI pokrece i frontend i backend provere?
3. Koja je razlika izmedju lokalnog okruzenja i CI okruzenja?
4. Zasto je Todo aplikacija dobar primer za ucenje testiranja?
