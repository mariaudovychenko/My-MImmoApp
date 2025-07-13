import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Beziehungen } from './beziehungen';

describe('Beziehungen', () => {
  let component: Beziehungen;
  let fixture: ComponentFixture<Beziehungen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Beziehungen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Beziehungen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
