# 03 - Backend testiranje

## Cilj lekcije

Cilj je da studenti razumeju backend test slojeve u Spring Boot aplikaciji: unit, repository, controller/API i integracione testove. Poseban fokus je na tome zasto Testcontainers PostgreSQL bolje priprema projekat za buducu produkcijsku bazu nego H2.

Na kraju lekcije student treba da ume da objasni:

- sta proverava `contextLoads`, a sta ne proverava;
- zasto se HTTP ugovor testira posebno;
- kako se proverava validacija ulaznih podataka;
- zasto baza u testu treba da lici na realnu bazu;
- gde se uklapa Testcontainers.

## Teorijsko objasnjenje

Backend testiranje proverava poslovna pravila, HTTP ugovor, rad sa bazom i konfiguraciju aplikacije. Jedan `contextLoads` test je dobar kao smoke test, ali nije dovoljan za poverenje u funkcionalnost. On govori da Spring kontekst moze da se podigne, ali ne govori da endpointi vracaju ispravne statuse, da validacija radi ili da repository cuva podatke kako ocekujemo.

Unit test proverava logiku bez Spring konteksta. Takav test je brz i precizan. Ako imamo servis koji normalizuje naslov zadatka ili parsira seed podatke, to je dobar kandidat za unit test.

Repository test proverava mapiranje entiteta i upite ka bazi. On odgovara na pitanje: da li JPA entitet stvarno odgovara tabeli i da li upit vraca podatke u ocekivanom redosledu?

Controller ili API test proverava HTTP sloj. Tu nas zanimaju status kodovi, JSON oblik, validacija i greske. API test treba da tretira backend kao ugovor: klijent salje zahtev i dobija odgovor.

Integracioni test proverava vise slojeva zajedno. U ozbiljnijem projektu to znaci da backend koristi stvarnu bazu ili bazu koja veoma lici na produkcijsku. Zato se uvodi Testcontainers PostgreSQL.

## Zasto Testcontainers

H2 je koristan za brz start, ali moze da sakrije razlike u SQL dijalektu. PostgreSQL ima svoja pravila za tipove, indekse, constraint-e, transakcije i SQL sintaksu. Ako testovi rade samo na H2, moguce je da prodju lokalno, a padnu kada aplikacija predje na PostgreSQL.

Testcontainers pokrece pravi PostgreSQL u container-u tokom testa. Test dobija izolovanu bazu, a kada se zavrsi, container se gasi. To je sporije od H2, ali mnogo vernije buducem runtime-u.

U CI okruzenju Testcontainers je posebno koristan jer ne zavisimo od rucno instalirane baze. CI job sam podize ono sto mu treba.

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

Trenutni backend ima `Todo`, `TodoRepository`, `TodoController` i `TodoSeedDataLoader`. To daje prirodne tacke za testiranje. Repository testovi proveravaju cuvanje i sortiranje. Controller testovi proveravaju HTTP ponasanje. Seed loader testovi proveravaju da se seed ne dodaje kada baza nije prazna.

## Predlozeni backend test slojevi

1. Smoke test:
   - Spring kontekst se podize.

2. Unit testovi:
   - validacija praznog naslova;
   - parsiranje seed fajla ako ta logika ostane u kodu;
   - mapiranje seed zapisa u `Todo`.

3. Repository testovi:
   - cuvanje novog zadatka;
   - sortiranje po `createdAt` opadajuce;
   - update `completed` vrednosti.

4. API testovi:
   - CRUD endpointi;
   - 400 za neispravan zahtev;
   - 404 za nepostojeci `id`;
   - CORS preflight.

5. Integracioni testovi:
   - Spring Boot + PostgreSQL Testcontainers;
   - Flyway migracije kada budu uvedene;
   - kompletan backend tok bez frontenda.

## Tipicne greske kod backend testova

- Test pokrece ceo Spring kontekst iako mu treba obican unit test.
- Test proverava samo happy path.
- Test ne proverava status kod.
- Test ne proverava negativne slucajeve.
- Test koristi H2, a tvrdi da proverava PostgreSQL ponasanje.
- Test podaci ostaju u bazi i uticu na sledeci test.

## Pojmovi za pamcenje

- JUnit;
- Spring Boot test;
- repository test;
- API test;
- integration test;
- Testcontainers;
- HTTP status kod;
- CORS;
- test profile;
- izolovana baza.

## Prakticna vezba

Napravi matricu backend testova. Redovi su endpointi, a kolone su happy path, validacija, greske i baza. Za svaki endpoint napisi najmanje jedan test koji bi student kasnije implementirao.

Zatim oznaci koji testovi treba da rade sa H2, a koji sa Testcontainers PostgreSQL. Objasni zasto.

## Pitanja za proveru znanja

1. Zasto `contextLoads` nije dovoljan test za backend?
2. Koja je razlika izmedju controller testa i integracionog testa?
3. Zasto Testcontainers PostgreSQL bolje odgovara buducem stanju aplikacije od H2?
4. Koji test treba da proveri 404 za nepostojeci todo?
5. Sta znaci da API test proverava ugovor?
6. Zasto negativni testovi imaju istu vrednost kao happy path testovi?
