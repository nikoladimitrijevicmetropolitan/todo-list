package rs.ac.metropolitan.todo_backend;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

@Component
public class TodoSeedDataLoader implements CommandLineRunner {

	private final TodoRepository todoRepository;

	public TodoSeedDataLoader(TodoRepository todoRepository) {
		this.todoRepository = todoRepository;
	}

	@Override
	public void run(String... args) throws IOException {
		if (todoRepository.count() > 0) {
			return;
		}

		List<Todo> todos = readSeedTodos();

		todoRepository.saveAll(todos);
	}

	private List<Todo> readSeedTodos() throws IOException {
		ClassPathResource seedFile = new ClassPathResource("seed-todos.csv");

		try (BufferedReader reader = new BufferedReader(
			new InputStreamReader(seedFile.getInputStream(), StandardCharsets.UTF_8))) {
			return reader.lines()
				.skip(1)
				.filter(line -> !line.isBlank())
				.map(this::toTodo)
				.toList();
		}
	}

	private Todo toTodo(String line) {
		String[] fields = line.split(",", 2);
		if (fields.length != 2 || fields[1].trim().isEmpty()) {
			throw new IllegalArgumentException("Neispravan seed zapis: " + line);
		}

		SeedTodo seedTodo = new SeedTodo(fields[1].trim(), Boolean.parseBoolean(fields[0].trim()));
		return toTodo(seedTodo);
	}

	private Todo toTodo(SeedTodo seedTodo) {
		Todo todo = new Todo(seedTodo.title());
		todo.setCompleted(seedTodo.completed());
		return todo;
	}

	public record SeedTodo(String title, boolean completed) {
	}
}
