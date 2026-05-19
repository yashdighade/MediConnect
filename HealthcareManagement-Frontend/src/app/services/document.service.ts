import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Document } from '../models/document';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient) { }

  public uploadDocument(file: File, uploadedBy: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', uploadedBy);
    return this.http.post<any>(`${API_URL}/uploadDocument`, formData);
  }

  public getDocuments(uploadedBy: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/documents/${uploadedBy}`);
  }

  public downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${API_URL}/downloadDocument/${id}`, { responseType: 'blob' });
  }

  public deleteDocument(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/deleteDocument/${id}`);
  }
}