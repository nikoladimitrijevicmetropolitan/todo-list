# 04 - PostgreSQL i Flyway (Prošireno izdanje)

## Cilj lekcije

Cilj ove lekcije je da studenti u potpunosti razumeju teorijske i praktične korake prelaska sa in-memory/file **H2 baze podataka** na robusnu **PostgreSQL** relacionu bazu u Spring Boot backend aplikaciji. 

Takođe, lekcija detaljno obrađuje korišćenje **Flyway** alata za verzionisane SQL migracije baze podataka, čime se obezbeđuje ponovljivost i gašenje nesigurnog automatskog ažuriranja šeme (`ddl-auto=update`).

Na kraju lekcije student treba da ume da objasni:

- Razliku između H2 (razvojne/in-memory) i PostgreSQL (produkcijske) baze podataka.
- Zašto automatsko ažuriranje šeme (`spring.jpa.hibernate.ddl-auto=update`) predstavlja rizik u produkciji i kako Flyway to rešava.
- Šta su to verzionisane SQL migracije i kako se pišu (`V1`, `V2`, itd.).
- Kako Flyway prati istoriju izvršenih migracija kroz tabelu `flyway_schema_history`.
- Kako **Spring Profili** omogućavaju aplikaciji da radi u različitim okruženjima (lokalni PostgreSQL, lokalni H2 fallback, test okruženje) bez promene Java koda.
- Kako se pokreće lokalna PostgreSQL baza u sekundi koristeći **Docker**.

---

## Zašto prelazimo sa H2 na PostgreSQL?

H2 baza je izuzetno praktična za brzi početak rada. Pokreće se in-memory ili piše u običan lokalni fajl unutar projekta, što znači da ne zahteva nikakav eksterni server. Međutim, H2 ima ozbiljna ograničenja:

1.  **Dijalektne razlike:** SQL dijalekat H2 baze se razlikuje od PostgreSQL-a. Određene funkcije, tipovi podataka (npr. UUID, JSONB) i načini upravljanja transakcijama ili sekvencama rade drugačije. Ako razvijate aplikaciju na H2 bazi, a na produkciji koristite PostgreSQL, rizikujete da se greške pojave tek u produkciji.
2.  **Skladištenje i performanse:** H2 nije projektovan za rad sa velikom količinom podataka niti za višekorisnički konkurentni rad.
3.  **Kontejnerizacija:** Da bismo lokalno okruženje i CI/CD pipeline učinili identičnim produkciji, PostgreSQL postaje prirodan centralni deo naše infrastrukture (pomoću Docker Compose i Testcontainers-a).

---

## Problem sa `ddl-auto=update`

U ranoj fazi razvoja koristimo `spring.jpa.hibernate.ddl-auto=update` kako bi Hibernate sam menjao tabele u bazi na osnovu naših Java entiteta. U profesionalnom softverskom inženjerstvu to je neprihvatljivo iz nekoliko razloga:

- **Database Drift:** Baza se tiho menja bez ikakve istorije i dokumentacije o tome kada je i zašto neka kolona dodata ili izmenjena.
- **Rizik od gubitka podataka:** Hibernate može pogrešno interpretirati promenu i obrisati kolonu ili tabelu kako bi je ponovo kreirao.
- **Nemogućnost reprodukcije:** Teško je postaviti novu bazu na isto stanje u novom okruženju (npr. na CI serveru ili kod novog člana tima).

---

## Flyway kao "Git" za vašu bazu podataka

Flyway uvodi **verzionisane SQL migracije**. Sve izmene nad bazom se pišu u obliku standardnih `.sql` fajlova i čuvaju u Git repozitorijumu. 

### Nazivi fajlova
Flyway prepoznaje skripte po tačno definisanom šablonu naziva:
`V<VERZIJA>__<OPIS>.sql` (obrati pažnju: koriste se **dva donja podvučnika**).
Primeri:
*   `V1__create_todo_table.sql`
*   `V2__seed_todos.sql`

### Kako Flyway radi
Kada se Spring Boot aplikacija pokrene, Flyway:
1.  U bazi traži specijalnu tabelu `flyway_schema_history`. Ako ona ne postoji, Flyway je sam kreira.
2.  Skenira folder `src/main/resources/db/migration/` u projektu i traži SQL skripte.
3.  U tabeli `flyway_schema_history` proverava koje skripte su već izvršene na osnovu njihove verzije i kontrolne sume (checksum).
4.  Izvršava samo **nove** skripte po redu i upisuje ih u istoriju.
5.  Ako je neka stara skripta naknadno promenjena u kodu, Flyway će prijaviti grešku jer se kontrolna suma ne poklapa. **Izvršene migracije se nikada ne menjaju naknadno!** Umesto toga, uvek se piše nova migracija (npr. `V3`).

---

## Kompletan Plan Tranzicije na PostgreSQL

U nastavku je detaljno dokumentovan plan konfigurisanja i struktura fajlova koju student treba da implementira u backend aplikaciji.

### Korak 1: Izmena `pom.xml` (Zavisnosti)
Student mora u `pom.xml` dodati drajver za PostgreSQL bazu i Flyway zavisnosti:

```xml
<!-- PostgreSQL Driver -->
<dependency>
	<groupId>org.postgresql</groupId>
	<artifactId>postgresql</artifactId>
	<scope>runtime</scope>
</dependency>

<!-- Flyway Migration Support -->
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-flyway</artifactId>
</dependency>
<dependency>
	<groupId>org.flywaydb</groupId>
	<artifactId>flyway-database-postgresql</artifactId>
</dependency>
```

---

### Korak 2: Kreiranje Flyway Migracionih Skripti
Kreirati folder resursa: `src/main/resources/db/migration/` i u njemu napraviti sledeća dva SQL fajla:

#### `V1__create_todo_table.sql` (Kreiranje šeme)
```sql
CREATE TABLE todo (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

#### `V2__seed_todos.sql` (Inicijalni podaci za razvoj)
```sql
INSERT INTO todo (title, completed, created_at, updated_at) VALUES 
('Pregledati danasnje zadatke', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dodati prvi pravi zadatak', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Isprobati filtere', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

---

### Korak 3: Podela na Spring Profile (Konfiguracija)
Konfiguraciju delimo na zasebne profile kako bismo podržali lokalni razvoj na PostgreSQL-u, lak fallback na H2 ako programer nema lokalni PostgreSQL i izolaciju u testovima.

#### 1. Glavni konfiguracioni fajl (`application.properties`)
Sadrži zajedničke parametre i postavlja podrazumevani profil:
```properties
spring.application.name=todo-backend
# Podrazumevano aktiviramo lokalni PostgreSQL profil pri pokretanju
spring.profiles.active=local-postgres
```

#### 2. Profil za PostgreSQL (`application-local-postgres.properties`)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todos
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# Flyway vrsi migracije, a Hibernate samo potvrdjuje strukturu
spring.flyway.enabled=true
spring.jpa.hibernate.ddl-auto=validate
```

#### 3. Fallback profil za H2 bazu (`application-local-h2.properties`)
```properties
spring.datasource.url=jdbc:h2:file:./data/todos
spring.datasource.username=sa
spring.datasource.password=
spring.datasource.driver-class-name=org.h2.Driver

# H2 takodje moze koristiti Flyway za izvrsavanje migracija
spring.flyway.enabled=true
spring.jpa.hibernate.ddl-auto=validate
```

---

### Korak 4: Pokretanje lokalne PostgreSQL baze u Docker-u
Student može u sekundi podići čistu i izolovanu PostgreSQL bazu na svom računaru pokretanjem sledeće Docker komande u terminalu:

```bash
docker run --name local-postgres -e POSTGRES_DB=todos -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

---

### Korak 5: Pokretanje i verifikacija rada
Nakon što se baza podigne, student pokreće Spring Boot aplikaciju iz komandne linije aktiviranjem željenog profila:

#### Pokretanje sa PostgreSQL profilom (Podrazumevano):
```powershell
.\mvnw.cmd spring-boot:run
# Ili eksplicitno:
.\mvnw.cmd spring-boot:run -Dspring.profiles.active=local-postgres
```
*   **Šta pratiti u logovima:** Aplikacija će detektovati Flyway, skenirati migracije i ispisati:
    `Successfully applied 2 migrations to schema "public"`.
*   **Provera tabele:** Otvaranjem pgAdmin-a ili konzole videće se tabele `todo` i `flyway_schema_history` sa tačno evidentiranim kontrolnim sumama i statusima migracija.

#### Pokretanje sa H2 Fallback profilom:
```powershell
.\mvnw.cmd spring-boot:run -Dspring.profiles.active=local-h2
```
*   Aplikacija se povezuje na lokalni H2 fajl, kreira tabelu `flyway_schema_history` u H2 i izvršava migracije na isti način, dokazujući potpunu fleksibilnost konfiguracije.

---

## Tipične greške kod migracija baze

- **Izmena starih migracionih fajlova:** Promena fajla koji je već uspešno izvršen na bazi dovodi do `checksum` greške i blokiranja aplikacije pri sledećem startu. Uvek kreirati novu verziju (npr. `V3`).
- **Mešanje DDL i DML skripti:** Pisanje šeme (DDL - npr. `CREATE TABLE`) i upisivanje podataka (DML - npr. `INSERT`) u istom koraku može dovesti do grešaka ako baza ne podržava transakcioni DDL. Dobra praksa je razdvajanje na zasebne fajlove (poput našeg `V1` i `V2`).
- **Nepodudaranje SQL dijalekta:** Korišćenje H2 specifične sintakse u Flyway skriptama koja nije podržana u PostgreSQL-u (ili obrnuto). Uvek pisati standardni ANSI SQL.

---

## Pitanja za proveru znanja

1.  Zasto `ddl-auto=update` nije dobar dugorocni izvor istine i kako Flyway to rešava?
2.  Objasni značenje formata naziva Flyway skripte `V1__create_todo_table.sql`. Zašto su važna dva donja podvučnika?
3.  Šta predstavlja tabela `flyway_schema_history` i na koji način Flyway detektuje da je neka skripta naknadno izmenjena u kodu?
4.  Kako Spring profili omogućavaju aplikaciji da radi sa potpuno različitim bazama bez potrebe za recompilacijom ili izmenom Java klasa?
5.  Zbog čega se preporučuje razdvajanje strukturnih migracija (DDL) od inicijalnih razvojnih podataka (seed / DML)?
6.  Kako korišćenje pravog PostgreSQL-a kroz Docker lokalno štiti projekat od regresionih grešaka u odnosu na rad sa H2 bazom?
