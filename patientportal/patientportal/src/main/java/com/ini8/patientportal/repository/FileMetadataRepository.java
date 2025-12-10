package com.ini8.patientportal.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ini8.patientportal.entity.FileMetadata;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
}