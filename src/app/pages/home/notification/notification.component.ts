import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SharedService, NotificationService } from '../../../services';
import { Notification } from '../../../interface';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  constructor(public sharedService: SharedService,
    private ntfcService: NotificationService,
    private cdref: ChangeDetectorRef) { }

  ngOnInit() {
    this.onReceivedNotificationRealTime();
  }

  onReceivedNotificationRealTime(): void {
    if (this.ntfcService.notifications.length > 0) {
      this.notifications = this.ntfcService.notifications;
    }
    this.ntfcService.notificationSubject.subscribe(() => {
      this.notifications = this.ntfcService.notifications;
      this.cdref.detectChanges();
    });
  }

  onClickNotification(id: number): void {
    if (this.notifications.length > 0) {
      this.notifications[id].checked = true;
      this.cdref.detectChanges();
    }
  }

  onMarkAllAsRead(): void {
    this.notifications = this.notifications.map(ele => {
      ele.checked = true;
      return ele;
    });
  }

  get totalNotification(): number {
    return this.notifications.reduce((sum, ele) => sum += (!ele.checked ? 1 : 0), 0);
  }
}
