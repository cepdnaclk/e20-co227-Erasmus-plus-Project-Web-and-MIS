// JUnit Testing For TaskService

package com.example.demo;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.notification.NotificationService;
import com.example.demo.task.Task;
import com.example.demo.task.TaskRepository;
import com.example.demo.task.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private AppUser user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        task = new Task(1, "Task 1", LocalDate.of(2024, 10, 21), LocalDate.of(2024, 11, 1), "Description", 50.0f, null);
        user = new AppUser();
        user.setId(1L);
    }

    /* Testing the retrieval of all tasks from the TaskRepository.
      The method should return a list containing the mocked task */
    @Test
    void testGetAllTasks() {
        List<Task> tasks = Arrays.asList(task);
        when(taskRepository.findAllOrderByTaskIDesc()).thenReturn(tasks);

        List<Task> result = taskService.getAllTasks();

        assertEquals(1, result.size());
        assertEquals(task, result.get(0));
    }

    /* Testing the retrieval of a specific task by its ID.
      The method should return the mocked task when the ID is 1 */
    @Test
    void testGetTask() {
        when(taskRepository.findById(1)).thenReturn(Optional.of(task));

        Task result = taskService.getTask(1);

        assertEquals(task, result);
    }

    /* Testing the addition of a task.
      The method should call the save method of the taskRepository once */
    @Test
    void testAddTask() {
        taskService.addTask(task);
        verify(taskRepository, times(1)).save(task);
    }

    /* Testing the update functionality of a task.
      The method should call the save method of the taskRepository once with the updated task */
    @Test
    void testUpdateTask() {
        taskService.updateTask(task);
        verify(taskRepository, times(1)).save(task);
    }

    /* Testing the deletion of a task by its ID.
      The method should call the deleteById method of the taskRepository once */
    @Test
    void testDeleteTask() {
        taskService.deleteTask(1);
        verify(taskRepository, times(1)).deleteById(1);
    }

    /* Testing the update functionality of a task with assigned users.
      The method should create a notification for the user and save the updated task */
    @Test
    void testUpdateTaskWithUsers() {
        Set<AppUser> taskMembers = new HashSet<>();
        taskMembers.add(user);

        taskService.updateTaskWithUsers(task, taskMembers);

        verify(notificationService, times(1)).createNotification(anyString(), eq(user), eq("typeTask"));
        verify(taskRepository, times(1)).save(task);
    }

    /* Testing the retrieval of tasks for a specific user.
      The method should return a list of tasks assigned to the user */
    @Test
    void testFindUserTasks() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        List<Task> tasks = Arrays.asList(task);
        when(taskRepository.findTasksByUser(user)).thenReturn(tasks);

        List<Task> result = taskService.findUserTasks(1L);

        assertEquals(1, result.size());
        assertEquals(task, result.get(0));
    }
}
