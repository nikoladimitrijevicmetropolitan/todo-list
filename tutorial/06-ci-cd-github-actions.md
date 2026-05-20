# 06 - CI/CD kroz GitHub Actions

## Cilj lekcije

Cilj je da studenti razumeju sta je CI/CD i kako GitHub Actions moze automatski da proverava frontend, backend, E2E tokove i Docker build pre spajanja promena.

Na kraju lekcije student treba da ume da objasni:

- zasto CI postoji;
- sta je workflow, job i step;
- koje provere treba da postoje za full-stack aplikaciju;
- zasto se jobovi razdvajaju;
- sta su artifacti;
- kako CI cuva stabilnost glavne grane.

## Teorijsko objasnjenje

CI znaci continuous integration. Svaka promena se automatski proverava da bi tim brzo saznao da li je nesto pokvareno. U praksi to znaci da pull request ne treba da se spoji dok ne prodju dogovorene provere.

CD znaci continuous delivery ili continuous deployment. Continuous delivery znaci da je aplikacija spremna za isporuku, ali covek odlucuje kada se isporucuje. Continuous deployment znaci da se uspesna promena automatski isporucuje. U ovoj fazi fokus je na CI i pripremi za kasniji CD.

GitHub Actions koristi workflow fajlove koji definisu jobove. Job moze da instalira zavisnosti, pokrene testove, napravi build ili sacuva artifacte. Za full-stack aplikaciju korisno je razdvojiti frontend, backend, E2E i Docker provere.

CI treba da bude dovoljno strog da zaustavi greske, ali dovoljno brz da studenti dobiju povratnu informaciju bez dugog cekanja.

## Osnovni pojmovi

Workflow je YAML fajl koji opisuje automatizaciju. Najcesce se pokrece na `push` ili `pull_request`.

Job je grupa koraka koja se izvrsava na jednom runner-u. Jobovi mogu da rade paralelno ili da zavise jedni od drugih.

Step je jedna akcija unutar joba: checkout koda, instalacija zavisnosti, pokretanje testova ili build.

Runner je masina na kojoj se job izvrsava.

Artifact je fajl koji CI sacuva posle izvrsavanja. Kod E2E testova artifact moze biti screenshot, trace ili report.

## Veza sa Todo aplikacijom

Za Todo aplikaciju planirani workflow treba da ima:

- backend job: Maven testovi i Testcontainers PostgreSQL;
- frontend job: `npm install`, lint, unit/component testovi i build;
- E2E job: pokretanje stacka i Playwright testovi;
- Docker job: build image-a bez obaveznog pushovanja u registry.

Backend i frontend jobovi mogu da rade paralelno. E2E job treba da zavisi od toga da su osnovne provere prosle, jer nema smisla pokretati spor browser test ako build vec pada. Docker build moze biti odvojen job koji proverava da se image-i mogu napraviti.

Ako Playwright E2E test padne, CI treba da sacuva trace ili screenshot kao artifact. Tako student moze da vidi sta se dogodilo u browseru.

## Pull request kao kapija kvaliteta

Glavna grana treba da bude stabilna. Pull request je mesto gde se promena proverava pre spajanja. CI pomaze timu da pravila kvaliteta ne zavise od rucnog secanja.

Primer pravila:

- backend testovi moraju proci;
- frontend lint i build moraju proci;
- unit/component testovi moraju proci;
- E2E testovi moraju proci za glavne tokove;
- Docker image-i moraju moci da se naprave.

Ako neka provera padne, pull request ne treba spajati dok se problem ne resi.

## Tipicne greske

- CI pokrece samo build, ali ne i testove.
- CI koristi drugaciju verziju Node-a ili Java-e od lokalne dokumentacije.
- E2E testovi ne cuvaju artifacte, pa je tesko razumeti pad.
- Workflow je prespor jer sve radi u jednom jobu.
- Secrets se upisuju u workflow kao obican tekst.
- Testcontainers se koristi bez Docker dostupnosti na runner-u.

## Pojmovi za pamcenje

- CI;
- CD;
- GitHub Actions;
- workflow;
- job;
- step;
- runner;
- artifact;
- pull request gate;
- branch protection.

## Prakticna vezba

Nacrtaj CI pipeline za Todo aplikaciju. Redosled neka bude: backend provera, frontend provera, Docker build, E2E provera. Oznaci koji jobovi mogu da rade paralelno, a koji zavise od drugih.

Zatim napisi koje komande svaki job treba da pokrene.

## Pitanja za proveru znanja

1. Zasto CI treba da se pokrece na pull request?
2. Koja je razlika izmedju joba i stepa?
3. Zasto E2E testovi treba da cuvaju screenshot ili trace kada padnu?
4. Zasto Docker build moze biti koristan i pre pravog deployment-a?
5. Zasto je opasno imati CI koji ne pokrece testove?
6. Koji jobovi u Todo aplikaciji mogu da rade paralelno?
