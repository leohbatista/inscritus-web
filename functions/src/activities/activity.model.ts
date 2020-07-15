import { firestore } from "firebase-admin";

export interface Activity {
  id?: string;
  description?: string;
  endDate?: string;
  endTime?: string;
  lastUpdate: firestore.Timestamp;
  location?: string;
  maxCapacity?: number;
  name?: string;
  preRegistration?: boolean;
  registrationDate?: string;
  registrationTime?: string;
  speakers?: string[];
  startDate?: string;
  startTime?: string;
  type?: string;
  visible?: boolean;
}

export interface ActivityType {
  description?: string;
  id?: string;
  name?: string;
}

export interface ActivitiesResult {
  page: number;
  pageSize: number;
  total: number;
  results: any[];
}
