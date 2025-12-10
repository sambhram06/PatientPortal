package com.ini8.patientportal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ini8.patientportal.entity.FileMetadata;
import com.ini8.patientportal.service.FileService;

import jakarta.servlet.ServletContext;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private ServletContext servletContext;

    @PostMapping("/upload")
    public FileMetadata upload(@RequestParam("file") MultipartFile file) {
        return fileService.uploadFile(file);
    }

    @GetMapping
    public List<FileMetadata> list() {
        return fileService.listFiles();
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> download(@PathVariable Long id) throws IOException {
        Resource resource = fileService.downloadFile(id);

        // Dynamically detect content type
        String contentType = servletContext.getMimeType(resource.getFile().getAbsolutePath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        fileService.deleteFile(id);
        return "File deleted successfully";
    }
}
