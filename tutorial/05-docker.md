# 05 — Sveobuhvatni Vodič kroz Docker i Docker Compose (Standalone Udžbenik)

Dobrodošli u kompletnu lekciju o kontejnerizaciji. Ovaj fajl je dizajniran kao **samostalni udžbenik** — napisan je tako da student može da nauči sve o Docker-u i Docker Compose-u od apsolutne nule, bez potrebe za pretraživanjem eksternih izvora. Svi pojmovi su uvedeni postupno, od istorijskog konteksta i arhitekture, preko praktičnih Dockerfile recepata naše Todo aplikacije, pa sve do napredne orkestracije na Windows 11 sistemu.

---

## Sadržaj Lekcije
1. **Problem i Istorijski Kontekst (Pre Kontejnera)**
2. **Virtuelne Mašine vs Kontejneri (Arhitektura)**
3. **Postupno Uvođenje Docker Pojmova (Teorijski Pojmovnik)**
4. **Anatomija Dockerfile-a i Instrukcije**
5. **Praktična Dockerizacija Spring Boot Backenda**
6. **Praktična Dockerizacija React Frontenda (Nginx i Klijentsko Rutiranje)**
7. **Orkestracija sa Docker Compose-om**
8. **Priručnik za Windows 11 (Docker Desktop + WSL 2)**
9. **Docker komandna "brza sveska" (Cheat Sheet)**
10. **Pitanja za Proveru Znanja i Praktične Vežbe**

---

## 1. Problem i Istorijski Kontekst (Pre Kontejnera)

Pre nego što shvatimo *šta* je Docker, moramo razumeti *zašto* je nastao. 

U tradicionalnom razvoju softvera, aplikacije su se pokretale direktno na operativnom sistemu računara ili servera (tzv. "bare metal"). To je kreiralo tri ogromna problema:

1.  **Pakao Zavisnosti (Dependency Hell):**
    Pretpostavimo da na istom serveru treba da pokrenete dve aplikacije. Aplikacija A koristi Python 2.7, a Aplikacija B koristi Python 3.10. Instalacija jedne verzije često bi prepisala ili oštetila biblioteke druge aplikacije, čineći nemogućim stabilan rad obe aplikacije istovremeno.
2.  **Sindrom "Radi kod mene" (It Works on My Machine):**
    Softver koji programer napiše i testira na svom MacOS ili Windows računaru često ne bi hteo da se pokrene na produkcionom Linux serveru. Razlog su suptilne razlike u sistemskim bibliotekama, verzijama Java/Node runtime-a, putanjama fajl sistema ili vremenskim zonama.
3.  **Teško Skaliranje i Konfiguracija:**
    Instaliranje i podešavanje baze podataka, backend runtime-a i web servera na novom računaru zahtevalo je sate ručnog rada, čitanja dokumentacije i rešavanja konflikata portova.

---

## 2. Virtuelne Mašine vs Kontejneri (Arhitektura)

Kako bi se obezbedila izolacija aplikacija, industrija je prvo uvela **Virtuelne Mašine (VM)**, a kasnije je evoluirala ka **Kontejnerima**.

```
+-----------------------------------+     +-----------------------------------+
|       VIRTUELNE MAŠINE (VM)       |     |            KONTEJNERI             |
+-----------------------------------+     +-----------------------------------+
|  +-----------+     +-----------+  |     |  +-----------+     +-----------+  |
|  |   App A   |     |   App B   |  |     |  |   App A   |     |   App B   |  |
|  +-----------+     +-----------+  |     |  +-----------+     +-----------+  |
|  | Libs/Bins |     | Libs/Bins |  |     |  | Libs/Bins |     | Libs/Bins |  |
|  +-----------+     +-----------+  |     |  +-----------+     +-----------+  |
|  | Guest OS  |     | Guest OS  |  |     |  +-----------------------------+  |
|  +-----------+     +-----------+  |     |  |    Docker Engine (Daemon)   |  |
|  +-----------------------------+  |     |  +-----------------------------+  |
|  |   Hypervisor (VirtualBox)   |  |     |  |  Zajednički Host OS Kernel  |  |
|  +-----------------------------+  |     |  +-----------------------------+  |
|  |      Physical Host OS       |  |     |  |      Physical Hardware      |  |
|  +-----------------------------+  |     +-----------------------------------+
```

### Virtuelne Mašine (VM)
Virtuelna mašina emulira kompletan fizički hardver računara. Na njoj se pokreće **Hypervisor** (npr. VirtualBox, VMware) koji kreira virtuelni hardver i na njemu podiže **kompletan operativni sistem (Guest OS)**.
*   **Problem:** Svaka virtuelna mašina troši gigabajte RAM-a i prostora na disku samo za pokretanje sopstvenog operativnog sistema, čak i ako aplikacija na njoj troši svega nekoliko megabajta. Pokretanje traje minutima jer Guest OS mora kompletno da se butuje.

### Kontejneri (Docker)
Kontejneri ne virtuelizuju hardver niti pokreću ceo novi operativni sistem. Umesto toga, svi kontejneri na računaru **dele kernel (jezgro) operativnog sistema domaćina (Host OS)**. 
Docker koristi napredne funkcije Linux kernela (kao što su *namespaces* za izolaciju procesa i *cgroups* za ograničavanje resursa) kako bi kreirao izolovano okruženje za proces aplikacije.
*   **Prednost:** Kontejneri su ekstremno lagani. Pokreću se za manje od sekunde, troše minimalno RAM memorije (samo onoliko koliko troši sama aplikacija) i slika zauzima znatno manje prostora na disku.

---

## 3. Postupno Uvođenje Docker Pojmova (Teorijski Pojmovnik)

Da bismo uspešno koristili Docker, moramo usvojiti njegove osnovne termine. Uvešćemo ih logičkim redosledom:

```
 Dockerfile (Recept) 
       │
       ▼ (docker build)
 Docker Image (Šablon / Klasa)
       │
       ▼ (docker run)
 Docker Container (Aktivni proces / Objekat)
       │
 ┌─────┴─────┐
 ▼           ▼
Volume     Network
(Podaci)   (Komunikacija)
```

### 1. Kontejnerizacija (Containerization)
Proces pakovanja aplikacije, njenih biblioteka, zavisnosti i konfiguracije u jedinstven, standardizovan paket (kontejner) koji se može pokrenuti na bilo kom operativnom sistemu koji podržava Docker.

### 2. Docker Daemon & Docker Engine
*   **Docker Daemon (dokerd):** Pozadinska usluga (background service) koja trči na vašem računaru i upravlja Docker objektima (slikama, kontejnerima, mrežama, volumenima). Ona prima zahteve preko Docker API-ja.
*   **Docker CLI:** Alat komandne linije koji kucamo u terminalu (npr. `docker run`) koji šalje komande Docker Daemon-u.
*   **Docker Engine:** Celokupan Docker sistem koji obuhvata Daemon, API i CLI.

### 3. Docker Registry & Docker Hub
*   **Docker Registry:** Centralno skladište gde se čuvaju i odakle se preuzimaju Docker slike.
*   **Docker Hub:** Zvanični javni registry (sajt hub.docker.com) na kojem zajednica i kompanije besplatno objavljuju zvanične slike (npr. zvanična slika za `postgres`, `node`, `openjdk`, `nginx`).

### 4. Docker Image (Slika)
Statički, nepromenljivi fajl koji služi kao šablon za kreiranje kontejnera. Image sadrži kompletan operativni sistem (obično minimalističku Linux distribuciju poput Alpine), runtime (npr. JRE ili Node), biblioteke i sam izvorni kod aplikacije. 
*   **Slojevitost (Layers):** Docker slike se sastoje od niza slojeva. Svaka instrukcija u `Dockerfile`-u kreira novi sloj koji se kešira. Ako promenite samo poslednji sloj slike, Docker će pri ponovnom bildovanju iskoristiti keširane prethodne slojeve, što proces čini munjevito brzim.

### 5. Docker Container (Kontejner)
Živa, pokrenuta i izolovana instanca slike. Ako je slika ekvivalent **Klase** u objektno-orijentisanom programiranju, kontejner je ekvivalent **Objekta** (instance te klase). Kontejner ima svoj sopstveni, izolovani fajl sistem, procesni prostor i mrežni interfejs.

### 6. Port Mapping (Mapiranje Portova)
Kontejneri trče u svojoj izolovanoj mreži i njihovi portovi nisu automatski dostupni računaru domaćinu (vašem računaru). Mapiranje portova preslikava port sa računara domaćina na port unutar kontejnera.
*   *Format:* `PORT_HOSTA:PORT_KONTEJNERA` (npr. `-p 8080:8080` ili `-p 80:80`).
*   Ako mapiramo `80:80`, pristupanjem na `http://localhost` (port 80) na našem računaru, operativni sistem automatski preusmerava saobraćaj na port 80 unutar kontejnera.

### 7. Docker Volume (Skladište/Volumen)
Podrazumevano, svi fajlovi kreirani unutar kontejnera se čuvaju u privremenom (Writable) sloju kontejnera. Kada se kontejner ugasi i obriše, svi ti podaci (npr. zapisi u bazi podataka) nepovratno nestaju. 
**Volume** je namenski direktorijum na disku vašeg računara koji je "mapiran" u kontejner. Podaci upisani u taj direktorijum ostaju trajno sačuvani na vašem disku čak i ako se kontejner u potpunosti uništi.

### 8. Docker Network (Mreža)
Docker omogućava kontejnerima da komuniciraju u potpuno izolovanim virtuelnim mrežama. Najčešće se koristi **Bridge** mreža. Unutar iste Docker mreže, kontejneri mogu da komuniciraju koristeći **ime servisa** (npr. `postgres` ili `backend`) kao hostname, umesto IP adresa.

---

## 4. Anatomija Dockerfile-a i Instrukcije

`Dockerfile` je tekstualni fajl bez ekstenzije koji sadrži instrukcije za pravljenje slike. Svaka linija predstavlja korak u građenju. Upoznajmo se sa najčešćim instrukcijama:

| Instrukcija | Opis | Primer |
| :--- | :--- | :--- |
| **`FROM`** | Definiše baznu sliku (Parent Image) od koje počinjemo. | `FROM eclipse-temurin:17-jre-alpine` |
| **`WORKDIR`** | Postavlja aktivni radni direktorijum unutar kontejnera. | `WORKDIR /app` |
| **`COPY`** | Kopira fajlove sa našeg računara unutar kontejnera. | `COPY pom.xml .` |
| **`RUN`** | Izvršava komandu tokom procesa bildovanja slike (npr. instalacija). | `RUN npm install` |
| **`EXPOSE`** | Dokumentuje port na kojem kontejner sluša (ne mapira ga samostalno!). | `EXPOSE 8080` |
| **`ENV`** | Postavlja environment (sistemsku) varijablu unutar kontejnera. | `ENV SPRING_PROFILES_ACTIVE=prod` |
| **`ENTRYPOINT`**| Definiše glavnu, fiksnu komandu koja se izvršava pri startu kontejnera. | `ENTRYPOINT ["java", "-jar", "app.jar"]` |
| **`CMD`** | Definiše podrazumevane argumente za ENTRYPOINT ili komandu koja se može prebrisati. | `CMD ["--help"]` |

---

## 5. Praktična Dockerizacija Spring Boot Backenda

Pogledajmo [Dockerfile](file:///d:/vibe/todo-list/backend/todo-backend/Dockerfile) koji smo kreirali za naš Spring Boot backend unutar foldera `backend/todo-backend/`:

```dockerfile
# =========================================================================
# Faza 1: Bildovanje (Kompajliranje koda unutar privremenog JDK okruženja)
# =========================================================================
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Kopiramo pom.xml i preuzimamo zavisnosti (ovo se kešira ako se pom.xml ne menja)
COPY pom.xml .
COPY src ./src

# Kompajliramo aplikaciju i pravimo .jar fajl unutar target/ foldera
RUN mvn clean package -DskipTests

# =========================================================================
# Faza 2: Runtime (Kreiranje finalne slike koja sadrži samo minimalni JRE)
# =========================================================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Kopiramo kompajlirani .jar fajl iz prethodne (build) faze u finalnu sliku
COPY --from=build /app/target/todo-backend-0.0.1-SNAPSHOT.jar app.jar

# Informišemo Docker da će kontejner koristiti port 8080
EXPOSE 8080

# Pokrećemo Spring Boot aplikaciju
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Zašto je ovaj pristup genijalan (Multi-Stage Build)?
Ako bismo koristili samo jednu sliku koja sadrži Maven i ceo JDK, naša slika bi bila ogromna (preko 600MB) i sadržala bi gomilu alata za kompajliranje koji nam ne trebaju u produkciji, što stvara bezbednosni rizik. 
Uvođenjem dve faze (`AS build`), faza 1 služi samo kao privremena radionica. Iz nje izvlačimo isključivo gotov `.jar` fajl i stavljamo ga u potpuno čistu, laganu `alpine` (minimalistički Linux) sliku sa JRE-om. Krajnja slika je velika samo oko **150MB**, bezbedna je jer nema kompajler na sebi i troši zanemarljivo malo memorije!

---

## 6. Praktična Dockerizacija React Frontenda (Nginx i Klijentsko Rutiranje)

Za naš React frontend (koji koristi Vite) kreirali smo [Dockerfile](file:///d:/vibe/todo-list/frontend/Dockerfile) i prateći [nginx.conf](file:///d:/vibe/todo-list/frontend/nginx.conf) unutar foldera `frontend/`.

React je isključivo klijentska aplikacija. To znači da se sav kod prevodi u standardni HTML, CSS i JavaScript, koji se zatim preuzima i pokreće direktno unutar browsera na računaru korisnika. Za to nam u produkciji ne treba pokrenut težak Node.js server. Statičke fajlove možemo servirati preko ultra-brzog web servera kao što je **Nginx**.

### Problem sa Single Page Aplikacijama (SPA) i Rutiranjem
Kada koristimo React Router za rutiranje (npr. prelazak na stranicu detalja `/detalji/1`), browser ne šalje zahtev serveru, već React JavaScript dinamički menja URL u adresi i renderuje odgovarajući sadržaj na ekranu.
Međutim, ako korisnik klikne **Refresh** (F5) na URL-u `http://localhost/detalji/1`, browser će poslati stvarni HTTP GET zahtev Nginx serveru za fajl unutar foldera `/detalji/1`. Pošto taj folder i fajl ne postoje na Nginx-u (jer imamo samo `index.html` u korenu), Nginx će vratiti **404 Not Found**.

### Rešenje: `frontend/nginx.conf`
Napisali smo prilagođenu Nginx konfiguraciju koja rešava ovaj problem tako što za bilo koji nepostojeći fajl ili direktorijum Nginx automatski vraća glavni `index.html` fajl, prepuštajući React Routeru da uradi posao u browseru:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        # Ako fajl ($uri) ne postoji, pokušaćemo kao folder ($uri/), 
        # a ako ni to ne postoji, vraćamo /index.html
        try_files $uri $uri/ /index.html;
    }

    # Error handling za serverske greške
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

### `frontend/Dockerfile`
```dockerfile
# Faza 1: Prevođenje i build-ovanje React aplikacije
FROM node:20-alpine AS build
WORKDIR /app

# Instaliramo zavisnosti koristeći npm ci (Clean Install) za stabilnost
COPY package*.json ./
RUN npm ci

# Kopiramo ostatak koda i pokrećemo Vite produkcioni build
COPY . .
RUN npm run build

# Faza 2: Serviranje statičkih asseta pomoću Nginx-a
FROM nginx:1.25-alpine

# Kopiramo našu klijentsku routing konfiguraciju
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiramo sve izgrađene fajlove iz 'dist' foldera prve faze u Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

## 7. Orkestracija sa Docker Compose-om

Pisanje dugačkih terminal komandi za pokretanje kontejnera je zamorno i sklono greškama. **Docker Compose** nam omogućava da celokupan multi-service sistem (bazu podataka, backend i frontend) opišemo u jednom YAML fajlu: [docker-compose.yml](file:///d:/vibe/todo-list/docker-compose.yml).

Prođimo kroz svaku liniju našeg `docker-compose.yml` u korenu projekta da bismo razumeli arhitekturu orkestracije:

```yaml
version: '3.8'

services:
  # =========================================================================
  # 1. Servis za PostgreSQL Bazu Podataka
  # =========================================================================
  postgres:
    image: postgres:16-alpine            # Koristimo zvaničnu laganu postgres sliku
    container_name: todo-postgres
    environment:
      POSTGRES_DB: todos                 # Naziv baze koji se automatski kreira
      POSTGRES_USER: postgres            # Master korisničko ime
      POSTGRES_PASSWORD: postgres        # Master lozinka
    ports:
      - "5432:5432"                      # Mapiramo port 5432 hosta na port 5432 kontejnera
    volumes:
      - pgdata:/var/lib/postgresql/data  # Čuvamo podatke baze na našem fizičkom disku
    networks:
      - todo-network                     # Povezujemo bazu na našu mrežu
    healthcheck:                         # Provera da li je baza stvarno spremna za rad
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s                       # Proverava na svakih 5 sekundi
      timeout: 5s                        # Vreme čekanja na odgovor
      retries: 5                         # Broj pokušaja pre nego što se označi kao unhealthy

  # =========================================================================
  # 2. Servis za Spring Boot Backend API
  # =========================================================================
  backend:
    build:
      context: ./backend/todo-backend    # Direktorijum u kom se nalazi Dockerfile backenda
      dockerfile: Dockerfile
    container_name: todo-backend
    ports:
      - "8080:8080"                      # Mapiramo port 8080 za pristup API-ju van mreže
    environment:
      - SPRING_PROFILES_ACTIVE=local-postgres
      # Povezujemo se na bazu koristeći ime servisa "postgres" kao hostname!
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/todos
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=postgres
      - SPRING_FLYWAY_ENABLED=true
      - SPRING_JPA_HIBERNATE_DDL_AUTO=validate
    depends_on:
      postgres:
        condition: service_healthy       # Backend čeka da postgres prođe healthcheck!
    networks:
      - todo-network

  # =========================================================================
  # 3. Servis za React Frontend served via Nginx
  # =========================================================================
  frontend:
    build:
      context: ./frontend                # Direktorijum u kom se nalazi Dockerfile frontenda
      dockerfile: Dockerfile
    container_name: todo-frontend
    ports:
      - "80:80"                          # Mapiramo port 80 (HTTP) za pristup aplikaciji u browseru
    depends_on:
      - backend                          # Frontend zavisi od pokretanja backenda
    networks:
      - todo-network

# Deklaracija perzistentnog Named Volumena
volumes:
  pgdata:

# Deklaracija izolovane mreže tipa 'bridge'
networks:
  todo-network:
    driver: bridge
```

### Tri ključne Compose lekcije za studente:
1.  **Ime Servisa kao DNS Hostname:**
    Unutar `todo-network` mreže, Docker održava interni DNS server. Zato naš backend u `SPRING_DATASOURCE_URL` ne koristi `localhost` niti IP adresu. On koristi ime servisa baze podataka: **`postgres`**. Za backend, ime `postgres` se rezolvuje direktno na IP adresu kontejnera baze.
2.  **Zašto je `localhost` unutar kontejnera greška?**
    Ako biste unutar `backend` kontejnera stavili `localhost:5432`, backend bi tražio bazu podataka unutar sopstvenog kontejnera. Pošto baze nema unutar backend kontejnera, konekcija bi odmah pukla. **Svaki kontejner ima svoj izolovano značenje za reč `localhost`!**
3.  **Razlika između `depends_on` i `service_healthy`:**
    Obično `depends_on: - postgres` samo garantuje da će se kontejner baze *pokrenuti* pre backenda. Međutim, PostgreSQL serveru je potrebno 3-5 sekundi da prođe startnu sekvencu i počne da prima TCP konekcije na portu 5432. Ako se backend upali pre toga, odmah će baciti grešku povezivanja. Korišćenjem `condition: service_healthy` u kombinaciji sa `healthcheck`-om, garantujemo da backend stoji u mestu sve dok se postgres kompletno ne inicijalizuje i uspešno odgovori na `pg_isready` komandu.

---

## 8. Priručnik za Windows 11 (Docker Desktop + WSL 2)

Windows 11 je idealan OS za rad sa Docker-om zahvaljujući tehnologiji **WSL 2** (Windows Subsystem for Linux 2). Kontejneri se ne emuliraju, već se izvršavaju direktno unutar pravog Linux kernela u izolovanoj virtuelnoj mašini koju Windows 11 kontroliše u letu.

```
+-------------------------------------------------------------+
|                         WINDOWS 11                          |
|                                                             |
|   +-----------------------------------------------------+   |
|   |         WSL 2 (Automated VM with Linux Kernel)      |   |
|   |                                                     |   |
|   |   +---------------------------------------------+   |   |
|   |   |                Docker Engine                |   |   |
|   |   |                                             |   |   |
|   |   |   +------------------+  +---------------+   |   |   |
|   |   |   |  todo-postgres   |  | todo-backend  |   |   |   |
|   |   |   +------------------+  +---------------+   |   |   |
|   |   +---------------------------------------------+   |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

### Korak 1: Podešavanje WSL 2 i Docker Desktop-a
1.  Preuzmite i instalirajte **Docker Desktop for Windows**.
2.  Prilikom instalacije obavezno štiklirajte **"Use the WSL 2 based engine"**.
3.  Ukoliko Windows prijavi da WSL 2 nije ažuriran, otvorite PowerShell kao Administrator i ukucajte:
    ```powershell
    wsl --update
    ```
4.  Otvorite Docker Desktop i uverite se da u Settings -> *General* stoji uključeno *"Use the WSL 2 based engine"*.
5.  U delu Settings -> *Resources* -> *WSL Integration*, uključite integraciju za vašu Linux distribuciju (npr. Ubuntu) ukoliko je koristite u terminalu.

### Korak 2: Važna konfiguracija resursa na Windows 11 (`.wslconfig`)
Podrazumevano, WSL 2 može alocirati do 80% vaše ukupne RAM memorije za Docker kontejnere. To može dovesti do usporavanja Windows-a.
Preporučuje se da ograničite potrošnju resursa kreiranjem konfiguracionog fajla na Windowsu:
1.  Otvorite Explorer i uđite u vaš korisnički folder (kucajte `%USERPROFILE%` unutar adrese).
2.  Napravite novi fajl pod nazivom `.wslconfig` (obratite pažnju da nema ekstenziju `.txt`).
3.  Upišite sledeće redove i sačuvajte:
    ```ini
    [wsl2]
    # Ograničavamo WSL 2 na maksimalno 4GB RAM-a i 2 procesorska jezgra
    memory=4GB
    processors=2
    ```
4.  Restartujte WSL 2 izvršavanjem sledeće komande u PowerShell-u:
    ```powershell
    wsl --shutdown
    ```

### Korak 3: Rešavanje uobičajenih Windows 11 problema i portova
1.  **Port 5432 je zauzet (Port Conflict):**
    U prethodnim lekcijama smo instalirali PostgreSQL direktno na Windows (npr. u `D:\PostgreSQL`). Kada god je taj lokalni servis pokrenut, on okupira port 5432 na Windowsu. Kada pokušate da pokrenete Docker Compose, servis `postgres` će pasti sa greškom da je port 5432 već u upotrebi.
    *   *Rešenje:* Otvorite **Services** aplikaciju u Windows Start meniju, nađite servis `postgresql-x64` (gde je x64 verzija), kliknite desnim klikom i izaberite **Stop**. Takođe možete prebaciti Startup type na **Manual** kako se ne bi pokretao sam pri svakom paljenju Windows-a.
2.  **Greška sa Line Endings (LF vs CRLF):**
    Windows koristi `CRLF` (Carriage Return Line Feed) oznaku za kraj reda u tekstualnim fajlovima, dok Linux koristi `LF` (Line Feed). 
    Ako Git preuzme skripte ili Dockerfile sa `CRLF` krajevima redova, Nginx ili Java unutar Linux kontejnera mogu pasti sa čudnim greškama (npr. `\r: command not found` ili nemogućnost čitanja skripti).
    *   *Rešenje:* Podesite Git na Windows-u da automatski konvertuje redove pre commit-a:
        ```powershell
        git config --global core.autocrlf true
        ```

---

## 9. Docker Komandna "Brza Sveska" (Cheat Sheet)

Sledeće tabele služe kao brzi podsetnik za najvažnije komande koje student treba da koristi tokom svakodnevnog rada:

### Upravljanje Kontejnerima
| Komanda | Opis |
| :--- | :--- |
| **`docker ps`** | Prikazuje listu trenutno aktivnih (pokrenutih) kontejnera. |
| **`docker ps -a`** | Prikazuje sve kontejnere na sistemu (i aktivne i ugašene). |
| **`docker stop <id>`** | Zaustavlja pokrenut kontejner. |
| **`docker rm <id>`** | Briše zaustavljen kontejner sa sistema. |
| **`docker logs -f <id>`** | Prati logove kontejnera u realnom vremenu (live). |
| **`docker exec -it <id> sh`**| Otvara interaktivni terminal unutar samog kontejnera. |

### Upravljanje Slikama (Images)
| Komanda | Opis |
| :--- | :--- |
| **`docker images`** | Prikazuje sve Docker slike sačuvane na računaru. |
| **`docker build -t <ime> .`** | Bilduje sliku na osnovu `Dockerfile`-a u aktivnom folderu (`.`). |
| **`docker rmi <id>`** | Briše Docker sliku sa računara. |

### Docker Compose Komande (Izvršavaju se u korenu projekta)
| Komanda | Opis |
| :--- | :--- |
| **`docker compose up -d`** | Pokreće sve servise u pozadini (Detached mod). |
| **`docker compose up --build -d`**| Forsira ponovno bildovanje slika i pokretanje servisa u pozadini. |
| **`docker compose logs -f`** | Objedinjeno prati logove svih servisa u realnom vremenu. |
| **`docker compose stop`** | Privremeno zaustavlja sve pokrenute servise bez brisanja. |
| **`docker compose down`** | Zaustavlja i kompletno briše kontejnere i virtuelnu mrežu. |
| **`docker compose down -v`** | Zaustavlja kontejnere i kompletno briše perzistentne volumene (resetuje bazu). |

---

## 10. Pitanja za Proveru Znanja i Praktične Vežbe

### Pitanja za učenje:
1.  **Koja je suštinska razlika u arhitekturi između Virtuelne Mašine (Guest OS) i Docker kontejnera?**
2.  **Šta je Docker Image, a šta Docker Container? Napravi analogiju sa programiranjem.**
3.  **Zašto koristimo Multi-Stage build za pravljenje slike našeg Spring Boot backenda? Koje su prednosti?**
4.  **Objasni zašto Nginx u našem frontend kontejneru mora imati `try_files` pravilo i koju grešku na klijentu to sprečava.**
5.  **Unutar `docker-compose.yml`, naš backend se povezuje na bazu preko URL-a `jdbc:postgresql://postgres:5432/todos`. Zašto koristimo hostname `postgres` umesto `localhost`?**
6.  **Kako funkcioniše `healthcheck` na bazi i zašto nam je potreban u kombinaciji sa `depends_on: condition: service_healthy`?**
7.  **Šta se dešava sa podacima u PostgreSQL bazi ako uradimo `docker compose down`, a šta ako uradimo `docker compose down -v`? Zašto?**
8.  **Koja je uloga WSL 2 tehnologije na Windows 11 operativnom sistemu u kontekstu Docker-a?**

### Praktične vežbe za studente:
1.  **Vežba 1 (Uočavanje izolacije portova):**
    Pokrenite Docker Compose stack sa `docker compose up -d`. Otvorite browser na `http://localhost:8080/api/todos` (prikazaće se API) i na `http://localhost` (prikazaće se frontend). Ugasite lokalnu mrežu ili internet i uočite da aplikacija unutar Docker mreže i dalje nesmetano komunicira jer radi u sopstvenom zatvorenom svetu.
2.  **Vežba 2 (Interaktivni ulazak u kontejner):**
    Uđite u pokrenut kontejner baze podataka koristeći komandu:
    ```powershell
    docker exec -it todo-postgres psql -U postgres -d todos
    ```
    Nakon što se otvori PostgreSQL konzola, izvršite upit `SELECT * FROM todo;` da biste videli podatke koje je Flyway automatski upisao pri prvom startu baze, a zatim izađite kucanjem `\q`.
