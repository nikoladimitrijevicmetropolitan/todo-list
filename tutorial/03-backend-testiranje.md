# 03 - Backend testiranje (Prošireno izdanje)

## Cilj lekcije

Cilj ove lekcije je da studenti u potpunosti razumeju slojeve testiranja na backendu u Spring Boot aplikaciji: unit (jedinične), repository (sloj baze podataka), controller/API (HTTP ugovorni sloj) i integracione testove. 

Poseban fokus je na tome kako da studenti analiziraju i implementiraju prve četiri ključne faze testiranja lokalno i u in-memory H2 okruženju, ostavljajući petu fazu (integracione testove sa Testcontainers PostgreSQL) za kasniju migraciju na PostgreSQL bazu.

Na kraju lekcije student treba da ume da objasni:

- Šta proverava i obezbeđuje osnovni `contextLoads` smoke test.
- Kako se pišu brzi jedinični (unit) testovi za izolovanu validaciju bez podizanja Spring konteksta.
- Zašto se upiti i mapiranje baze testiraju izolovano kroz `@DataJpaTest`.
- Kako `MockMvc` omogućava testiranje HTTP ugovora REST API-ja (status kodovi, JSON formati, CORS, validacija).
- Kako izolovati testove i osigurati transakcioni rollback kako podaci ne bi ostajali u bazi.

---

## Teorijsko objašnjenje i test slojevi

Testiranje backenda se bazira na proveri ispravnosti ugovora koje aplikacija nudi (API), njene poslovne logike i bezbednosti skladištenja podataka. Projekat delimo na jasno definisane slojeve testova:

### Faza 1: Smoke Test (`contextLoads`)
Spring Boot nam po difoltu generiše smoke test klasu. Ovaj test ne proverava pojedinačne funkcionalnosti niti API rute. Njegova jedina uloga je da se uveri da se celokupan **Spring ApplicationContext** može uspešno podići. Ako zaboravite `@Autowired` anotaciju, napravite cirkularnu zavisnost ili pogrešno konfigurišete `application.properties`, ovaj test će odmah pasti (npr. bacanjem `BeanCreationException`).

### Faza 2: Jedinični (Unit) Testovi
Najbrži nivo testiranja. Ovi testovi uopšte ne učitavaju Spring kontekst niti komuniciraju sa bazom podataka. Koriste se za proveru čistih logičkih funkcija i metoda (npr. provera da li prosleđivanje praznog ili `null` stringa u formi za kreiranje zadataka ispravno baca BadRequest grešku). Zavisnosti se, ukoliko postoje, ručno mock-uju preko Mockito framework-a.

### Faza 3: Repository Testovi (`@DataJpaTest`)
Repository sloj je zadužen za interakciju sa relacionom bazom preko Hibernate-a i Spring Data JPA.
*   **Kako rade:** Koristi se anotacija `@DataJpaTest` koja učitava samo entitete i repository interfejse (znatno brže od podizanja cele aplikacije).
*   **Baza podataka:** Podrazumevano se koristi privremena in-memory **H2 baza**. Svaki test se izvršava unutar zasebne transakcije i automatski vrši **rollback** nakon završetka testa. Time se osigurava da baze ostane čista za naredne provere.

### Faza 4: API / Controller Testovi (`@WebMvcTest`)
Ovaj sloj verifikuje HTTP ugovor koji frontend koristi. Ovde nas ne zanima stvarna baza, već provera rutinga, mapiranja metoda, ispravnosti JSON šema, CORS pravila i validacije ulaza.
*   **Kako rade:** Koristi se `@WebMvcTest(TodoController.class)` koja učitava samo web sloj.
*   **Simulacija HTTP poziva:** Pomoću `MockMvc` simulatora šaljemo zahteve (npr. `get()`, `post()`) i vršimo asertacije nad ishodima.
*   **Izolacija:** Repository se mock-uje upotrebom `@MockBean` anotacije kako testovi ne bi zavisili od baze.

---

## Implementirane provere i kodovi u Todo aplikaciji

U našoj Todo aplikaciji uspešno smo implementirali prve četiri faze testiranja. U nastavku su prikazani stvarni kodovi testova koje studenti mogu proučavati i koristiti za učenje:

### 1. Faza 1: Smoke Test (`TodoBackendApplicationTests.java`)
```java
package rs.ac.metropolitan.todo_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:todo-test;DB_CLOSE_DELAY=-1")
class TodoBackendApplicationTests {

	@Test
	void contextLoads() {
		// Osnovna provera uspesnosti podizanja Spring konteksta
	}
}
```

### 2. Faza 2: Jedinični test validacije (`TodoControllerUnitTest.java`)
Brzi test bez pokretanja Springa koji direktno proverava odbijanje neispravnog unosa:
```java
package rs.ac.metropolitan.todo_backend;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;

class TodoControllerUnitTest {

	private TodoRepository todoRepository;
	private TodoController todoController;

	@BeforeEach
	void setUp() {
		todoRepository = Mockito.mock(TodoRepository.class);
		todoController = new TodoController(todoRepository);
	}

	@Test
	void createTodo_WithNullTitle_ThrowsBadRequest() {
		TodoController.TodoCreateRequest request = new TodoController.TodoCreateRequest(null);
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			todoController.createTodo(request);
		});
		assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
		assertEquals("Naziv zadatka je obavezan.", exception.getReason());
	}

	@Test
	void createTodo_WithBlankTitle_ThrowsBadRequest() {
		TodoController.TodoCreateRequest request = new TodoController.TodoCreateRequest("   ");
		ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
			todoController.createTodo(request);
		});
		assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
		assertEquals("Naziv zadatka je obavezan.", exception.getReason());
	}
}
```

### 3. Faza 3: Repository Test (`TodoRepositoryTest.java`)
Testira ispravnost mapiranja, upisa, izmena i custom sortiranja rezultata na bazi:
```java
package rs.ac.metropolitan.todo_backend;

import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class TodoRepositoryTest {

	@Autowired
	private TodoRepository todoRepository;

	@Test
	void saveAndFindAllByOrderByCreatedAtDesc_ReturnsSortedTodos() throws InterruptedException {
		Todo first = new Todo("Prvi zadatak");
		todoRepository.save(first);

		Thread.sleep(10); // Pauza kako bi se osigurali razliciti timestamps

		Todo second = new Todo("Drugi zadatak");
		todoRepository.save(second);

		List<Todo> sorted = todoRepository.findAllByOrderByCreatedAtDesc();

		assertEquals(2, sorted.size());
		assertEquals("Drugi zadatak", sorted.get(0).getTitle());
		assertEquals("Prvi zadatak", sorted.get(1).getTitle());
	}

	@Test
	void updateCompletedStatus_PersistsCorrectly() {
		Todo todo = new Todo("Zadatak za izmenu");
		Todo saved = todoRepository.save(todo);

		saved.setCompleted(true);
		Todo updated = todoRepository.save(saved);

		assertTrue(updated.isCompleted());
	}
}
```

### 4. Faza 4: API MockMvc Test (`TodoControllerTest.java`)
Testira HTTP status kodove, ispravne odgovore i JSON strukturu na MVC sloju:
```java
package rs.ac.metropolitan.todo_backend;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TodoController.class)
class TodoControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private TodoRepository todoRepository;

	@Test
	void listTodos_ReturnsList200Ok() throws Exception {
		Todo mockTodo = new Todo("Testirati aplikaciju");
		Mockito.when(todoRepository.findAllByOrderByCreatedAtDesc())
			.thenReturn(List.of(mockTodo));

		mockMvc.perform(get("/api/todos"))
			.andExpect(status().isOk())
			.andExpect(content().contentType(MediaType.APPLICATION_JSON))
			.andExpect(jsonPath("$[0].title").value("Testirati aplikaciju"));
	}

	@Test
	void getTodoById_WithExistingId_ReturnsTodo200Ok() throws Exception {
		Todo mockTodo = new Todo("Testirati pojedinacno");
		Mockito.when(todoRepository.findById(1L)).thenReturn(Optional.of(mockTodo));

		mockMvc.perform(get("/api/todos/1"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.title").value("Testirati pojedinacno"));
	}

	@Test
	void getTodoById_WithNonExistingId_Returns404NotFound() throws Exception {
		Mockito.when(todoRepository.findById(999L)).thenReturn(Optional.empty());

		mockMvc.perform(get("/api/todos/999"))
			.andExpect(status().isNotFound());
	}

	@Test
	void createTodo_WithValidTitle_ReturnsCreated201() throws Exception {
		Todo mockTodo = new Todo("Novi zadatak");
		Mockito.when(todoRepository.save(any(Todo.class))).thenReturn(mockTodo);

		mockMvc.perform(post("/api/todos")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"title\": \"Novi zadatak\"}"))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.title").value("Novi zadatak"));
	}

	@Test
	void createTodo_WithInvalidTitle_Returns400BadRequest() throws Exception {
		mockMvc.perform(post("/api/todos")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"title\": \"   \"}"))
			.andExpect(status().isBadRequest());
	}
}
```

---

## Pokretanje testova na backendu

Pokretanje svih testova iz komandne linije se vrši pomoću Maven wrappera:

```powershell
# Pozicionirajte se u backend/todo-backend direktorijum i izvrsite:
.\mvnw.cmd test
```

Maven će kompajlirati klase, pokrenuti in-memory test bazu i izvršiti sve jedinične, komponentne i repozitorijumske testove dajući detaljan izveštaj o ishodu.

---

## Tipične greške kod testiranja backenda

*   **Pokretanje celog konteksta za unit testove:** Korišćenje `@SpringBootTest` za brze logičke testove, što drastično usporava vreme izvršavanja.
*   **Neizolovanost podataka:** Zaboravljanje transakcionog karaktera testova baze, pa test podaci iz jednog testa ostanu u bazi i obore sledeći test. `@DataJpaTest` ovo rešava automatskim rollback-om.
*   **Netestiranje graničnih slučajeva:** Testiranje isključivo uspešnih zahteva (happy path), dok se provere praznog unosa, nepodržanih formata ili nepostojećih ID-jeva izostavljaju.
*   **Zavisnost od spoljnih servisa:** Testiranje kontrolera direktno nad bazom umesto korišćenja `@MockBean` u `@WebMvcTest`-u.

---

## Pitanja za proveru znanja

1.  Koja je primarna uloga `@SpringBootTest` smoke testa i koje greške u konfiguraciji on najbrže hvata?
2.  Zašto u `@WebMvcTest` testovima koristimo `@MockBean` za repository sloj umesto prave konekcije sa bazom?
3.  Kako `@DataJpaTest` garantuje da podaci koje upišemo tokom izvršavanja jednog testa neće zagaditi bazu za sledeći test?
4.  Koja je razlika u brzini i resursima između unit testa i integracionog testa koji koristi pravu bazu (bilo H2 ili PostgreSQL)?
5.  Zašto je važno pisati negativne testove (npr. provera da li slanje praznog naslova ispravno vraća 400 Bad Request) u API sloju?
6.  Kako `MockMvc` simulator doprinosi brzini i stabilnosti ugovornih API testova u poređenju sa pravim slanjem HTTP zahteva preko mreže?
