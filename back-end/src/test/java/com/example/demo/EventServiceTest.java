// JUnit Testing For EventService

package com.example.demo;

import com.example.demo.Events.Event;
import com.example.demo.Events.EventRepository;
import com.example.demo.Events.EventService;
import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserService;
import com.example.demo.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private AppUserService userService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private EventService eventService;

    private Event event;
    private List<AppUser> users;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        event = new Event();
        event.setId(1L);
        event.setTitle("Event Title");
        event.setDetails("Event Details");
        event.setDate(LocalDate.now());
        event.setTime("10:00 AM");
        event.setVenue("Venue");

        AppUser user1 = new AppUser();
        user1.setId(1L);
        user1.setEmail("user1@example.com");

        AppUser user2 = new AppUser();
        user2.setId(2L);
        user2.setEmail("user2@example.com");

        users = Arrays.asList(user1, user2);
    }

    /* Testing that the service retrieves all events from the repository and returns the correct list of events */
    @Test
    public void testGetAllEvents() {
        when(eventRepository.findAll()).thenReturn(Arrays.asList(event));

        List<Event> events = eventService.getAllEvents();

        assertNotNull(events);
        assertEquals(1, events.size());
        verify(eventRepository, times(1)).findAll();
    }

    /* Testing that the service creates a new event, saves it to the repository, and sends notifications to all users */
    @Test
    public void testCreateEvent() {
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(userService.getAllUsers()).thenReturn(users);

        Event createdEvent = eventService.createEvent(event);

        assertNotNull(createdEvent);
        assertEquals(event.getTitle(), createdEvent.getTitle());
        verify(eventRepository, times(1)).save(event);
        verify(userService, times(1)).getAllUsers();
        verify(notificationService, times(2)).createNotification(anyString(), any(AppUser.class), eq("typeEvent"));
    }

    /* Testing that the service updates an existing event with new details and saves the updated event back to the repository */
    @Test
    public void testUpdateEvent() {
        when(eventRepository.findById(anyLong())).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event eventDetails = new Event();
        eventDetails.setTitle("Updated Title");
        eventDetails.setDetails("Updated Details");
        eventDetails.setDate(LocalDate.now());
        eventDetails.setTime("2:00 PM");
        eventDetails.setVenue("Updated Venue");

        Event updatedEvent = eventService.updateEvent(1L, eventDetails);

        assertNotNull(updatedEvent);
        assertEquals(eventDetails.getTitle(), updatedEvent.getTitle());
        assertEquals(eventDetails.getDetails(), updatedEvent.getDetails());
        verify(eventRepository, times(1)).findById(1L);
        verify(eventRepository, times(1)).save(event);
    }

    /* Testing that the service deletes an event by its ID from the repository */
    @Test
    public void testDeleteEvent() {
        doNothing().when(eventRepository).deleteById(anyLong());

        eventService.deleteEvent(1L);

        verify(eventRepository, times(1)).deleteById(1L);
    }

    /* Testing that the service retrieves a specific event by its ID from the repository and returns the correct event when found */
    @Test
    public void testGetEventById() {
        when(eventRepository.findById(anyLong())).thenReturn(Optional.of(event));

        Optional<Event> foundEvent = eventService.getEventById(1L);

        assertTrue(foundEvent.isPresent());
        assertEquals(event.getTitle(), foundEvent.get().getTitle());
        verify(eventRepository, times(1)).findById(1L);
    }
}
