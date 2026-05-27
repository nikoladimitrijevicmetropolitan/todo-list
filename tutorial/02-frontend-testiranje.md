# 02 - Frontend testiranje (Prošireno izdanje)

## Cilj lekcije

Cilj ove lekcije je da studenti razumeju kako se testira moderan React frontend kroz alate **Vitest**, **React Testing Library (RTL)**, **Mock Service Worker (MSW)** i **Playwright**. 

Fokus je na jasnom razumevanju nivoa testiranja (šta se testira lokalno u komponentama, šta se simulira/mock-uje, a šta se proverava kroz stvaran korisnički tok u browseru) i kako se testira ponašanje rutiranja (prelazak na stranu sa detaljima) koje smo uveli pomoću **React Router** biblioteke.

Na kraju lekcije student treba da ume da objasni:

- Zašto komponentni testovi moraju biti potpuno izolovani od stvarnog backend servera.
- Zašto se UI testira kroz pristupačne role (roles), labele i tekst, a ne kroz interno stanje komponente ili CSS klase.
- Kako se koristi **MSW** za presretanje mrežnih HTTP zahteva i definisanje stabilnih test scenarija.
- Kada je neophodno uvesti **Playwright E2E** testove i kako se kroz njih proverava rutiranje (`/todo/:id`).
- Kako se sistematski testiraju asinhrona stanja: učitavanje (loading), prazna lista (empty state) i serverska greška (error state).

---

## Teorijsko objašnjenje

Testiranje frontenda se deli na tri osnovna nivoa koja čine piramidu testiranja. Svaki nivo ima svoju svrhu, brzinu i stepen pouzdanosti.

### 1. Komponentni testovi (Unit & Component Testing)
Najbrži i najstabilniji sloj testova. Oni renderuju pojedinačnu React komponentu u virtuelnom okruženju (`jsdom`) bez pokretanja pravog browsera.

*   **Zlatno pravilo (React Testing Library):** RTL promoviše testiranje koje imitira stvarnog korisnika. Korisnik ne zna kako se interno zovu stanja (`useState`), ne zna nazive JavaScript funkcija niti klase u CSS-u. Korisnik pronalazi elemente na ekranu gledajući tekst, naslove, labele i reaguje na promenu stanja (npr. dugme postaje sivo/disabled).
*   **Vitest:** Brz test runner koji radi direktno sa Vite konfiguracijom. U našem projektu on zamenjuje Jest jer je integrisan sa našim build alatom i omogućava trenutni re-run testova pri izmenama (Watch mode).

### 2. Integracioni testovi sa API Mockovanjem (MSW)
Kada komponente vrše asinhrone API pozive (npr. preuzimanje liste zadataka sa `GET /api/todos`), testovi ne smeju da zavise od pravog servera. 
*   Rukom pisani `mock` za globalni `fetch` je krhk i težak za održavanje.
*   **Mock Service Worker (MSW)** rešava ovaj problem na elegantan način: on registruje virtuelni mrežni sloj, presreće HTTP zahteve koje šalje naša aplikacija i vraća kontrolisane JSON odgovore. To nam omogućava da lako testiramo "Happy Path" (kada backend radi), ali i granične slučajeve (kada backend vrati 500 grešku ili kada je lista prazna).

### 3. End-to-End testovi (E2E)
Najviši nivo provere. Pokreće se kompletan sistem: stvarni backend (sa bazom podataka), stvarni frontend i pravi web browser (Chromium, Firefox ili WebKit) kojim upravlja **Playwright**.
*   Ovi testovi daju najveću sigurnost jer dokazuju da sve komponente sistema uspešno komuniciraju.
*   Playwright je idealan za testiranje celokupnih tokova rada korisnika, uključujući i navigaciju kroz rute (prelazak sa liste `/` na stranu sa detaljima `/todo/:id` i povratak nazad) jer se test izvršava u stvarnom ruteru i browseru.

---

## Šta testirati na frontendu (Todo Aplikacija)

Zahvaljujući uvođenju React Router-a i detaljnog prikaza zadataka, naša aplikacija ima jasne tokove ponašanja koje studenti moraju da pokriju testovima:

1.  **Forma za unos:** Dugme "Dodaj" je onemogućeno (`disabled`) kada je input prazan, a omogućeno čim korisnik unese ispravan naslov.
2.  **Asinhroni render:** Prikaz poruke *"Učitavanje zadataka..."* dok se podaci preuzimaju sa API-ja.
3.  **Prazna lista:** Ako je odgovor sa servera prazan niz `[]`, na ekranu se ispisuje *"Lista je prazna. Dodaj prvi zadatak."*
4.  **Serverska greška:** Ako server padne (MSW simulira HTTP 500), korisniku se ispisuje crvena greška na ekranu.
5.  **Deklarativno rutiranje na detalje (Novo):** Klikom na dugme *"Detalji"* u listi, aplikacija menja rutu na `/todo/:id` i prikazuje detaljne podatke zadatka (ID, Naslov, Status sa značkom, Vreme kreiranja i izmene).
6.  **Navigacija unazad (Novo):** Klikom na dugme *"Nazad na listu"*, ruter vraća korisnika na glavnu rutu `/`.

---

## Mockovani API naspram pravog API-ja

> [!IMPORTANT]
> **Komponentni i MSW testovi** koriste **mockovani** API. Oni su brzi, stabilni i ne zavise od toga da li je Spring Boot server pokrenut ili ugašen.
> 
> **E2E testovi (Playwright)** koriste **pravi** API i stvarnu H2/PostgreSQL bazu. Oni proveravaju integraciju i pokreću se u sklopu Continuous Integration (CI) procesa.

Mešanje ova dva pristupa je velika inženjerska greška. Ako vaš jednostavan test forme zavisi od pokrenute H2 baze podataka, taj test će često padati bez razloga (flaky test).

---

## Predloženi slojevi i primeri kodova za testiranje

### 1. RTL komponentni test (Primer za formu)
Studenti pišu test koji proverava ispravnost forme bez pokretanja servera:
```javascript
// App.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import TodoListPage from './App'

test('Dugme Dodaj je onemoguceno kada je polje prazno', async () => {
  render(
    <MemoryRouter>
      <TodoListPage />
    </MemoryRouter>
  )
  
  const input = screen.getByPlaceholderText(/unesi novi zadatak/i)
  const button = screen.getByRole('button', { name: /dodaj/i })
  
  expect(button).toBeDisabled()
  
  await userEvent.type(input, 'Kupiti mleko')
  expect(button).toBeEnabled()
})
```

### 2. MSW Integracioni test (Primer za grešku na serveru)
MSW presreće poziv i vraća grešku da bismo testirali otpornost UI-ja:
```javascript
// server-error.test.jsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TodoListPage from './App'

const server = setupServer(
  http.get('http://localhost:8080/api/todos', () => {
    return new HttpResponse(null, { status: 500 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('Prikazuje se poruka o greski kada API vrati 500', async () => {
  render(
    <MemoryRouter>
      <TodoListPage />
    </MemoryRouter>
  )
  
  const errorMessage = await screen.findByText(/Zadaci trenutno ne mogu da se učitaju/i)
  expect(errorMessage).toBeInTheDocument()
})
```

### 3. Playwright E2E test (Primer za navigaciju na detalje)
Test pokreće pravi browser i proverava prelazak na rute:
```javascript
// todo-flow.spec.js
import { test, expect } from '@playwright/test'

test('Korisnik moze da klikne na Detalji i vidi podatke o zadatku', async ({ page }) => {
  // 1. Otvori pocetnu stranu
  await page.goto('http://localhost:5173/')
  
  // 2. Klikni na prvo dugme "Detalji"
  const detailsLink = page.locator('.btn-detail').first()
  await detailsLink.click()
  
  // 3. Proveri da li se URL promenio na rutu detalja
  await expect(page).toHaveURL(/\/todo\/\d+/)
  
  // 4. Proveri da li se renderovala kartica sa naslovom i statusom
  await expect(page.locator('.todo-details-panel')).toBeVisible()
  await expect(page.locator('.todo-details-label').first()).toHaveText('Naslov:')
  
  // 5. Klikni nazad na listu
  await page.click('text=Nazad na listu')
  await expect(page).toHaveURL('http://localhost:5173/')
})
```

---

## Tipične greške kod frontend testova

*   **Selektovanje preko klasa:** Korišćenje `container.querySelector('.btn-delete')` umesto RTL preporučenog `screen.getByRole('button', { name: /obriši/i })`. Ako promenite dizajn ili biblioteku za stilove, testovi sa CSS selektorima će se odmah slomiti iako aplikacija radi ispravno.
*   **Zanemarivanje asinhronosti:** Korišćenje sinhronih metoda `getByText` umesto asinhronih `findByText` kada se čekaju mrežni podaci.
*   **Netestiranje neuspeha (Error states):** Testiranje samo situacija kada sve radi ("Happy Path"), dok se ponašanje forme i ekrana u slučaju pada mreže potpuno ignoriše.
*   **Nedostatak izolacije u E2E testovima:** Pokretanje E2E testova koji dele istu bazu bez resetovanja stanja, što dovodi do toga da uspeh jednog testa zavisi od rezultata prethodnog.

---

## Pojmovi za pamćenje

-   **Vitest:** Test runner zadužen za izvršavanje testova.
-   **React Testing Library (RTL):** Biblioteka za renderovanje komponenti i provere zasnovane na pristupačnosti.
-   **Mock Service Worker (MSW):** Alat za presretanje i simuliranje HTTP zahteva u testovima.
-   **Playwright:** E2E automatizacioni alat koji pokreće stvarne browsere.
-   **Declarative routing test:** Provera navigacije kroz rute bez osvežavanja stranice.
-   **jsdom:** Virtuelna imitacija DOM stabla u Node.js okruženju.
-   **Loading state:** Privremeno stanje ekrana dok se čekaju asinhroni podaci.
-   **Error state:** Stanje aplikacije koje se prikazuje korisniku kada API vrati grešku.
-   **Empty state:** Vizuelno čista i jasna poruka kada u bazi nema podataka.

---

## Praktična vežba za studente

1.  U `frontend` folderu dodaj neophodne zavisnosti za Vitest i React Testing Library.
2.  Kreiraj jednostavan test pod nazivom `src/App.test.jsx` i napiši provere za onemogućeno/omogućeno dugme "Dodaj" na formi za unos.
3.  Simulirajte promenu unosa teksta kroz RTL `userEvent.type()` metodu.
4.  Napišite MSW handler koji presreće `GET /api/todos/3` zahtev i vraća kontrolisan mock JSON za zadatak sa ID-jem 3. Proverite da li se taj zadatak ispravno ispisuje u detaljnom prikazu.

---

## Pitanja za proveru znanja

1.  Koja je ključna prednost korišćenja `react-router-dom` `MemoryRouter`-a u komponentnim testovima?
2.  Zašto u React Testing Library testovima preferiramo `findByText` u odnosu na `getByText` kod provera podataka koji dolaze sa backend API-ja?
3.  U čemu se ogleda prednost MSW biblioteke u odnosu na direktno prepisivanje globalne `window.fetch` metode u testovima?
4.  Koji nivo testiranja (Unit, Integration, E2E) će najbrže otkriti grešku u slučaju da programer slučajno promeni naziv kolone na backend API-ju (npr. iz `title` u `name`)?
5.  Objasni razliku između `MemoryRouter` i `BrowserRouter` komponenti i zašto prvu koristimo u RTL testovima, a drugu u stvarnoj aplikaciji.
