# 06 - CI/CD kroz GitHub Actions

## Cilj lekcije

Cilj je da studenti razumeju sta je CI/CD i kako GitHub Actions moze automatski da proverava frontend, backend, E2E tokove i Docker build pre spajanja promena.

## Teorijsko objasnjenje

CI znaci continuous integration. Svaka promena se automatski proverava da bi tim brzo saznao da li je nesto pokvareno. CD znaci continuous delivery ili continuous deployment. U ovoj fazi fokus je na CI i pripremi za kasniji CD.

GitHub Actions koristi workflow fajlove koji definisu jobove. Job moze da instalira zavisnosti, pokrene testove, napravi build ili sacuva artifacte. Za full-stack aplikaciju korisno je razdvojiti frontend, backend, E2E i Docker provere.

CI treba da bude dovoljno strog da zaustavi greske, ali dovoljno brz da studenti dobiju povratnu informaciju bez dugog cekanja.

## Veza sa Todo aplikacijom

Za Todo aplikaciju planirani workflow treba da ima:

- backend job: Maven testovi i Testcontainers PostgreSQL;
- frontend job: `npm install`, lint, unit/component testovi i build;
- E2E job: pokretanje stacka i Playwright testovi;
- Docker job: build image-a bez obaveznog pushovanja u registry.

Ako Playwright E2E test padne, CI treba da sacuva trace ili screenshot kao artifact. Tako student moze da vidi sta se dogodilo u browseru.

## Pojmovi za pamcenje

- CI;
- CD;
- GitHub Actions;
- workflow;
- job;
- step;
- artifact;
- pull request gate.

## Prakticna vezba

Nacrtaj CI pipeline za Todo aplikaciju. Redosled neka bude: backend provera, frontend provera, Docker build, E2E provera. Oznaci koji jobovi mogu da rade paralelno, a koji zavise od drugih.

## Pitanja za proveru znanja

1. Zasto CI treba da se pokrece na pull request?
2. Koja je razlika izmedju joba i stepa?
3. Zasto E2E testovi treba da cuvaju screenshot ili trace kada padnu?
4. Zasto Docker build moze biti koristan i pre pravog deployment-a?
