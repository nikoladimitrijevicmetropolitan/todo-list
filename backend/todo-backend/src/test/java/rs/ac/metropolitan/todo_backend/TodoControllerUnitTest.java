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
