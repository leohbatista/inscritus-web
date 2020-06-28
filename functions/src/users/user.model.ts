import { firestore } from 'firebase-admin';

export interface User {
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  uid?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  emailVerified?: boolean;
  createdAt?: firestore.Timestamp;
  lastUpdate?: firestore.Timestamp;
}

export interface UsersResult {
  page: number;
  pageSize: number;
  total: number;
  results: any[];
}