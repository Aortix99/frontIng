import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapataAisladaComponent } from './zapata-aislada.component';

describe('ZapataAisladaComponent', () => {
  let component: ZapataAisladaComponent;
  let fixture: ComponentFixture<ZapataAisladaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZapataAisladaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZapataAisladaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
