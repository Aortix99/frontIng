import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapataExcentricaVigaAmarreComponent } from './zapata-excentrica-viga-amarre.component';

describe('ZapataExcentricaVigaAmarreComponent', () => {
  let component: ZapataExcentricaVigaAmarreComponent;
  let fixture: ComponentFixture<ZapataExcentricaVigaAmarreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZapataExcentricaVigaAmarreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZapataExcentricaVigaAmarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
