// JUnit Testing For TaskController

package com.example.demo;

import com.example.demo.task.Task;
import com.example.demo.task.TaskController;
import com.example.demo.task.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private Task task;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        task = new Task(1, "Task 1", LocalDate.of(2024, 10, 21), LocalDate.of(2024, 11, 1), "Description", 50.0f, null);
    }

    /* Testing the retrieval of the task list from the TaskService.
      The method should return a list containing the mocked task */
    @Test
    void testGetTaskList() {
        List<Task> tasks = Arrays.asList(task);
        when(taskService.getAllTasks()).thenReturn(tasks);

        List<Task> result = taskController.getTaskList();

        assertEquals(1, result.size());
        assertEquals(task, result.get(0));
    }

    /* Testing the retrieval of a specific task by its ID from the TaskService.
      The method should return the mocked task when the ID is 1 */
    @Test
    void testGetTask() {
        when(taskService.getTask(1)).thenReturn(task);

        Task result = taskController.getTask(1);

        assertEquals(task, result);
    }

    /* Testing the deletion of a task by its ID.
      The method should return a success message and HTTP status 200 */
    @Test
    void testDeleteTask() {
        ResponseEntity<String> response = taskController.deleteTask(1);

        assertEquals("Task deleted successfully", response.getBody());
        assertEquals(200, response.getStatusCodeValue());
        verify(taskService, times(1)).deleteTask(1);
    }
}

