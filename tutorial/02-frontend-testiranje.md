# 02 - Frontend testiranje

## Cilj lekcije

Cilj je da studenti razumeju kako se testira React frontend kroz Vitest, React Testing Library, MSW i Playwright. Fokus je na tome sta se testira lokalno u komponentama, a sta kroz pravi browser tok.

## Teorijsko objasnjenje

Frontend testiranje ima vise slojeva. Unit i component testovi proveravaju kako komponenta renderuje podatke i reaguje na korisnicku akciju. Ti testovi treba da budu brzi i stabilni. React Testing Library podstice testiranje kroz ono sto korisnik vidi: tekst, role, label i stanje elemenata.

MSW sluzi za mockovanje HTTP poziva. Umesto da frontend test zavisi od pravog backend servera, test moze da definise kontrolisane odgovore za `GET`, `POST`, `PATCH` i `DELETE`. Tako test ostaje brz, a ipak proverava ponasanje aplikacije oko API poziva.

Playwright se koristi za E2E testove. On otvara pravi browser i proverava kompletan korisnicki tok. Ovi testovi su vredni, ali sporiji, pa ih treba koristiti za najvaznije tokove.

## Veza sa Todo aplikacijom

Frontend Todo aplikacije treba da pokrije:

- prikaz seed zadataka iz API odgovora;
- stanje ucitavanja dok podaci stizu;
- praznu listu kada nema zadataka;
- gresku kada backend nije dostupan;
- disabled dugme kada je unos prazan;
- dodavanje novog zadatka;
- oznacavanje zadatka kao zavrsenog;
- filtriranje kroz `Svi`, `Aktivni` i `Zavrseni`;
- brisanje zadatka.

Unit/component testovi treba da koriste MSW. Playwright E2E testovi treba da pokrenu frontend i backend zajedno i prodju kroz stvaran tok u browseru.

## Pojmovi za pamcenje

- Vitest;
- React Testing Library;
- MSW;
- mock API;
- browser E2E;
- accessible role;
- loading state;
- error state.

## Prakticna vezba

Napravi listu test scenarija za `App.jsx`. Za svaki scenario oznaci da li pripada component testu ili E2E testu. Posebno obrati paznju da ne testiras implementacione detalje, vec vidljivo ponasanje.

## Pitanja za proveru znanja

1. Zasto component test ne treba da zavisi od pravog backend servera?
2. Kada je bolje koristiti Playwright nego React Testing Library?
3. Sta MSW donosi u odnosu na rucno mockovanje `fetch` funkcije?
4. Zasto je vazno testirati loading i error stanje?
