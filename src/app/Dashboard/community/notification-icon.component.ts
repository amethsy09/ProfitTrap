import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from './notification.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-notification-icon',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative">
      <!-- Bouton de notification -->
      <button
        (click)="toggleDropdown()"
        class="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        
        @if (unreadCount() > 0) {
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {{ unreadCount() }}
          </span>
        }
      </button>

      <!-- Dropdown des notifications -->
      @if (isOpen()) {
        <div class="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-down">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex justify-between items-center">
            <h3 class="text-white font-semibold">Notifications</h3>
            <div class="flex gap-2">
              <button
                (click)="markAllAsRead()"
                class="text-xs text-white/80 hover:text-white transition">
                Tout marquer lu
              </button>
              <button
                (click)="clearAll()"
                class="text-xs text-white/80 hover:text-white transition">
                Effacer tout
              </button>
            </div>
          </div>
          
          <div class="max-h-96 overflow-y-auto">
            @if (notifications().length === 0) {
              <div class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <p>Aucune notification</p>
                <p class="text-sm">Revenez plus tard !</p>
              </div>
            } @else {
              @for (notif of notifications(); track notif.id) {
                <div 
                  class="p-4 border-b hover:bg-gray-50 transition cursor-pointer"
                  [class.bg-blue-50]="!notif.isRead"
                  (click)="markAsRead(notif.id)">
                  <div class="flex gap-3">
                    <div class="text-2xl">{{ notif.icon }}</div>
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <h4 class="font-semibold text-gray-800">{{ notif.title }}</h4>
                        <span class="text-xs text-gray-400">{{ formatDate(notif.date) }}</span>
                      </div>
                      <p class="text-sm text-gray-600 mt-1">{{ notif.message }}</p>
                      @if (notif.link) {
                        <a 
                          [routerLink]="notif.link"
                          class="text-xs text-blue-500 hover:text-blue-600 mt-1 inline-block"
                          (click)="$event.stopPropagation()">
                          Voir détails →
                        </a>
                      }
                    </div>
                    <button
                      (click)="$event.stopPropagation(); removeNotification(notif.id)"
                      class="text-gray-400 hover:text-red-500 transition">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-down {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-slide-down {
      animation: slide-down 0.2s ease-out;
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  `]
})
export class NotificationIconComponent {
  private notificationService = inject(NotificationService);
  
  isOpen = signal<boolean>(false);
  
  notifications = this.notificationService.getNotifications();
  unreadCount = this.notificationService.getUnreadCount();
  
  // Transformation des flux RxJS en signaux avec toSignal
  // Simule l'arrivée de nouvelles notifications asynchrones
  constructor() {
    // Convertir l'observable en signal
    const newNotificationSignal = toSignal(this.notificationService.systemNotifications$, {
      initialValue: null
    });
    
    // Écouter les nouvelles notifications et les ajouter
    this.notificationService.systemNotifications$.subscribe(notification => {
      if (notification) {
        this.notificationService.addNotification(notification);
        // Jouer un son ou afficher une notification browser
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, { body: notification.message });
        }
      }
    });
    
    // Demander la permission pour les notifications browser
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }
  
  toggleDropdown() {
    this.isOpen.update(v => !v);
  }
  
  markAsRead(id: number) {
    this.notificationService.markAsRead(id);
  }
  
  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }
  
  clearAll() {
    this.notificationService.clearAll();
  }
  
  removeNotification(id: number) {
    this.notificationService.removeNotification(id);
  }
  
  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 1) return 'à l\'instant';
    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours} h`;
    if (days === 1) return 'hier';
    return `il y a ${days} j`;
  }
}