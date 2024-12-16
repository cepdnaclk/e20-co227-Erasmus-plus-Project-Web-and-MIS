// JUnit Testing For NotificationController

package com.example.demo;

import com.example.demo.appuser.AppUser;
import com.example.demo.notification.Notification;
import com.example.demo.notification.NotificationController;
import com.example.demo.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class NotificationControllerTest {

    @InjectMocks
    private NotificationController notificationController;

    @Mock
    private NotificationService notificationService;

    private AppUser user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new AppUser();
        user.setId(1L);
    }

    /* Testing that the controller creates a new notification, calls the service, and returns the correct response */
    @Test
    public void testCreateNotification() {
        Notification notification = new Notification("Test message", user, "typeInfo");
        when(notificationService.createNotification(any(String.class), any(AppUser.class), any(String.class))).thenReturn(notification);

        ResponseEntity<Notification> response = notificationController.createNotification(notification);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Test message", response.getBody().getMessage());
    }

    /* Testing that the controller retrieves the user's notifications and returns the correct list of notifications */
    @Test
    public void testGetUserNotifications() {
        Notification notification = new Notification("Test message", user, "typeInfo");
        when(notificationService.getUserNotifications(1L)).thenReturn(List.of(notification));
        List<Notification> notifications = notificationController.getUserNotifications(1L);

        assertEquals(1, notifications.size());
        assertEquals("Test message", notifications.get(0).getMessage());
    }

    /* Testing that the controller deletes a notification by calling the service and returning the correct response status */
    @Test
    public void testDeleteNotification() {
        ResponseEntity<Void> response = notificationController.deleteNotification(1L);

        verify(notificationService, times(1)).deleteNotification(1L);
        assertEquals(204, response.getStatusCodeValue());
    }
}

