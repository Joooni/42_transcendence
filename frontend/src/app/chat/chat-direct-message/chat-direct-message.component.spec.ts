import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatDirectMessageComponent } from './chat-direct-message.component';

describe('ChatDirectMessageComponent', () => {
  let component: ChatDirectMessageComponent;
  let fixture: ComponentFixture<ChatDirectMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatDirectMessageComponent]
    });
    fixture = TestBed.createComponent(ChatDirectMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
