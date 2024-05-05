import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsTambahComponent } from './modals-tambah.component';

describe('ModalsTambahComponent', () => {
  let component: ModalsTambahComponent;
  let fixture: ComponentFixture<ModalsTambahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalsTambahComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalsTambahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
