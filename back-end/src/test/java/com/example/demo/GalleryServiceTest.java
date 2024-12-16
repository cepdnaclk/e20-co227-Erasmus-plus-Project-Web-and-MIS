// JUnit Testing For GalleryService

package com.example.demo;

import com.example.demo.gallery.Gallery;
import com.example.demo.gallery.GalleryRepository;
import com.example.demo.gallery.GalleryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GalleryServiceTest {

    @Mock
    private GalleryRepository galleryRepository;

    @InjectMocks
    private GalleryService galleryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Testing that the service correctly retrieves a gallery by its ID and checks the album name
    @Test
    void testGetGalleryById() {
        Gallery gallery = new Gallery("Test Album", "Test Creator", null, "http://test.com");
        when(galleryRepository.findById(1L)).thenReturn(Optional.of(gallery));

        assertTrue(galleryService.getGalleryById(1L).isPresent());
        assertEquals("Test Album", galleryService.getGalleryById(1L).get().getAlbumName());
    }

    // Testing that the service correctly deletes a gallery by its ID if it exists in the repository
    @Test
    void testDeleteGallery() {
        when(galleryRepository.existsById(1L)).thenReturn(true);
        doNothing().when(galleryRepository).deleteById(1L);

        galleryService.deleteGallery(1L);

        verify(galleryRepository, times(1)).deleteById(1L);
    }
}