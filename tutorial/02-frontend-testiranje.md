# 02 - Frontend testiranje

## Cilj lekcije

Cilj je da studenti razumeju kako se testira React frontend kroz Vitest, React Testing Library, MSW i Playwright. Fokus je na tome sta se testira lokalno u komponentama, sta se mockuje, a sta se proverava kroz pravi browser tok.

Na kraju lekcije student treba da ume da objasni:

- zasto component test ne treba da zavisi od realnog backend-a;
- zasto se UI testira kroz tekst, role i label, a ne kroz privatno stanje komponente;
- kada se koristi MSW;
- kada je potreban Playwright E2E test;
- kako se testira loading, error i empty state.

## Teorijsko objasnjenje

Frontend testiranje ima vise slojeva. Najbrzi sloj su unit i component testovi. Oni proveravaju manje delove UI-ja u kontrolisanom okruzenju. U React aplikaciji to obicno znaci da renderujemo komponentu, pripremimo podatke, simuliramo korisnicku akciju i proverimo sta se vidi na ekranu.

React Testing Library uvodi vazno pravilo: test treba da lici na nacin na koji korisnik koristi aplikaciju. Korisnik ne zna kako se state zove, ne zna kako se komponenta deli interno i ne zna CSS klase koje koristimo. Korisnik vidi tekst, dugmad, input polja, checkbox-eve i poruke. Zato test treba da pronalazi elemente preko dostupnog teksta, label-a, role atributa i vidljivog stanja.

Vitest je test runner koji se dobro uklapa sa Vite projektima. Brz je, radi sa modernim JavaScript modulima i daje dobru razvojnu povratnu informaciju. U ovom projektu je prirodniji izbor od Jest-a jer frontend vec koristi Vite.

MSW, odnosno Mock Service Worker, resava problem API poziva u frontend testovima. Umesto da test stvarno poziva backend na `localhost:8080`, MSW presrece HTTP zahtev i vraca kontrolisan odgovor. Tako test moze da proveri kako se UI ponasa kada backend vrati listu zadataka, gresku ili prazan niz.

Playwright pripada visem nivou. On pokrece pravi browser i proverava ceo korisnicki tok. To daje vise poverenja, ali je sporije i osetljivije na okruzenje. Zato E2E testove treba pisati za najvaznije tokove, a ne za svaku sitnu granu UI logike.

## Sta testirati na frontendu

Frontend Todo aplikacije ima jasne korisnicke situacije:

- inicijalno ucitavanje zadataka;
- prikaz liste kada backend vrati podatke;
- prikaz prazne liste kada nema zadataka;
- prikaz greske kada backend nije dostupan;
- unos novog zadatka;
- zabrana slanja praznog zadatka;
- oznacavanje zadatka kao zavrsenog;
- filtriranje aktivnih i zavrsenih zadataka;
- brisanje zadatka.

Svaka od ovih situacija moze da se testira, ali ne istim nivoom testa. Na primer, disabled dugme za prazan unos je dobar component test. Kompletan tok "dodaj zadatak i proveri da se vidi posle odgovora backend-a" moze biti E2E test.

## Mockovani API naspram pravog API-ja

Mockovani API se koristi kada zelimo brz i stabilan test UI-ja. On nam dozvoljava da kazemo: "Zamisli da backend vraca ova tri zadatka." To je dobro za component testove.

Pravi API se koristi kada zelimo da proverimo da frontend i backend stvarno rade zajedno. To je dobro za E2E testove. U tom slucaju test mora da pokrene i frontend i backend, a cesto i bazu.

Najcesca greska je mesanje ova dva cilja. Ako component test zavisi od realnog backend-a, postaje spor i krhak. Ako E2E test koristi previse mockova, onda vise ne proverava pravi sistem.

## Predlozeni frontend test slojevi

1. Component testovi sa Vitest + React Testing Library:
   - render liste;
   - filter dugmad;
   - forma i disabled stanje;
   - loading i error poruke.

2. API mock testovi sa MSW:
   - uspesan `GET /api/todos`;
   - greska na `GET /api/todos`;
   - uspesan `POST /api/todos`;
   - uspesan `PATCH` i `DELETE`.

3. E2E testovi sa Playwright:
   - otvori aplikaciju;
   - vidi seed zadatke;
   - dodaj novi zadatak;
   - oznaci ga kao zavrsen;
   - filtriraj;
   - obrisi zadatak.

## Veza sa Todo aplikacijom

Postojeci frontend ima `App.jsx` koji direktno poziva `http://localhost:8080/api/todos`. U buducem refaktoru bilo bi korisno izdvojiti API funkcije u poseban modul, na primer `src/api/todos.js`, jer bi tada testovi lakse izolovali komunikaciju. Ipak, tutorial u ovoj fazi ne zahteva implementaciju tog refaktora.

UI ima jasne tekstove na srpskom: `Dodaj`, `Svi`, `Aktivni`, `Zavrseni`, `Lista je prazna`. To je dobro za testiranje kroz korisnicki vidljive signale. Ako test pronadje dugme po tekstu `Dodaj`, on proverava ono sto i korisnik vidi.

## Tipicne greske kod frontend testova

- Pronalaženje elemenata preko CSS klase umesto korisnickog teksta ili role.
- Testiranje internog state-a umesto vidljivog rezultata.
- Previse E2E testova za sitne UI grane.
- Mock koji ne lici na stvarni backend odgovor.
- Zaboravljeno testiranje error stanja.
- Test koji prolazi samo kada se izvrsi posle drugog testa.

## Pojmovi za pamcenje

- Vitest;
- React Testing Library;
- MSW;
- mock API;
- browser E2E;
- accessible role;
- loading state;
- error state;
- empty state;
- user-centric testing.

## Prakticna vezba

Napravi listu test scenarija za `App.jsx`. Za svaki scenario oznaci da li pripada component testu, MSW testu ili E2E testu. Posebno obrati paznju da ne testiras implementacione detalje, vec vidljivo ponasanje.

Primer:

- "Dugme Dodaj je disabled kada je input prazan" je component test.
- "Ako backend vrati 500, prikazuje se poruka greske" je component test sa MSW.
- "Korisnik doda zadatak i vidi ga u listi" je E2E test.

## Pitanja za proveru znanja

1. Zasto component test ne treba da zavisi od pravog backend servera?
2. Kada je bolje koristiti Playwright nego React Testing Library?
3. Sta MSW donosi u odnosu na rucno mockovanje `fetch` funkcije?
4. Zasto je vazno testirati loading i error stanje?
5. Zasto je bolje pronaci dugme po tekstu nego po CSS klasi?
6. Koji frontend test bi najbrze uhvatio pokvaren filter `Aktivni`?
