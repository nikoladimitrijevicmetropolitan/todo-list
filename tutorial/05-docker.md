# 05 - Docker

## Cilj lekcije

Cilj je da studenti razumeju osnovne Docker pojmove i zasto Docker Compose olaksava pokretanje cele Todo aplikacije sa frontend, backend i PostgreSQL servisima. Docker se ovde posmatra pre svega kao alat za ponovljivo razvojno okruzenje.

Na kraju lekcije student treba da ume da objasni:

- sta je image, a sta container;
- zasto je Dockerfile recept za image;
- zasto baza treba volume;
- kako servisi komuniciraju u Compose mrezi;
- zasto environment varijable zamenjuju rucnu konfiguraciju;
- zasto Compose pomaze i studentima i CI okruzenju.

## Teorijsko objasnjenje

Docker image je paket koji sadrzi aplikaciju i sve sto joj treba za pokretanje. Container je pokrenuta instanca image-a. Dockerfile opisuje kako se image pravi. Volume cuva podatke van zivotnog ciklusa containera. Network omogucava servisima da komuniciraju po imenu.

Bez Docker-a, svaki student mora da ima odgovarajucu verziju Node-a, JDK-a, Maven-a, PostgreSQL-a i drugih alata. To cesto dovodi do situacije "radi kod mene". Docker smanjuje taj problem tako sto okruzenje opisujemo kao kod.

Docker Compose opisuje vise servisa u jednom fajlu. Umesto da student rucno pokrece bazu, backend i frontend, Compose moze da ih pokrene zajedno. To smanjuje razliku izmedju masina i pomaze da svi rade u istom okruzenju.

Za development cilj nije savrsena produkcijska optimizacija, vec ponovljiv lokalni stack. Produkcijski image-i mogu doci kasnije.

## Docker koncepti

Image:

- staticki paket aplikacije;
- pravi se iz Dockerfile-a;
- moze se verzionisati i objaviti u registry.

Container:

- pokrenut image;
- ima svoj proces, mrezu i filesystem sloj;
- moze se zaustaviti i obrisati.

Volume:

- cuva podatke izvan containera;
- posebno vazan za baze;
- sprecava gubitak podataka kada se container obrise.

Network:

- omogucava servisima da komuniciraju;
- u Compose-u backend moze da koristi hostname `postgres`;
- `localhost` unutar containera znaci taj container, ne masina domacin.

## Veza sa Todo aplikacijom

Todo aplikacija u Docker Compose okruzenju treba da ima:

- `postgres` servis sa bazom i volume-om;
- `backend` servis koji koristi PostgreSQL URL, username i password iz environment varijabli;
- `frontend` servis koji pokrece Vite i zna URL backend API-ja;
- zajednicku Docker mrezu kroz koju backend vidi bazu kao `postgres`.

Backend vise ne treba da zavisi od lokalnog H2 fajla kada se radi u Docker okruzenju. H2 moze ostati kao fallback za brz lokalni rad van Docker-a.

## Environment varijable

Konfiguracija ne treba da bude zakucana u kodu. Backend treba da cita vrednosti kao sto su:

- database URL;
- database username;
- database password;
- aktivni Spring profil;
- CORS origin-i;
- frontend API base URL.

Tako isti image moze raditi u lokalnom, test i buducem produkcijskom okruzenju. Menja se konfiguracija, ne kod.

## Tipicne greske

- Backend container pokusava da se spoji na `localhost` umesto na `postgres`.
- Baza nema volume, pa se podaci gube posle restartovanja.
- Dockerfile instalira previse nepotrebnih stvari.
- Secrets se upisuju direktno u repozitorijum.
- Frontend image ima pogresan API URL.
- Compose fajl nema jasne healthcheck ili zavisnosti izmedju servisa.

## Pojmovi za pamcenje

- Docker image;
- container;
- Dockerfile;
- Docker Compose;
- volume;
- network;
- environment variable;
- service name;
- port mapping;
- healthcheck.

## Prakticna vezba

Napravi konceptualni dijagram sa tri servisa: frontend, backend i PostgreSQL. Oznaci ko sa kim komunicira, preko kog porta, i koji podaci treba da budu environment varijable.

Zatim objasni zasto backend u Docker Compose mrezi treba da koristi hostname `postgres`, a ne `localhost`.

## Pitanja za proveru znanja

1. Koja je razlika izmedju image-a i containera?
2. Zasto PostgreSQL servis treba volume?
3. Zasto backend u Compose okruzenju ne koristi `localhost` za bazu?
4. Sta je prednost jednog `docker compose up --build` toka?
5. Zasto environment varijable cine image fleksibilnijim?
6. Koji servis u Todo aplikaciji treba da zavisi od baze?
