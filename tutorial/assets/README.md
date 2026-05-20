# Tutorial assets

## Cilj lekcije

Ovaj folder je mesto za buduce vizuelne materijale koji prate tutorial. Cilj nije samo da se cuvaju slike, vec da se kroz dijagrame studentima olaksa razumevanje odnosa izmedju testiranja, baze, Docker-a i CI/CD toka.

## Teorijsko objasnjenje

Dijagrami pomazu studentima da vide veze izmedju delova sistema. Testiranje, Docker i CI/CD imaju mnogo pojmova koji se lakse razumeju kada su prikazani kao tokovi.

Dobar dijagram ne treba da prikaze sve detalje. Treba da prikaze ono sto je vazno za lekciju. Ako dijagram test piramide prikazuje previse alata, student moze da izgubi glavnu poruku. Ako Docker dijagram ne pokazuje mrezu i volume, propusta najvaznije koncepte.

Vizuelni materijal treba da prati tekst. Ne treba da bude ukras, vec alat za objasnjenje.

## Veza sa Todo aplikacijom

U ovaj folder kasnije mogu da se dodaju:

- dijagram test piramide;
- dijagram frontend/backend komunikacije;
- dijagram Docker Compose arhitekture;
- dijagram GitHub Actions pipeline-a;
- slike ili screenshotovi neuspelih E2E testova;
- dijagram migracije sa H2 na PostgreSQL;
- dijagram toka Flyway migracija pri startu aplikacije.

Predlozeni nazivi fajlova:

- `test-piramida.png`;
- `todo-arhitektura.png`;
- `docker-compose-servisi.png`;
- `github-actions-pipeline.png`;
- `flyway-migracije.png`.

## Standard za slike

Svaki vizuelni materijal treba da ima:

- jasan naziv;
- kratak opis u Markdown lekciji koja ga koristi;
- citljive oznake;
- bez previse boja i ukrasa;
- fokus na odnosima izmedju pojmova.

Ako se koristi screenshot, treba objasniti sta student treba da primeti na slici. Screenshot bez objasnjenja retko ima nastavnu vrednost.

## Pojmovi za pamcenje

- dijagram;
- arhitektura;
- tok podataka;
- pipeline;
- vizuelna dokumentacija;
- screenshot artifact;
- legenda;
- nivo apstrakcije.

## Prakticna vezba

Napravi skicu Docker Compose arhitekture Todo aplikacije na papiru ili u alatu za dijagrame. Sacuvaj je kasnije u ovom folderu kada bude spremna.

Zatim napravi drugu skicu za GitHub Actions pipeline i uporedi ih: prvi dijagram prikazuje runtime arhitekturu, drugi prikazuje proces provere.

## Pitanja za proveru znanja

1. Zasto su dijagrami korisni u nastavnom materijalu?
2. Koji dijagram bi najvise pomogao kod razumevanja CI/CD toka?
3. Sta treba prikazati na Docker Compose dijagramu?
4. Kada screenshot neuspelog E2E testa postaje koristan artifact?
5. Zasto dijagram ne treba da prikaze svaki detalj sistema?
6. Koja je razlika izmedju arhitekturnog dijagrama i pipeline dijagrama?
