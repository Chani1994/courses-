import { TestBed } from '@angular/core/testing';

import { LearningMethodService } from './learning-method.service';

describe('LearningMethodService', () => {
  let service: LearningMethodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningMethodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
