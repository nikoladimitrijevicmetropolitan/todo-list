package rs.ac.metropolitan.todo_backend;

import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TodoControllerTest {

	private MockMvc mockMvc;
	private TodoRepository todoRepository;

	@BeforeEach
	void setUp() {
		todoRepository = Mockito.mock(TodoRepository.class);
		TodoController todoController = new TodoController(todoRepository);
		mockMvc = MockMvcBuilders.standaloneSetup(todoController).build();
	}

	@Test
	void listTodos_ReturnsList200Ok() throws Exception {
		Todo mockTodo = new Todo("Testirati aplikaciju");
		Mockito.when(todoRepository.findAllByOrderByCreatedAtDesc())
			.thenReturn(List.of(mockTodo));

		mockMvc.perform(get("/api/todos"))
			.andExpect(status().isOk())
			.andExpect(content().contentType(MediaType.APPLICATION_JSON))
			.andExpect(jsonPath("$[0].title").value("Testirati aplikaciju"))
			.andExpect(jsonPath("$[0].completed").value(false));
	}

	@Test
	void getTodoById_WithExistingId_ReturnsTodo200Ok() throws Exception {
		Todo mockTodo = new Todo("Testirati pojedinacno");
		Mockito.when(todoRepository.findById(1L)).thenReturn(Optional.of(mockTodo));

		mockMvc.perform(get("/api/todos/1"))
			.andExpect(status().isOk())
			.andExpect(content().contentType(MediaType.APPLICATION_JSON))
			.andExpect(jsonPath("$.title").value("Testirati pojedinacno"))
			.andExpect(jsonPath("$.completed").value(false));
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

	@Test
	void updateTodo_WithValidChanges_Returns200Ok() throws Exception {
		Todo mockTodo = new Todo("Originalni naslov");
		Mockito.when(todoRepository.findById(1L)).thenReturn(Optional.of(mockTodo));
		Mockito.when(todoRepository.save(any(Todo.class))).thenAnswer(invocation -> invocation.getArgument(0));

		mockMvc.perform(patch("/api/todos/1")
			.contentType(MediaType.APPLICATION_JSON)
			.content("{\"completed\": true}"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.completed").value(true));
	}

	@Test
	void deleteTodo_WithExistingId_Returns204NoContent() throws Exception {
		Todo mockTodo = new Todo("Zadatak za brisanje");
		Mockito.when(todoRepository.findById(1L)).thenReturn(Optional.of(mockTodo));

		mockMvc.perform(delete("/api/todos/1"))
			.andExpect(status().isNoContent());

		Mockito.verify(todoRepository).delete(mockTodo);
	}
}
