import { firestore } from "firebase-admin";

export interface Post {
  id?: string;
  title?: string;
  message?: string;
  postedAt?: firestore.Timestamp;
  lastUpdate?: firestore.Timestamp;
  publisher?: {
    uid?: string;
    email?: string;
  }
}
