import { firestore } from 'firebase';

export interface User {
  name?: string;
  cpf?: string;
  email?: string;
  phone?: string;
  uid?: string;
  isAdmin?: boolean;
  emailVerified?: boolean;
  createdAt?: firestore.Timestamp;
  lastUpdate?: firestore.Timestamp;
}