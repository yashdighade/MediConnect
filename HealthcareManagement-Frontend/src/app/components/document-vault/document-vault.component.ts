import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/document';
import { DocumentService } from '../../services/document.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-document-vault',
  templateUrl: './document-vault.component.html',
  styleUrls: ['./document-vault.component.css']
})
export class DocumentVaultComponent implements OnInit {

  documents: Document[] = [];
  selectedFile: File | null = null;
  successMessage = '';
  errorMessage = '';
  currentUserEmail = '';
  loading = false;

  constructor(private documentService: DocumentService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.currentUserEmail = sessionStorage.getItem('USER') || '';
    this.loadDocuments();
  }

  onFileSelected(event: any): void {
    this.errorMessage = '';
    const file = event.target.files && event.target.files[0];
    this.selectedFile = file || null;
  }

  uploadDocument(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload.';
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(this.selectedFile.type)) {
      this.errorMessage = 'Invalid file type. Only PDF and images (JPG, PNG) are allowed.';
      return;
    }

    // Validate file size (10MB)
    if (this.selectedFile.size > 10 * 1024 * 1024) {
      this.errorMessage = 'File size exceeds 10MB limit.';
      return;
    }

    this.loading = true;
    this.documentService.uploadDocument(this.selectedFile, this.currentUserEmail).subscribe(
      response => {
        this.successMessage = 'Document uploaded successfully!';
        this.errorMessage = '';
        this.selectedFile = null;
        this.loading = false;
        this.loadDocuments();
      },
      error => {
        this.errorMessage = 'Failed to upload document. Please try again.';
        this.successMessage = '';
        this.loading = false;
      }
    );
  }

  loadDocuments(): void {
    this.documentService.getDocuments(this.currentUserEmail).subscribe(
      response => {
        this.documents = response || [];
      },
      error => {
        this.errorMessage = 'Failed to load documents.';
      }
    );
  }

  downloadDocument(document: Document): void {
    this.errorMessage = '';
    this.documentService.downloadDocument(document.id!).subscribe(
      blob => {
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        this.errorMessage = 'Failed to download document.';
      }
    );
  }

  deleteDocument(document: Document): void {
    this.errorMessage = '';
    // Confirm with user
    if (!confirm(`Delete "${document.fileName}"? This action cannot be undone.`)) {
      return;
    }
    if (!document.id) {
      this.errorMessage = 'Unable to delete: missing document id.';
      return;
    }

    this.documentService.deleteDocument(document.id).subscribe(
      () => {
        this.successMessage = 'Document deleted successfully.';
        this.loadDocuments();
      },
      error => {
        // If backend doesn't support delete, show helpful message
        this.errorMessage = 'Unable to delete document. Backend may not support deletions.';
      }
    );
  }

  getDocumentIcon(fileType: string): string {
    if (fileType.includes('pdf')) return 'icon-pdf';
    if (fileType.includes('image')) return 'icon-image';
    return 'icon-file';
  }

  getIconClass(fileType: string): string {
    if (fileType.includes('pdf')) return 'fa fa-file-pdf-o';
    if (fileType.includes('jpeg') || fileType.includes('png') || fileType.includes('jpg')) return 'fa fa-file-image-o';
    return 'fa fa-file-o';
  }
}