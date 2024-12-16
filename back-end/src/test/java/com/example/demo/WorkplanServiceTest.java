// JUnit Testing For WorkplanService

package com.example.demo;

import com.example.demo.Deliverables.DeliverableNotFoundException;
import com.example.demo.Workplan.WorkplanActivity;
import com.example.demo.Workplan.WorkplanRepository;
import com.example.demo.Workplan.WorkplanService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class WorkplanServiceTest {

    @InjectMocks
    private WorkplanService workplanService;

    @Mock
    private WorkplanRepository workplanRepo;

    private WorkplanActivity workplanActivity;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        workplanActivity = new WorkplanActivity(
                1, "ACT001", "Test Activity", true, false, true, false,
                true, false, true, false,
                true, false, true, false,
                true, false, true, false
        );
    }

    // Testing that the service fetches all activities from the repository and returns a non-empty list
    @Test
    public void testGetAllActivities() {
        when(workplanRepo.findAll()).thenReturn(Arrays.asList(workplanActivity));
        List<WorkplanActivity> result = workplanService.getAllActivities();
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals(workplanActivity, result.get(0));
        verify(workplanRepo, times(1)).findAll();
    }

    // Testing that the service retrieves a specific activity by its ID and returns the correct activity when found
    @Test
    public void testGetActivityById() {
        when(workplanRepo.findById("1")).thenReturn(Optional.of(workplanActivity));
        WorkplanActivity result = workplanService.getActivityById("1");
        assertNotNull(result);
        assertEquals(workplanActivity, result);
        verify(workplanRepo, times(1)).findById("1");
    }

    // Testing that the service throws DeliverableNotFoundException when the activity with the given ID is not found
    @Test
    public void testGetActivityByIdNotFound() {
        when(workplanRepo.findById("1")).thenReturn(Optional.empty());
        assertThrows(DeliverableNotFoundException.class, () -> workplanService.getActivityById("1"));
        verify(workplanRepo, times(1)).findById("1");
    }

    // Testing that the service throws DeliverableNotFoundException when trying to update a non-existent activity
    @Test
    public void testUpdateActivityNotFound() {
        WorkplanActivity updatedActivity = new WorkplanActivity(
                1, "ACT002", "Updated Activity", false, true, false, true,
                false, true, false, true,
                false, true, false, true,
                false, true, false, true
        );
        when(workplanRepo.findById("1")).thenReturn(Optional.empty());
        assertThrows(DeliverableNotFoundException.class, () -> workplanService.updateActivity("1", updatedActivity));
        verify(workplanRepo, times(1)).findById("1");
    }

    // Testing that the service successfully deletes an activity by its ID and returns a confirmation message
    @Test
    public void testDeleteActivity() {
        when(workplanRepo.existsById("1")).thenReturn(true);
        doNothing().when(workplanRepo).deleteById("1");
        String result = workplanService.deleteActivity("1");
        assertEquals("Activity with id 1 has been deleted!", result);
        verify(workplanRepo, times(1)).existsById("1");
        verify(workplanRepo, times(1)).deleteById("1");
    }

    // Testing that the service throws DeliverableNotFoundException when attempting to delete a non-existent activity
    @Test
    public void testDeleteActivityNotFound() {
        when(workplanRepo.existsById("1")).thenReturn(false);
        assertThrows(DeliverableNotFoundException.class, () -> workplanService.deleteActivity("1"));
        verify(workplanRepo, times(1)).existsById("1");
    }
}
