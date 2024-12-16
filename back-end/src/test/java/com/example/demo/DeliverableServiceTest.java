// JUnit Testing For DeliverableService

package com.example.demo;

import com.example.demo.Deliverables.Deliverable;
import com.example.demo.Deliverables.DeliverableNotFoundException;
import com.example.demo.Deliverables.DeliverableRepository;
import com.example.demo.Deliverables.DeliverableService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class DeliverableServiceTest {

    @Mock
    private DeliverableRepository deliverableRepo;

    @InjectMocks
    private DeliverableService deliverableService;

    private Deliverable deliverable;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        deliverable = new Deliverable();
        deliverable.setDeliverableRelatedNo("D001");
        deliverable.setWorkPackageNo("WP001");
        deliverable.setDeliverableNo("DEL001");
        deliverable.setDeliverableName("Initial Report");
        deliverable.setDescription("This is a test description.");
        deliverable.setLeadBeneficiary("Lead1");
        deliverable.setType("Report");
        deliverable.setDisseminationLevel("Public");
        deliverable.setDueDate(LocalDate.of(2024, 12, 31));
    }

    /* Testing that the service retrieves all deliverables from the repository and returns a
    list containing the deliverables, checking that the list is not empty and contains the correct deliverable */
    @Test
    public void testGetAllDeliverables() {
        List<Deliverable> deliverables = new ArrayList<>();
        deliverables.add(deliverable);
        when(deliverableRepo.findAll()).thenReturn(deliverables);

        List<Deliverable> result = deliverableService.getAllDeliverables();
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("D001", result.get(0).getDeliverableRelatedNo());
    }

    /* Testing that the service retrieves a specific deliverable by its ID from the repository
    and returns the correct deliverable when found */
    @Test
    public void testGetDeliverableById() {
        when(deliverableRepo.findById("D001")).thenReturn(Optional.of(deliverable));
        Deliverable result = deliverableService.getDeliverableById("D001");
        assertNotNull(result);
        assertEquals("D001", result.getDeliverableRelatedNo());
    }

    /* Testing that the service throws a DeliverableNotFoundException when attempting to retrieve
    a deliverable with an ID that does not exist in the repository */
    @Test
    public void testGetDeliverableById_NotFound() {
        when(deliverableRepo.findById("D002")).thenReturn(Optional.empty());
        Exception exception = assertThrows(DeliverableNotFoundException.class, () -> {
            deliverableService.getDeliverableById("D002");
        });
        assertEquals("Could not found the Deliverable with ID D002", exception.getMessage());
    }

    /* Testing that the service updates an existing deliverable in the repository and returns
    the updated deliverable when the deliverable is found and updated successfully */
    @Test
    public void testUpdateDeliverable() {
        Deliverable updatedDeliverable = new Deliverable();
        updatedDeliverable.setDeliverableRelatedNo("D001");
        updatedDeliverable.setDeliverableName("Updated Report");

        when(deliverableRepo.findById("D001")).thenReturn(Optional.of(deliverable));
        when(deliverableRepo.save(any(Deliverable.class))).thenReturn(updatedDeliverable);

        Deliverable result = deliverableService.updateDeliverable("D001", updatedDeliverable);
        assertNotNull(result);
        assertEquals("Updated Report", result.getDeliverableName());
    }

    /* Testing that the service successfully deletes a deliverable by its ID when it exists
    in the repository, and returns a confirmation message */
    @Test
    public void testDeleteDeliverable() {
        when(deliverableRepo.existsById("D001")).thenReturn(true);
        String result = deliverableService.deleteDeliverable("D001");
        verify(deliverableRepo, times(1)).deleteById("D001");
        assertEquals("Deliverable with id D001 has been deleted!", result);
    }

    /* Testing that the service throws a DeliverableNotFoundException when attempting to delete a deliverable
    with an ID that does not exist in the repository */
    @Test
    public void testDeleteDeliverable_NotFound() {
        when(deliverableRepo.existsById("D002")).thenReturn(false);
        Exception exception = assertThrows(DeliverableNotFoundException.class, () -> {
            deliverableService.deleteDeliverable("D002");
        });
        assertEquals("Could not found the Deliverable with ID D002", exception.getMessage());
    }
}

