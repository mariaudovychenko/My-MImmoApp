import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kontakte } from './kontakte';

describe('Kontakte', () => {
  let component: Kontakte;
  let fixture: ComponentFixture<Kontakte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kontakte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kontakte);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
