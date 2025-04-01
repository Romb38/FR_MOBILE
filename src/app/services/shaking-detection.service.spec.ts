import { TestBed } from '@angular/core/testing';

import { ShakingDetectionService } from './shaking-detection.service';

describe('ShakingDetectionService', () => {
  let service: ShakingDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShakingDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
