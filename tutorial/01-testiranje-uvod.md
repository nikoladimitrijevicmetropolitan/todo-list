# 01 - Uvod u testiranje

## Cilj lekcije

Cilj je da studenti razumeju test piramidu i razliku izmedju unit, component, integration, API, E2E i smoke testova. Posle ove lekcije treba da znaju koji nivo testa odgovara kojoj vrsti rizika i zasto se dobar projekat ne oslanja samo na jednu vrstu provere.

## Teorijsko objasnjenje

Testiranje nije jedna aktivnost, vec skup razlicitih provera. Svaki nivo testa ima drugu cenu, brzinu i svrhu. Kada student prvi put pocne da pise testove, cesto pokusava da sve proveri jednim velikim testom. To deluje jednostavno, ali u praksi brzo postaje sporo, krhko i tesko za odrzavanje.

Unit test proverava mali deo logike izolovano. On treba da bude brz, precizan i lak za razumevanje. Ako padne unit test, treba brzo da znamo gde je problem.

Component test proverava jedan deo UI-ja ili jedan deo aplikacije koji ima vidljivo ponasanje. U React svetu to najcesce znaci da renderujemo komponentu, simuliramo korisnicku akciju i proverimo sta korisnik vidi.

Integration test proverava saradnju vise delova sistema. Na backendu to moze biti provera repository sloja sa bazom. Na frontendu to moze biti komponenta koja komunicira sa mockovanim API-jem.

API test proverava ugovor backend-a. Ugovor znaci: koja ruta postoji, koju metodu prima, koji JSON ocekuje, koji status kod vraca i kako izgleda odgovor.

E2E test proverava ceo tok iz ugla korisnika. Browser se otvara, korisnik unosi podatke, frontend salje zahtev backendu, backend cuva podatke, a korisnik vidi rezultat.

Smoke test je najkraca provera da se aplikacija uopste podize. On ne dokazuje da su sve funkcije ispravne, ali brzo otkriva da je nesto fundamentalno pokvareno.

## Test piramida

Test piramida je mentalni model. Na dnu su brojni brzi testovi. U sredini su integracioni i API testovi. Na vrhu je manji broj E2E testova. Ideja nije da se strogo broje testovi, nego da se balansira brzina i poverenje.

Ako imamo samo unit testove, ne znamo da li sistem radi zajedno. Ako imamo samo E2E testove, provere su spore i greske je teze locirati. Dobro testiranje kombinuje nivoe.

Pravilo za izbor nivoa testa:

- ako se logika moze proveriti bez framework-a, koristi unit test;
- ako je vazno sta korisnik vidi u komponenti, koristi component test;
- ako je vazna saradnja sa bazom ili drugim slojem, koristi integration test;
- ako je vazan HTTP ugovor, koristi API test;
- ako je vazan ceo korisnicki tok, koristi E2E test.

## Veza sa Todo aplikacijom

U Todo aplikaciji razliciti nivoi testiranja pokrivaju razlicite rizike:

- unit test moze da proveri validaciju praznog naziva zadatka;
- component test moze da proveri da filter `Aktivni` prikazuje samo nezavrsene zadatke;
- API test moze da proveri da `POST /api/todos` vraca kreirani zadatak;
- integration test moze da proveri da se zadatak zaista cuva u bazi;
- E2E test moze da proveri da korisnik unese zadatak u browseru i vidi ga u listi;
- smoke test moze da proveri da se Spring kontekst podize.

Kada aplikacija poraste, broj mogucih gresaka raste. Testovi pomazu da se promene rade hrabrije, ali ne nepromisljeno. Oni postaju sigurnosna mreza.

## Tipicne greske kod pocetnika

- Testira se implementacija umesto ponasanja.
- Jedan E2E test pokusava da proveri sve.
- Test zavisi od redosleda izvrsavanja drugih testova.
- Test koristi realan server kada mu je dovoljan mock.
- Test nema jasnu poruku o tome sta je pokvareno.
- Test podaci nisu izolovani, pa testovi povremeno padaju.

## Metodologija pisanja testa

Dobar test moze da se opise kroz tri koraka:

1. Arrange: pripremi podatke i stanje.
2. Act: izvrsi akciju koju testiras.
3. Assert: proveri rezultat.

Ovaj obrazac nije obavezan kao komentar u kodu, ali jeste koristan nacin razmisljanja. Ako test nema jasnu pripremu, akciju i proveru, verovatno je previse nejasan.

## Pojmovi za pamcenje

- test piramida;
- brzina testa;
- pouzdanost testa;
- izolacija;
- regresija;
- korisnicki tok;
- ugovor API-ja;
- krhak test;
- test podaci;
- smoke provera.

## Prakticna vezba

Za postojece Todo funkcije napravi tabelu sa kolonama: funkcija, moguci rizik, najbolji nivo testa. U tabelu unesi dodavanje, brisanje, oznacavanje kao zavrseno i filtriranje zadataka.

Zatim za svaku funkciju napisi da li bi prvi test bio unit, component, API ili E2E. Objasni zasto.

## Pitanja za proveru znanja

1. Sta je glavna razlika izmedju unit i integration testa?
2. Zasto E2E testovi ne treba da budu jedini testovi?
3. Koji test bi najbrze otkrio gresku u filteru `Zavrseni`?
4. Sta smoke test treba da potvrdi?
5. Sta znaci da test proverava ponasanje, a ne implementaciju?
6. Zasto je vazna izolacija test podataka?
