import { computed, Injectable, signal } from '@angular/core';
import { Observable, interval, of, delay, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from './community.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([
    {
      id: 1,
      title: 'Bienvenue !',
      message: 'Bienvenue sur l\'espace communauté !',
      type: 'success',
      date: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      icon: '🎉'
    },
    {
      id: 2,
      title: 'Nouveau cours disponible',
      message: 'Un cours de Pilates a été ajouté à votre planning.',
      type: 'info',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      icon: '🧘',
      link: '/planning-reservation'
    }
  ]);

  private unreadCount = computed(() => {
    return this.notificationsSignal().filter(n => !n.isRead).length;
  });

  // Flux RxJS de notifications simulées
  private simulatedNotifications$: Observable<Notification> = interval(20000).pipe(
    map(() => {
      const notifications: Notification[] = [
        {
          id: Date.now(),
          title: '💪 Nouveau record !',
          message: 'Félicitations ! Vous avez battu votre record de pas cette semaine.',
          type: 'success',
          date: new Date(),
          isRead: false,
          icon: '🏆'
        },
        {
          id: Date.now() + 1,
          title: '📅 Rappel',
          message: 'Votre cours de Yoga commence dans 30 minutes.',
          type: 'warning',
          date: new Date(),
          isRead: false,
          icon: '⏰',
          link: '/planning-reservation'
        },
        {
          id: Date.now() + 2,
          title: '🎯 Défi communautaire',
          message: 'Un nouveau défi commence aujourd\'hui ! Rejoignez les autres membres.',
          type: 'info',
          date: new Date(),
          isRead: false,
          icon: '🎯'
        },
        {
          id: Date.now() + 3,
          title: '🏷️ Offre spéciale',
          message: '-20% sur tous les compléments ce week-end !',
          type: 'info',
          date: new Date(),
          isRead: false,
          icon: '🏷️',
          link: '/shop'
        }
      ];
      return notifications[Math.floor(Math.random() * notifications.length)];
    }),
    delay(1000)
  );

  // Flux combiné des notifications système
  systemNotifications$: Observable<Notification> = merge(
    this.simulatedNotifications$
  );

  getNotifications() {
    return this.notificationsSignal.asReadonly();
  }

  getUnreadCount() {
    return this.unreadCount;
  }

  addNotification(notification: Notification) {
    this.notificationsSignal.update(notifs => [notification, ...notifs]);
  }

  markAsRead(notificationId: number) {
    this.notificationsSignal.update(notifs =>
      notifs.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  }

  markAllAsRead() {
    this.notificationsSignal.update(notifs =>
      notifs.map(notif => ({ ...notif, isRead: true }))
    );
  }

  clearAll() {
    this.notificationsSignal.set([]);
  }

  removeNotification(notificationId: number) {
    this.notificationsSignal.update(notifs =>
      notifs.filter(notif => notif.id !== notificationId)
    );
  }
}