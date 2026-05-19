package com.application.repository;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import com.application.model.Document;

public interface DocumentRepository extends CrudRepository<Document, Long> {
    List<Document> findByUploadedBy(String uploadedBy);
}