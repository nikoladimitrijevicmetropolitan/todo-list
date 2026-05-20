package rs.ac.metropolitan.todo_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:todo-test;DB_CLOSE_DELAY=-1")
class TodoBackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
