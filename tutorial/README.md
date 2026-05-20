# Tutorial: testiranje, baza, Docker i CI/CD

## Cilj lekcije

Ovaj folder je studentski vodic kroz faze uvecanja Todo aplikacije. Cilj nije samo da studenti vide koje alate treba dodati, vec da razumeju zasto se svaki alat uvodi, koji problem resava i kako se uklapa u profesionalan razvoj softvera.

Na kraju ovog tutoriala student treba da ume da objasni:

- zasto aplikacija ima vise nivoa testiranja;
- kako frontend testovi proveravaju korisnicko ponasanje;
- kako backend testovi proveravaju API, validaciju i rad sa bazom;
- zasto H2 nije dovoljan dugorocno i zasto prelazimo na PostgreSQL;
- kako Flyway migracije cuvaju istoriju promena baze;
- kako Docker Compose pravi ponovljivo lokalno okruzenje;
- kako GitHub Actions automatski proverava projekat pre spajanja izmena.

## Preduslovi

Student treba da poznaje osnove:

- React komponenti i rada sa formama;
- REST API-ja i HTTP metoda;
- Spring Boot aplikacije;
- relacione baze podataka;
- rada iz komandne linije;
- osnovnog Git toka rada;
- citanja konfiguracionih fajlova kao sto su `package.json`, `pom.xml` i `application.properties`.

Ne ocekuje se da student vec zna Vitest, Testcontainers, Flyway, Docker ili GitHub Actions. Ti alati se u tutorialu uvode postepeno.

## Kako koristiti ovaj tutorial

Lekcije su poredjane redosledom kojim bi se projekat realno uvecavao. Svaka lekcija ima isti oblik: cilj, teoriju, vezu sa Todo aplikacijom, pojmove, vezbu i pitanja. To nastavniku olaksava da lekcije koristi kao pripremu za cas, a studentu da uci samostalno.

Preporuceni ritam rada:

1. Procitati lekciju bez kucanja koda.
2. Izdvojiti pojmove koji nisu jasni.
3. Povezati teoriju sa fajlovima u postojecoj aplikaciji.
4. Uraditi predlozenu vezbu.
5. Odgovoriti na pitanja bez gledanja u tekst.
6. Tek onda preci na implementaciju te faze.

## Redosled lekcija

1. [Uvod u testiranje](01-testiranje-uvod.md)
2. [Frontend testiranje](02-frontend-testiranje.md)
3. [Backend testiranje](03-backend-testiranje.md)
4. [PostgreSQL i Flyway](04-baza-postgresql-flyway.md)
5. [Docker](05-docker.md)
6. [CI/CD kroz GitHub Actions](06-ci-cd-github-actions.md)
7. [Redosled implementacije](07-redosled-implementacije.md)

Vizuelni materijali se cuvaju u [assets](assets/README.md).

## Teorijsko objasnjenje

Todo aplikacija je mala, ali je dovoljno kompletna da prikaze realne faze razvoja: frontend poziva backend, backend cuva podatke, baza ima seed podatke, a aplikacija ima jasne korisnicke tokove. To je dobra nastavna situacija, jer studenti mogu lako da razumeju domen, a fokus ostaje na inzenjerskim praksama.

U profesionalnom radu nije dovoljno da aplikacija "radi kod mene". Tim mora da zna da se aplikacija moze proveriti, pokrenuti na drugoj masini, povezati sa bazom i isporuciti kroz automatizovan proces. Zato tutorial ide od testova ka infrastrukturi:

- testiranje daje sigurnost da promene ne kvare postojece ponasanje;
- migracije baze daju kontrolu nad promenama podataka;
- Docker smanjuje razlike izmedju razvojnih okruzenja;
- CI/CD uvodi automatizovan kvalitet pre merge-a.

Ove teme nisu odvojene. Na primer, E2E testovi postaju mnogo korisniji kada Docker Compose moze da podigne ceo sistem. Flyway migracije postaju jos vaznije kada CI koristi PostgreSQL u Testcontainers okruzenju. GitHub Actions ima smisla tek kada projekat ima jasne komande za proveru.

## Veza sa Todo aplikacijom

Postojeca aplikacija ima React frontend, Spring Boot backend i H2 bazu. Tutorial objasnjava kako se taj sistem siri ka zrelijoj arhitekturi:

- frontend testovi proveravaju UI, stanje forme, filtere i korisnicke tokove;
- backend testovi proveravaju REST API, validaciju, CORS i rad sa podacima;
- PostgreSQL i Flyway uvode stabilniji nacin rada sa bazom;
- Docker Compose omogucava da ceo sistem radi jednim komandnim tokom;
- GitHub Actions proverava promene pre spajanja u glavnu granu.

Ova aplikacija namerno ostaje jednostavna po domeni. Nema korisnika, autentikacije, prioriteta ili rokova. To je korisno u nastavi, jer svaka nova tehnicka tema moze da se objasni bez dodatne domenske slozenosti.

## Metodologija rada

Kroz tutorial se koristi nekoliko pravila:

- prvo se definise rizik koji zelimo da pokrijemo;
- zatim se bira najjeftiniji nivo testa koji taj rizik moze pouzdano da pokrije;
- konfiguracija se uvodi kada za nju postoji jasna potreba;
- svaka faza mora imati komandu kojom se proverava;
- dokumentacija se azurira zajedno sa promenama.

Ova pravila pomazu studentima da ne uvode alate samo zato sto su popularni. Svaki alat mora imati razlog.

## Pojmovi za pamcenje

- test piramida;
- unit test;
- component test;
- integration test;
- API test;
- E2E test;
- migracija baze;
- Docker image;
- Docker container;
- CI/CD pipeline;
- reproducibilno okruzenje;
- automatizovana provera;
- regresija.

## Prakticna vezba

Procitaj sve naslove lekcija i napravi mapu puta: koja faza proverava frontend, koja backend, koja bazu, a koja isporuku aplikacije. Zatim za svaki nivo napisi po jedan primer greske koju bi taj nivo mogao da uhvati.

Primer:

- frontend component test hvata gresku da dugme `Dodaj` nije disabled kada je unos prazan;
- backend API test hvata gresku da prazan `title` ipak kreira zadatak;
- Flyway migracija hvata gresku da tabela nema obaveznu kolonu;
- Docker Compose hvata gresku u environment varijablama;
- CI hvata gresku pre nego sto dodje u glavnu granu.

## Pitanja za proveru znanja

1. Zasto nije dovoljno imati samo E2E testove?
2. Zasto je vazno da CI pokrece i frontend i backend provere?
3. Koja je razlika izmedju lokalnog okruzenja i CI okruzenja?
4. Zasto je Todo aplikacija dobar primer za ucenje testiranja?
5. Kako Docker i testiranje zajedno doprinose pouzdanosti projekta?
6. Zasto migracije baze treba da budu deo koda, a ne rucna instrukcija?
