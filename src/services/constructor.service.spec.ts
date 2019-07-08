import { TestBed } from '@angular/core/testing';

import { ConstructorService } from './constructor.service';

describe('ConstructorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstructorService = TestBed.get(ConstructorService);
    expect(service).toBeTruthy();
  });
});
