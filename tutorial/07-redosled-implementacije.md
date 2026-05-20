# 07 - Redosled implementacije

## Cilj lekcije

Cilj je da studenti vide praktican redosled kojim se projekat uvecava. Lekcija povezuje sve prethodne teme u jednu mapu rada i objasnjava zasto se faze ne uvode nasumicno.

Na kraju lekcije student treba da ume da objasni:

- zasto se projekat deli na faze;
- sta znaci da faza ima acceptance kriterijum;
- zasto se prvo uvode brze provere;
- zasto baza dolazi pre ozbiljnog E2E CI toka;
- kako se izbegava velika promena koja menja sve odjednom.

## Teorijsko objasnjenje

Velika promena se lakse sprovodi kada se podeli na faze. Svaka faza treba da donese merljivu vrednost i da ostavi projekat u ispravnom stanju. Redosled je vazan: prvo se uvode brze provere, zatim stabilnija baza, zatim okruzenje, pa tek onda kompletna CI/CD automatizacija.

Dobar roadmap ne znaci da sve mora da se uradi odjednom. On znaci da tim zna zasto radi sledeci korak i kako ce proveriti da je uspeo.

Faza je dobro definisana ako ima:

- cilj;
- obim;
- fajlove koji se menjaju;
- komande za proveru;
- kriterijum zavrsetka;
- poznate rizike.

Ako faza nema kriterijum zavrsetka, tesko je reci da li je posao stvarno gotov. Ako nema komandu za proveru, oslanjamo se samo na subjektivni osecaj.

## Predlozeni redosled za Todo aplikaciju

1. Frontend unit/component testovi.
2. Backend API i integracioni testovi.
3. PostgreSQL i Flyway migracije.
4. Docker Compose lokalno okruzenje.
5. GitHub Actions CI.
6. E2E testovi u CI.

Ovim redosledom projekat prvo dobija brzu sigurnosnu mrezu, zatim realniju bazu, pa ponovljivo okruzenje i automatizovane provere.

## Faza 1: frontend unit/component testovi

Cilj je da UI dobije brzu proveru osnovnog ponasanja. Ova faza ne zahteva backend server.

Tipicne promene:

- dodavanje Vitest-a;
- dodavanje React Testing Library;
- dodavanje MSW-a;
- testovi za formu, filtere, loading i error stanja;
- npm skripte za testove.

Acceptance kriterijum:

- `npm run test` prolazi;
- `npm run lint` prolazi;
- najvaznija UI stanja su pokrivena.

## Faza 2: backend API i integracioni testovi

Cilj je da backend dobije testove za ugovor koji frontend koristi. Ova faza uvodi ozbiljniju proveru endpointa.

Tipicne promene:

- API testovi za CRUD;
- negativni testovi za validaciju i 404;
- repository testovi;
- Testcontainers PostgreSQL za integraciju;
- test profil.

Acceptance kriterijum:

- `mvn test` prolazi;
- testovi proveravaju happy path i greske;
- baza u integracionim testovima odgovara buducem PostgreSQL cilju.

## Faza 3: PostgreSQL + Flyway

Cilj je da struktura baze postane verzionisana i ponovljiva.

Tipicne promene:

- PostgreSQL driver;
- Flyway dependency;
- migracije u `src/main/resources/db/migration`;
- Spring profili;
- prelazak sa H2 kao glavne baze na PostgreSQL kao glavni dev profil.

Acceptance kriterijum:

- aplikacija radi sa PostgreSQL;
- Flyway migracije se izvrsavaju pri startu;
- testovi prolaze sa Testcontainers PostgreSQL;
- H2 je jasno oznacen kao fallback, ako ostaje.

## Faza 4: Docker Compose

Cilj je da ceo sistem moze da se pokrene jednim komandnim tokom.

Tipicne promene:

- Dockerfile za backend;
- Dockerfile za frontend;
- `docker-compose.yml`;
- environment varijable;
- PostgreSQL volume.

Acceptance kriterijum:

- `docker compose up --build` podize sve servise;
- frontend komunicira sa backendom;
- backend komunicira sa PostgreSQL bazom;
- podaci ostaju posle restartovanja PostgreSQL containera.

## Faza 5: GitHub Actions CI

Cilj je da pull request automatski proverava kvalitet.

Tipicne promene:

- workflow za backend;
- workflow za frontend;
- cache za Maven i npm;
- Docker build job;
- branch protection pravila kasnije.

Acceptance kriterijum:

- CI se pokrece na pull request i push;
- backend i frontend jobovi prolaze;
- neuspesan test blokira merge;
- logovi su dovoljno jasni za dijagnozu.

## Faza 6: E2E testovi u CI

Cilj je da najvazniji korisnicki tokovi budu provereni u realnom okruzenju.

Tipicne promene:

- Playwright konfiguracija;
- testovi za dodavanje, filtriranje, zavrsavanje i brisanje;
- pokretanje stacka pre E2E testa;
- cuvanje screenshot/trace artifacta.

Acceptance kriterijum:

- E2E testovi prolaze lokalno;
- E2E testovi prolaze u CI;
- artifacti postoje kada test padne;
- testovi pokrivaju glavne tokove, ne svaku sitnicu.

## Veza sa Todo aplikacijom

Ovaj redosled cuva stabilnost projekta. Ne uvodimo Docker pre nego sto znamo sta treba pokrenuti. Ne uvodimo E2E CI pre nego sto imamo stabilan backend i frontend build. Ne prelazimo na PostgreSQL bez plana za migracije.

Drugim recima, svaka faza priprema sledecu.

## Pojmovi za pamcenje

- fazna implementacija;
- acceptance kriterijum;
- regresiona zastita;
- lokalna provera;
- CI provera;
- stabilan main branch;
- zavisnost izmedju faza;
- obim promene.

## Prakticna vezba

Za svaku fazu napisi:

- cilj faze;
- fajlove koji ce se najverovatnije menjati;
- komandu kojom se faza proverava;
- rizik ako se faza preskoci.

Zatim oznaci koje faze mogu da se rade paralelno, a koje moraju ici redom.

## Pitanja za proveru znanja

1. Zasto frontend testovi mogu da dodju pre Docker-a?
2. Zasto je bolje uvesti PostgreSQL pre ozbiljnog E2E CI toka?
3. Koji je minimum da bi faza bila zavrsena?
4. Kako znamo da roadmap nije samo lista zelja nego plan rada?
5. Zasto svaka faza treba da ima komandu za proveru?
6. Sta se desava ako se previse promena uvede u jednoj fazi?
