import { TestBed } from '@angular/core/testing';

import { AdminActivitiesService } from './admin-activities.service';

describe('AdminActivitiesService', () => {
  let service: AdminActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
