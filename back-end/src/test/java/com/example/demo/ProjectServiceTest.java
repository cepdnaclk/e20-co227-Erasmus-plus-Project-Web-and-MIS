// JUnit Testing For ProjectService

package com.example.demo;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserService;
import com.example.demo.notification.NotificationService;
import com.example.demo.projectSummary.Project;
import com.example.demo.projectSummary.ProjectRepository;
import com.example.demo.projectSummary.ProjectService;
import com.example.demo.projectSummary.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private AppUserService userService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ProjectService projectService;

    private Project project;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        project = new Project();
        project.setId(1L);
        project.setStatus("In Progress");
        project.setEndDate(LocalDate.of(2024, 12, 31));
    }

    /* Testing the retrieval of the latest project from the repository.
       The method should return an Optional containing the project with status "In Progress" */
    @Test
    void testGetLatestProject() {
        when(projectRepository.findTopByOrderByIdDesc()).thenReturn(Optional.of(project));

        Optional<Project> latestProject = projectService.getLatestProject();
        assertTrue(latestProject.isPresent());
        assertEquals("In Progress", latestProject.get().getStatus());
    }

    /* Testing the creation of a new project */
    @Test
    void testCreateProject() {
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project savedProject = projectService.createProject(project);
        assertNotNull(savedProject);
        assertEquals(1L, savedProject.getId());
        verify(projectRepository, times(1)).save(project);
    }

    /* Testing the updating of an existing project.
     The method should update the project's status and end date, and create a notification for the project summary */
    @Test
    void testUpdateProject() {
        List<AppUser> users = new ArrayList<>();
        users.add(new AppUser()); // Mock user

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(userService.getAllUsers()).thenReturn(users);
        when(projectRepository.save(project)).thenReturn(project);

        Project updatedProject = projectService.updateProject(1L, "Completed", LocalDate.of(2024, 11, 30));

        assertEquals("Completed", updatedProject.getStatus());
        assertEquals(LocalDate.of(2024, 11, 30), updatedProject.getEndDate());
        verify(notificationService, times(1)).createNotification(anyString(), any(AppUser.class), eq("typeProjectSummary"));
    }

    /* Testing that updating a non-existing project throws a ResourceNotFoundException.
      The method should throw the exception when the project ID is not found in the repository */
    @Test
    void testUpdateProject_ThrowsException() {
        when(projectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.updateProject(1L, "Completed", LocalDate.of(2024, 11, 30));
        });
    }
}

