import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontaktDetail } from './kontakt-detail';

describe('KontaktDetail', () => {
  let component: KontaktDetail;
  let fixture: ComponentFixture<KontaktDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KontaktDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KontaktDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
