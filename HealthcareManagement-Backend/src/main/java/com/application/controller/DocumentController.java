package com.application.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.application.model.Document;
import com.application.service.DocumentService;

@RestController
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/uploadDocument")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Document> uploadDocument(@RequestParam("file") MultipartFile file, @RequestParam("uploadedBy") String uploadedBy) {
        try {
            Document document = documentService.saveFile(file, uploadedBy);
            return new ResponseEntity<>(document, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/documents/{uploadedBy}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<List<Document>> getDocuments(@PathVariable String uploadedBy) {
        List<Document> documents = documentService.getDocumentsByUser(uploadedBy);
        return new ResponseEntity<>(documents, HttpStatus.OK);
    }

    @GetMapping("/downloadDocument/{id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<ByteArrayResource> downloadDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocument(id).orElse(null);
            if (document == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            byte[] data = documentService.getFileContent(document.getFilePath());
            ByteArrayResource resource = new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getFileName() + "\"")
                    .contentType(MediaType.parseMediaType(document.getFileType()))
                    .contentLength(data.length)
                    .body(resource);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}