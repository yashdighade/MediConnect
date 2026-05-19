package com.application.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.application.model.Feedback;
import com.application.service.FeedbackService;

@RestController
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/feedback")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Feedback> submitFeedback(@RequestBody Feedback feedback) {
        Feedback saved = feedbackService.saveFeedback(feedback);
        return new ResponseEntity<Feedback>(saved, HttpStatus.OK);
    }

    @GetMapping("/feedbacks")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<List<Feedback>> getFeedbacks() {
        List<Feedback> feedbackList = feedbackService.getAllFeedback();
        return new ResponseEntity<List<Feedback>>(feedbackList, HttpStatus.OK);
    }
}
