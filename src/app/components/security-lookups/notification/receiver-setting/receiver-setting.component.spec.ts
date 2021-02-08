import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverSettingComponent } from './receiver-setting.component';

describe('ReceiverSettingComponent', () => {
  let component: ReceiverSettingComponent;
  let fixture: ComponentFixture<ReceiverSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReceiverSettingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
