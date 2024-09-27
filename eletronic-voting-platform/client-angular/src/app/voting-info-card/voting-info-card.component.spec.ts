import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingInfoCardComponent } from './voting-info-card.component';

describe('VotingInfoCardComponent', () => {
  let component: VotingInfoCardComponent;
  let fixture: ComponentFixture<VotingInfoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VotingInfoCardComponent]
    });
    fixture = TestBed.createComponent(VotingInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
