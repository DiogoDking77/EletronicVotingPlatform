import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVotingComponent } from './new-voting.component';

describe('NewVotingComponent', () => {
  let component: NewVotingComponent;
  let fixture: ComponentFixture<NewVotingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewVotingComponent]
    });
    fixture = TestBed.createComponent(NewVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
