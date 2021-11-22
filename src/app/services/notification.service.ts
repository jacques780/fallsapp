import { Injectable } from '@angular/core';
import { FirebaseX } from "@ionic-native/firebase-x/ngx";
import { Subject } from 'rxjs';
import { Notification } from '../interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notifications: Notification[] = [];
  notificationSubject: Subject<Notification> = new Subject<Notification>();
  constructor(
    private firebase: FirebaseX,
  ) {
    this.notificationSubject.subscribe((ntfc) => {
      this.notifications.push({
        id: this.notifications.length,
        title: ntfc.title,
        content: ntfc.content,
        checked: ntfc.checked
      });
    });
  }

  onAddNotification(ntfct: Notification): void {
    this.notificationSubject.next(ntfct);
  }

  onNotifications() {
    return this.firebase.onMessageReceived();
  }
}
