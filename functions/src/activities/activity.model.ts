export interface Activity {
  aid?: string;
  description?: string;
  endDate?: string;
  endTime?: string;
  location?: string;
  maxCapacity?: number;
  name?: string;
  preRegistration?: boolean;
  registrationDate?: string;
  registrationTime?: string;
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
