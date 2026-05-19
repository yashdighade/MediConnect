import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feedback } from '../models/feedback';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  public submitFeedback(feedback: Feedback): Observable<any> {
    return this.http.post<any>(`${API_URL}/feedback`, feedback);
  }

  public getFeedbacks(): Observable<any> {
    return this.http.get<any>(`${API_URL}/feedbacks`);
  }
}
