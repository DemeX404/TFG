import { TestBed } from '@angular/core/testing';

import { InfoCountriesService } from './info-countries.service';

describe('InfoCountriesService', () => {
  let service: InfoCountriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoCountriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
