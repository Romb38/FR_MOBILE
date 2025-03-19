import { TestBed } from '@angular/core/testing';

import { TranslateConfigServiceService } from './translate-config-service.service';

describe('TranslateConfigServiceService', () => {
  let service: TranslateConfigServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslateConfigServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
