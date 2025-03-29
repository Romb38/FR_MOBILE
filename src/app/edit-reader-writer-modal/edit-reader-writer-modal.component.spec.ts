import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditReaderWriterModalComponent } from './edit-reader-writer-modal.component';

describe('EditReaderWriterModalComponent', () => {
  let component: EditReaderWriterModalComponent;
  let fixture: ComponentFixture<EditReaderWriterModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EditReaderWriterModalComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditReaderWriterModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
