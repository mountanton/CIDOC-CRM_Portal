/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MostFrequentService } from './most-frequent.service';

describe('Service: MostFrequent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MostFrequentService]
    });
  });

  it('should ...', inject([MostFrequentService], (service: MostFrequentService) => {
    expect(service).toBeTruthy();
  }));
});
