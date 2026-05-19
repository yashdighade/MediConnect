package com.application.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.application.model.Document;
import com.application.repository.DocumentRepository;

@Service
public class DocumentService {

    private final Path root = Paths.get("uploads");

    @Autowired
    private DocumentRepository documentRepository;

    public DocumentService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public Document saveFile(MultipartFile file, String uploadedBy) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only PDF and images are allowed.");
        }

        // Validate file size (e.g., max 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit.");
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = this.root.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        Document document = new Document();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(contentType);
        document.setFileSize(file.getSize());
        document.setFilePath(filePath.toString());
        document.setUploadedBy(uploadedBy);
        document.setUploadedAt(LocalDateTime.now().toString());

        return documentRepository.save(document);
    }

    public Optional<Document> getDocument(Long id) {
        return documentRepository.findById(id);
    }

    public List<Document> getDocumentsByUser(String uploadedBy) {
        return documentRepository.findByUploadedBy(uploadedBy);
    }

    public byte[] getFileContent(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        return Files.readAllBytes(path);
    }

    private boolean isValidFileType(String contentType) {
        return contentType.equals("application/pdf") ||
               contentType.startsWith("image/");
    }
}