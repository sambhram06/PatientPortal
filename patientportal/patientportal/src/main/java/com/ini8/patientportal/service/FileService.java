package com.ini8.patientportal.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.ini8.patientportal.entity.FileMetadata;

import java.util.List;

public interface FileService {

    FileMetadata uploadFile(MultipartFile file);

    List<FileMetadata> listFiles();

    Resource downloadFile(Long id);

    void deleteFile(Long id);
}
