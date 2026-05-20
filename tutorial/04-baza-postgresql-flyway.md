# 04 - PostgreSQL i Flyway

## Cilj lekcije

Cilj je da studenti razumeju zasto aplikacija treba da predje sa H2 baze na PostgreSQL i zasto Flyway migracije treba da postanu izvor istine za strukturu baze.

## Teorijsko objasnjenje

H2 je zgodan za brz lokalni pocetak, ali nije isto sto i produkcijska baza. Kada projekat raste, razlike izmedju H2 i PostgreSQL mogu da naprave greske koje se pojave tek kasno. PostgreSQL je stabilniji izbor za realnu aplikaciju i bolje odgovara nacinu na koji se softver deploy-uje.

Flyway uvodi verzionisane SQL migracije. Umesto da Hibernate sam menja semu kroz `ddl-auto=update`, tim eksplicitno zapisuje kako se baza menja. Svaka migracija ima redni broj i opis, na primer `V1__create_todos_table.sql`. Kada aplikacija startuje, Flyway proverava koje migracije su vec izvrsene i primenjuje nove.

Ovakav pristup omogucava ponovljivost. Lokalna baza, CI baza i buduca produkcijska baza mogu da dobiju istu strukturu kroz iste fajlove.

## Veza sa Todo aplikacijom

Trenutno Todo backend koristi H2 fajl bazu i runtime CSV seed loader. U sledecoj fazi treba planirati:

- PostgreSQL kao glavni lokalni i CI izbor;
- Flyway migraciju za tabelu `todo`;
- seed migraciju za razvojne podatke ili odvojenu dev seed strategiju;
- Spring profile `local-h2`, `local-postgres` i `test`;
- smanjenje oslanjanja na `spring.jpa.hibernate.ddl-auto=update`.

Minimalna prva migracija treba da opise kolone koje vec postoje: `id`, `title`, `completed`, `created_at`, `updated_at`.

## Pojmovi za pamcenje

- PostgreSQL;
- H2;
- Flyway;
- migracija baze;
- schema history;
- Spring profile;
- seed podaci;
- reproduktivnost baze.

## Prakticna vezba

Nacrtaj kako bi izgledao prelaz sa H2 na PostgreSQL u tri koraka: priprema migracija, promena konfiguracije, provera kroz Testcontainers. Za svaki korak napisi koji fajlovi bi se kasnije menjali.

## Pitanja za proveru znanja

1. Zasto `ddl-auto=update` nije dobar dugorocni izvor istine?
2. Sta znaci da je migracija baze verzionisana?
3. Zasto seed podaci treba da budu jasno odvojeni od produkcijskih migracija?
4. Koja je uloga Spring profila kod prelaska na PostgreSQL?
