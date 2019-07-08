import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorListComponent } from './constructor-list.component';

describe('ConstructorListComponent', () => {
  let component: ConstructorListComponent;
  let fixture: ComponentFixture<ConstructorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
