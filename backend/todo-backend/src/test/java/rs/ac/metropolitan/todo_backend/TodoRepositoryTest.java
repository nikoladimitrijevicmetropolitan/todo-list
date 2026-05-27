package rs.ac.metropolitan.todo_backend;

import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class TodoRepositoryTest {

	@Autowired
	private TodoRepository todoRepository;

	@BeforeEach
	void cleanDb() {
		todoRepository.deleteAll();
	}

	@Test
	void saveAndFindAllByOrderByCreatedAtDesc_ReturnsSortedTodos() throws InterruptedException {
		// Save first todo
		Todo first = new Todo("Prvi zadatak");
		todoRepository.save(first);

		// Sleep briefly to guarantee different createdAt timestamps
		Thread.sleep(10);

		// Save second todo
		Todo second = new Todo("Drugi zadatak");
		todoRepository.save(second);

		// Fetch sorted
		List<Todo> sorted = todoRepository.findAllByOrderByCreatedAtDesc();

		// The second one (newest) should be first in the list
		assertEquals(2, sorted.size());
		assertEquals("Drugi zadatak", sorted.get(0).getTitle());
		assertEquals("Prvi zadatak", sorted.get(1).getTitle());
	}

	@Test
	void updateCompletedStatus_PersistsCorrectly() {
		Todo todo = new Todo("Zadatak za izmenu");
		assertFalse(todo.isCompleted());
		Todo saved = todoRepository.save(todo);

		saved.setCompleted(true);
		Todo updated = todoRepository.save(saved);

		assertTrue(updated.isCompleted());

		Todo fetched = todoRepository.findById(updated.getId()).orElseThrow();
		assertTrue(fetched.isCompleted());
	}
}
