import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdvancedVotingComponent } from './new-advanced-voting.component';

describe('NewAdvancedVotingComponent', () => {
  let component: NewAdvancedVotingComponent;
  let fixture: ComponentFixture<NewAdvancedVotingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewAdvancedVotingComponent]
    });
    fixture = TestBed.createComponent(NewAdvancedVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
