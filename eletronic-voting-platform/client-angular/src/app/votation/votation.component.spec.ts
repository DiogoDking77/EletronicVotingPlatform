import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotationComponent } from './votation.component';

describe('VotationComponent', () => {
  let component: VotationComponent;
  let fixture: ComponentFixture<VotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotationComponent]
    });
    fixture = TestBed.createComponent(VotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
