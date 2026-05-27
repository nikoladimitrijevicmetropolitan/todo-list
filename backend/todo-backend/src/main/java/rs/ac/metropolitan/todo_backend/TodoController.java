package rs.ac.metropolitan.todo_backend;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class TodoController {

	private final TodoRepository todoRepository;

	public TodoController(TodoRepository todoRepository) {
		this.todoRepository = todoRepository;
	}

	@GetMapping
	public List<Todo> listTodos() {
		return todoRepository.findAllByOrderByCreatedAtDesc();
	}

	@GetMapping("/{id}")
	public Todo getTodoById(@PathVariable Long id) {
		return findTodo(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public Todo createTodo(@RequestBody TodoCreateRequest request) {
		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naziv zadatka je obavezan.");
		}

		return todoRepository.save(new Todo(normalizeTitle(request.title())));
	}

	@PatchMapping("/{id}")
	public Todo updateTodo(@PathVariable Long id, @RequestBody TodoUpdateRequest request) {
		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nema podataka za izmenu.");
		}

		Todo todo = findTodo(id);

		if (request.title() != null) {
			todo.setTitle(normalizeTitle(request.title()));
		}

		if (request.completed() != null) {
			todo.setCompleted(request.completed());
		}

		return todoRepository.save(todo);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteTodo(@PathVariable Long id) {
		Todo todo = findTodo(id);
		todoRepository.delete(todo);
	}

	private Todo findTodo(Long id) {
		return todoRepository.findById(id)
			.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo nije pronadjen."));
	}

	private String normalizeTitle(String title) {
		if (title == null || title.trim().isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Naziv zadatka je obavezan.");
		}

		return title.trim();
	}

	public record TodoCreateRequest(String title) {
	}

	public record TodoUpdateRequest(String title, Boolean completed) {
	}
}
