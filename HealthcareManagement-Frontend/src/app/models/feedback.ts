export interface Feedback {
  id?: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  submittedAt?: string;
}
