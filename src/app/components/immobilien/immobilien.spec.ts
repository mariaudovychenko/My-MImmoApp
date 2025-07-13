import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Immobilien } from './immobilien';

describe('Immobilien', () => {
  let component: Immobilien;
  let fixture: ComponentFixture<Immobilien>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Immobilien]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Immobilien);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
