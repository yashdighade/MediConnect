import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feedback } from '../../models/feedback';
import { FeedbackService } from '../../services/feedback.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  feedback: Feedback = {
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  };

  successMessage = '';
  errorMessage = '';
  ratings = [5, 4, 3, 2, 1];
  maxChars = 500;
  charCount = 0;

  constructor(private feedbackService: FeedbackService) { }

  submitFeedback(form: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';

    if (!form.valid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.charCount > this.maxChars) {
      this.errorMessage = `Message exceeds ${this.maxChars} characters.`;
      return;
    }

    this.feedbackService.submitFeedback(this.feedback).subscribe(
      response => {
        this.successMessage = 'Thank you! Your feedback was submitted successfully.';
        this.feedback = {
          name: '',
          email: '',
          subject: '',
          message: '',
          rating: 5
        };
        this.charCount = 0;
        form.resetForm({ rating: 5 });
      },
      error => {
        this.errorMessage = 'Unable to submit feedback. Please try again later.';
      }
    );
  }

  updateCharCount() {
    this.charCount = this.feedback.message ? this.feedback.message.length : 0;
  }

  setRating(value: number) {
    this.feedback.rating = value;
  }
}
