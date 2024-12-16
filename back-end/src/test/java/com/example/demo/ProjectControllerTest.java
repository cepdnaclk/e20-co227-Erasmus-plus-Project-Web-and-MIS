// JUnit Testing For ProjectController

package com.example.demo;

import com.example.demo.projectSummary.Project;
import com.example.demo.projectSummary.ProjectController;
import com.example.demo.projectSummary.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    private Project project;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.initMocks(this);
        project = new Project();
        project.setId(1L);
        project.setStatus("In Progress");
        project.setEndDate(LocalDate.of(2024, 12, 31));
    }

    /* Testing that the controller retrieves the latest project and returns it with an HTTP OK status */
    @Test
    void testGetLatestProject() {
        when(projectService.getLatestProject()).thenReturn(Optional.of(project));

        ResponseEntity<Project> response = projectController.getLatestProject();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(project, response.getBody());
        verify(projectService, times(1)).getLatestProject();
    }

    /* Testing that a new project can be created successfully, returning the created project with an HTTP OK status */
    @Test
    void testCreateProject() {
        when(projectService.createProject(any(Project.class))).thenReturn(project);

        ResponseEntity<Project> response = projectController.createProject(project);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(project, response.getBody());
        verify(projectService, times(1)).createProject(project);
    }

    /* Testing that an existing project can be updated successfully, returning the updated project with an HTTP OK status */
    @Test
    void testUpdateProject() {
        project.setStatus("Completed");
        project.setEndDate(LocalDate.of(2024, 11, 30));
        when(projectService.updateProject(eq(1L), any(String.class), any(LocalDate.class))).thenReturn(project);
        ResponseEntity<Project> response = projectController.updateProject(1L, project);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(project, response.getBody());
        verify(projectService, times(1)).updateProject(1L, project.getStatus(), project.getEndDate());
    }
}
