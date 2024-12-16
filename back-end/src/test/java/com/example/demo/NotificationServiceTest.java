// JUnit Testing For NotificationService

package com.example.demo;

import com.example.demo.appuser.AppUser;
import com.example.demo.appuser.AppUserRepository;
import com.example.demo.notification.Notification;
import com.example.demo.notification.NotificationRepository;
import com.example.demo.notification.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.ArrayList;

public class NotificationServiceTest {

    @InjectMocks
    private NotificationService notificationService;

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private JavaMailSender mailSender;

    private AppUser user;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        user = new AppUser();
        user.setId(1L);
        user.setEmail("test@example.com");
    }

    /* Testing that a notification of type "task" is created, an email is sent, and the correct notification is returned */
    @Test
    public void testCreateNotification_SendsEmail_WhenNotificationTypeIsTask() {
        String message = "New task assigned.";
        Notification notification = new Notification(message, user, "typeTask");
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification);
        Notification createdNotification = notificationService.createNotification(message, user, "typeTask");

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
        assertNotNull(createdNotification);
        assertEquals(message, createdNotification.getMessage());
    }

    /* Testing that the service retrieves the user's notifications and returns a list of notifications when found */
    @Test
    public void testGetUserNotifications_ReturnsListOfNotifications() {
        Notification notification1 = new Notification("Message 1", user, "typeInfo");
        Notification notification2 = new Notification("Message 2", user, "typeInfo");
        List<Notification> notifications = new ArrayList<>();
        notifications.add(notification1);
        notifications.add(notification2);

        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(notificationRepository.findByUser(user)).thenReturn(notifications);
        List<Notification> result = notificationService.getUserNotifications(1L);

        assertEquals(2, result.size());
    }

    /* Testing that the service deletes a notification by calling the repository to delete by ID */
    @Test
    public void testDeleteNotification() {
        notificationService.deleteNotification(1L);

        verify(notificationRepository, times(1)).deleteById(1L);
    }
}
