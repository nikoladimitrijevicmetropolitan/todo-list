# 04 - PostgreSQL i Flyway

## Cilj lekcije

Cilj je da studenti razumeju zasto aplikacija treba da predje sa H2 baze na PostgreSQL i zasto Flyway migracije treba da postanu izvor istine za strukturu baze. Lekcija povezuje bazu, testove, Docker i CI u jednu celinu.

Na kraju lekcije student treba da ume da objasni:

- razliku izmedju razvojne i produkcijske baze;
- zasto H2 nije dovoljan za dugorocan razvoj;
- sta je migracija baze;
- kako Flyway zna koje migracije su izvrsene;
- zasto seed podaci treba da budu jasno kontrolisani;
- kako Spring profili pomazu da ista aplikacija radi u vise okruzenja.

## Teorijsko objasnjenje

H2 je zgodan za brz lokalni pocetak. Lagan je, ne zahteva poseban server i dobro se uklapa u male demonstracije. Medjutim, H2 nije isto sto i PostgreSQL. Kada projekat raste, razlike izmedju baza mogu da naprave greske koje se pojave tek kasno.

PostgreSQL je realniji izbor za aplikaciju koja cuva podatke. On se koristi kao poseban servis, ima stabilan SQL dijalekat, podrzava napredne tipove i blizi je produkcijskom okruzenju. Ako planiramo Docker, CI i Testcontainers, PostgreSQL postaje prirodan centralni deo infrastrukture.

Flyway uvodi verzionisane SQL migracije. Umesto da Hibernate sam menja semu kroz `ddl-auto=update`, tim eksplicitno zapisuje kako se baza menja. Svaka migracija ima redni broj i opis, na primer `V1__create_todos_table.sql`. Kada aplikacija startuje, Flyway proverava koje migracije su vec izvrsene i primenjuje nove.

Ovakav pristup omogucava ponovljivost. Lokalna baza, CI baza i buduca produkcijska baza mogu da dobiju istu strukturu kroz iste fajlove. Ako migracije nisu deo koda, znanje o bazi ostaje rasuto po glavama ljudi ili u rucnim instrukcijama. To je rizik.

## Problem sa `ddl-auto=update`

`spring.jpa.hibernate.ddl-auto=update` je zgodan u pocetku jer Hibernate automatski prilagodjava semu. Ali dugorocno ima nekoliko problema:

- promene baze nisu jasno dokumentovane;
- nije uvek ocigledno sta se desilo izmedju dve verzije aplikacije;
- tesko je reprodukovati isto stanje u drugom okruzenju;
- brisanje ili kompleksne promene kolona mogu biti rizicne;
- tim nema eksplicitnu istoriju odluka o bazi.

Flyway resava ovaj problem tako sto promene baze postaju fajlovi u repozitorijumu.

## Spring profili

Spring profil je nacin da ista aplikacija koristi razlicitu konfiguraciju u razlicitom okruzenju.

Za Todo aplikaciju planirani profili su:

- `local-h2`: privremeni fallback za brz lokalni demo;
- `local-postgres`: glavni lokalni razvojni profil;
- `test`: profil za Testcontainers PostgreSQL;
- kasnije `prod`: produkcijska konfiguracija preko environment varijabli.

Profil ne treba da menja poslovnu logiku. On treba da menja konfiguraciju: URL baze, username, password, Flyway ponasanje i eventualno seed strategiju.

## Seed podaci

Seed podaci su pocetni podaci koji pomazu da aplikacija ima smislen prikaz odmah nakon starta. U trenutnoj aplikaciji seed podaci dolaze iz CSV fajla i ucitavaju se runtime loaderom. To je dobro za pocetni demo, ali kada uvedemo Flyway, treba jasnije odvojiti:

- strukturne migracije, koje uvek postoje;
- razvojne seed podatke, koji ne moraju u produkciju;
- test podatke, koje testovi treba sami da pripreme.

Jedna opcija je da `V1__create_todos_table.sql` kreira tabelu, a `V2__seed_todos.sql` doda razvojne podatke. Druga opcija je da seed migracija bude ukljucena samo u dev profilu. Vazno je da studenti razumeju da seed nije isto sto i poslovni podaci korisnika.

## Veza sa Todo aplikacijom

Trenutno Todo backend koristi H2 fajl bazu i runtime CSV seed loader. U sledecoj fazi treba planirati:

- PostgreSQL kao glavni lokalni i CI izbor;
- Flyway migraciju za tabelu `todo`;
- seed migraciju za razvojne podatke ili odvojenu dev seed strategiju;
- Spring profile `local-h2`, `local-postgres` i `test`;
- smanjenje oslanjanja na `spring.jpa.hibernate.ddl-auto=update`.

Minimalna prva migracija treba da opise kolone koje vec postoje: `id`, `title`, `completed`, `created_at`, `updated_at`.

## Tipicne greske

- Migracije se pisu tek na kraju, kada je baza vec "rucno sredjena".
- Seed podaci se mesaju sa produkcijskim podacima.
- Testovi koriste H2, a aplikacija se deploy-uje na PostgreSQL.
- Vise okruzenja ima razlicitu semu baze.
- Stare migracije se menjaju umesto da se doda nova migracija.

## Pojmovi za pamcenje

- PostgreSQL;
- H2;
- Flyway;
- migracija baze;
- schema history;
- Spring profile;
- seed podaci;
- reproduktivnost baze;
- `ddl-auto`;
- database drift.

## Prakticna vezba

Nacrtaj kako bi izgledao prelaz sa H2 na PostgreSQL u tri koraka: priprema migracija, promena konfiguracije, provera kroz Testcontainers. Za svaki korak napisi koji fajlovi bi se kasnije menjali.

Zatim napisi sta bi bila prva Flyway migracija za Todo aplikaciju i koje kolone mora da sadrzi.

## Pitanja za proveru znanja

1. Zasto `ddl-auto=update` nije dobar dugorocni izvor istine?
2. Sta znaci da je migracija baze verzionisana?
3. Zasto seed podaci treba da budu jasno odvojeni od produkcijskih migracija?
4. Koja je uloga Spring profila kod prelaska na PostgreSQL?
5. Zasto testovi sa PostgreSQL imaju vecu vrednost od testova sa H2 kada je PostgreSQL ciljna baza?
6. Zasto stare Flyway migracije ne treba menjati kada su vec izvrsene?
