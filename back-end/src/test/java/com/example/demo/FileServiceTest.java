// JUnit Testing For FileService

package com.example.demo;

import com.example.demo.download.FileEntity;
import com.example.demo.download.FileRepository;
import com.example.demo.download.FileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class FileServiceTest {

    @Mock
    private FileRepository fileRepository;

    @InjectMocks
    private FileService fileService;

    private FileEntity fileEntity;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        fileEntity = new FileEntity("test.txt", "text/plain", "Hello World".getBytes(), "Test File", true);
        fileEntity.setFileId(1L);
    }

    // Testing that the service method correctly fetches all files from the repository
    @Test
    void testGetAllFiles() {
        when(fileRepository.findAll()).thenReturn(Arrays.asList(fileEntity));

        List<FileEntity> files = fileService.getAllFiles();

        assertNotNull(files);
        assertEquals(1, files.size());
        assertEquals("test.txt", files.get(0).getFileName());
        verify(fileRepository, times(1)).findAll();
    }

    // Testing that the service method retrieves a file by its ID from the repository
    @Test
    void testGetFileById() {
        when(fileRepository.findById(1L)).thenReturn(Optional.of(fileEntity));


        Optional<FileEntity> foundFile = fileService.getFileById(1L);

        assertTrue(foundFile.isPresent());
        assertEquals("test.txt", foundFile.get().getFileName());
        verify(fileRepository, times(1)).findById(1L);
    }

    // Testing that the service method correctly deletes a file by its ID from the repository
    @Test
    void testDeleteFile() {
        fileService.deleteFile(1L);

        verify(fileRepository, times(1)).deleteById(1L);
    }

    // Test with a save failure and checks that if the service properly handles the exception
    @Test
    void testSaveFileException() {
        when(fileRepository.save(any(FileEntity.class))).thenThrow(new RuntimeException("Save failed"));

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            fileService.saveFile(fileEntity);
        });
        assertEquals("Failed to save file", thrown.getMessage());
    }

    // Test with a delete failure and ensures that if the service handles the exception correctly
    @Test
    void testDeleteFileException() {
        doThrow(new RuntimeException("Delete failed")).when(fileRepository).deleteById(1L);

        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            fileService.deleteFile(1L);
        });
        assertEquals("Failed to delete file", thrown.getMessage());
    }
}
