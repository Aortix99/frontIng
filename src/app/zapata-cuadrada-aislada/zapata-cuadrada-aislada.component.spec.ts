import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapataCuadradaAisladaComponent } from './zapata-cuadrada-aislada.component';

describe('ZapataCuadradaAisladaComponent', () => {
  let component: ZapataCuadradaAisladaComponent;
  let fixture: ComponentFixture<ZapataCuadradaAisladaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZapataCuadradaAisladaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZapataCuadradaAisladaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
