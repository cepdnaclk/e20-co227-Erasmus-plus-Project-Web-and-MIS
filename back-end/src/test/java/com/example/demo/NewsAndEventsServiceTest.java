// JUnit Testing For NewsAndEventsService

package com.example.demo;

import com.example.demo.news.NewsAndEvents;
import com.example.demo.news.NewsAndEventsRepository;
import com.example.demo.news.NewsAndEventsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NewsAndEventsServiceTest {

    @Mock
    private NewsAndEventsRepository newsAndEventsRepository;

    @InjectMocks
    private NewsAndEventsService newsAndEventsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    /* Unit tests */

    /*
        Test to ensure that the getAllNewsAndEvents method in
        the NewsAndEventsService correctly interacts with the
        NewsAndEventsRepository to fetch all news and events
    */
    @Test
    void testGetAllNewsAndEvents() {
        when(newsAndEventsRepository.findAllOrderByNewsIDDesc()).thenReturn(Collections.emptyList());
        assertTrue(newsAndEventsService.getAllNewsAndEvents().isEmpty());
        verify(newsAndEventsRepository, times(1)).findAllOrderByNewsIDDesc();
    }

    /*
        Test to check whether the getNewsAndEventById method in the NewsAndEventsService correctly
        retrieves a news and event entry by its ID and interacts with the
        NewsAndEventsRepository as expected
    */
    @Test
    void testGetNewsAndEventById() {
        Long newsId = 1L;
        NewsAndEvents newsAndEvents = new NewsAndEvents("Title", "Description", "Url", "Author", "Date", null);
        when(newsAndEventsRepository.findById(newsId)).thenReturn(Optional.of(newsAndEvents));

        Optional<NewsAndEvents> foundNews = newsAndEventsService.getNewsAndEventById(newsId);
        assertTrue(foundNews.isPresent());
        assertEquals("Title", foundNews.get().getNewsTitle());
        verify(newsAndEventsRepository, times(1)).findById(newsId);
    }

}
