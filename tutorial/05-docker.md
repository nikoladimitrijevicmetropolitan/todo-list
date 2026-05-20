# 05 - Docker

## Cilj lekcije

Cilj je da studenti razumeju osnovne Docker pojmove i zasto Docker Compose olaksava pokretanje cele Todo aplikacije sa frontend, backend i PostgreSQL servisima.

## Teorijsko objasnjenje

Docker image je paket koji sadrzi aplikaciju i sve sto joj treba za pokretanje. Container je pokrenuta instanca image-a. Dockerfile opisuje kako se image pravi. Volume cuva podatke van zivotnog ciklusa containera. Network omogucava servisima da komuniciraju po imenu.

Docker Compose opisuje vise servisa u jednom fajlu. Umesto da student rucno pokrece bazu, backend i frontend, Compose moze da ih pokrene zajedno. To smanjuje razliku izmedju masina i pomaze da svi rade u istom okruzenju.

Za development cilj nije savrsena produkcijska optimizacija, vec ponovljiv lokalni stack. Produkcijski image-i mogu doci kasnije.

## Veza sa Todo aplikacijom

Todo aplikacija u Docker Compose okruzenju treba da ima:

- `postgres` servis sa bazom i volume-om;
- `backend` servis koji koristi PostgreSQL URL, username i password iz environment varijabli;
- `frontend` servis koji pokrece Vite i zna URL backend API-ja;
- zajednicku Docker mrezu kroz koju backend vidi bazu kao `postgres`.

Backend vise ne treba da zavisi od lokalnog H2 fajla kada se radi u Docker okruzenju. H2 moze ostati kao fallback za brz lokalni rad van Docker-a.

## Pojmovi za pamcenje

- Docker image;
- container;
- Dockerfile;
- Docker Compose;
- volume;
- network;
- environment variable;
- service name.

## Prakticna vezba

Napravi konceptualni dijagram sa tri servisa: frontend, backend i PostgreSQL. Oznaci ko sa kim komunicira, preko kog porta, i koji podaci treba da budu environment varijable.

## Pitanja za proveru znanja

1. Koja je razlika izmedju image-a i containera?
2. Zasto PostgreSQL servis treba volume?
3. Zasto backend u Compose okruzenju ne koristi `localhost` za bazu?
4. Sta je prednost jednog `docker compose up --build` toka?
