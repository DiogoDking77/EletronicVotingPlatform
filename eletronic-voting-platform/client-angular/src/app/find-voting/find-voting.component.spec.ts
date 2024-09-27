import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindVotingComponent } from './find-voting.component';

describe('FindVotingComponent', () => {
  let component: FindVotingComponent;
  let fixture: ComponentFixture<FindVotingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindVotingComponent]
    });
    fixture = TestBed.createComponent(FindVotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
