import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreResultComponent } from './store-result.component';

describe('StoreResultComponent', () => {
  let component: StoreResultComponent;
  let fixture: ComponentFixture<StoreResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
