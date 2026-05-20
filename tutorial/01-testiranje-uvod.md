# 01 - Uvod u testiranje

## Cilj lekcije

Cilj je da studenti razumeju test piramidu i razliku izmedju unit, component, integration, API, E2E i smoke testova. Posle ove lekcije treba da znaju koji nivo testa odgovara kojoj vrsti rizika.

## Teorijsko objasnjenje

Testiranje nije jedna aktivnost, vec skup razlicitih provera. Svaki nivo testa ima drugu cenu, brzinu i svrhu.

Unit test proverava mali deo logike izolovano. Component test proverava UI komponentu ili manji deo interfejsa. Integration test proverava saradnju vise delova sistema, na primer repository sloj i bazu. API test proverava ugovor koji backend izlaže spoljnim klijentima. E2E test proverava kompletan tok iz ugla korisnika. Smoke test je kratak test koji potvrdjuje da se aplikacija uopste podize.

Test piramida kaze da treba imati mnogo brzih testova na dnu, manje integracionih testova u sredini i mali broj E2E testova na vrhu. Razlog je jednostavan: sto test proverava veci deo sistema, to je sporiji i osetljiviji na okruzenje.

## Veza sa Todo aplikacijom

U Todo aplikaciji razliciti nivoi testiranja pokrivaju razlicite rizike:

- unit test moze da proveri validaciju praznog naziva zadatka;
- component test moze da proveri da filter `Aktivni` prikazuje samo nezavrsene zadatke;
- API test moze da proveri da `POST /api/todos` vraca kreirani zadatak;
- integration test moze da proveri da se zadatak zaista cuva u bazi;
- E2E test moze da proveri da korisnik unese zadatak u browseru i vidi ga u listi.

## Pojmovi za pamcenje

- test piramida;
- brzina testa;
- pouzdanost testa;
- izolacija;
- regresija;
- korisnicki tok;
- ugovor API-ja.

## Prakticna vezba

Za postojece Todo funkcije napravi tabelu sa kolonama: funkcija, moguci rizik, najbolji nivo testa. U tabelu unesi dodavanje, brisanje, oznacavanje kao zavrseno i filtriranje zadataka.

## Pitanja za proveru znanja

1. Sta je glavna razlika izmedju unit i integration testa?
2. Zasto E2E testovi ne treba da budu jedini testovi?
3. Koji test bi najbrze otkrio gresku u filteru `Zavrseni`?
4. Sta smoke test treba da potvrdi?
