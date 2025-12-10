package com.ini8.patientportal.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.jpa.repository.JpaRepository;


import com.ini8.patientportal.config.FileStorageProperties;
import com.ini8.patientportal.entity.FileMetadata;
import com.ini8.patientportal.exception.FileNotFoundException;
import com.ini8.patientportal.exception.InvalidFileException;
import com.ini8.patientportal.repository.FileMetadataRepository;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FileServiceImpl implements FileService {

    private final Path fileStoragePath;
    private final FileMetadataRepository repository;

    @Autowired
    public FileServiceImpl(FileStorageProperties properties,
                           FileMetadataRepository repository) throws IOException {
        this.repository = repository;
        fileStoragePath = Paths.get(properties.getStorageLocation()).toAbsolutePath().normalize();

        Files.createDirectories(fileStoragePath);
    }

    @Override
    public FileMetadata uploadFile(MultipartFile file) {
        // Validate PDF only
        if (!file.getOriginalFilename().endsWith(".pdf")) {
            throw new InvalidFileException("Only PDF files are allowed.");
        }

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStoragePath.resolve(fileName);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            FileMetadata meta = new FileMetadata();
            meta.setFileName(fileName);
            meta.setOriginalName(file.getOriginalFilename());
            meta.setFileSize(file.getSize());
            meta.setUploadDate(LocalDateTime.now());

            return repository.save(meta);

        } catch (IOException ex) {
            throw new InvalidFileException("File upload failed: " + ex.getMessage());
        }
    }

    @Override
    public List<FileMetadata> listFiles() {
        return repository.findAll();
    }

    @Override
    public Resource downloadFile(Long id) {
        FileMetadata meta = repository.findById(id)
                .orElseThrow(() -> new FileNotFoundException("File not found"));

        Path filePath = fileStoragePath.resolve(meta.getFileName()).normalize();

        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found on disk");
        }

        return new FileSystemResource(filePath);
    }

    @Override
    public void deleteFile(Long id) {
        FileMetadata meta = repository.findById(id)
                .orElseThrow(() -> new FileNotFoundException("File not found"));

        Path filePath = fileStoragePath.resolve(meta.getFileName());

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + e.getMessage());
        }

        repository.deleteById(id);
    }
}
