import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsService } from './news.service';
import { NotificationService } from './notification.service';
import { NotificationIconComponent } from './notification-icon.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription } from 'rxjs';
import { NewsItem, UserActivity } from './community.model';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationIconComponent],
  templateUrl: './community.html',
  styleUrls: ['./community.css']
})
export class CommunityComponent implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  private notificationService = inject(NotificationService);
  
  // Signaux
  newsItems = this.newsService.getNewsItems();
  notifications = this.notificationService.getNotifications();
  unreadCount = this.notificationService.getUnreadCount();
  
  // Flux RxJS transformés en signaux avec toSignal
  newNewsSignal = toSignal(this.newsService.simulateNewNews(), { initialValue: null });
  userActivitySignal = toSignal(this.newsService.simulateUserActivity(), { initialValue: null });
  
  // État local
  selectedFilter = signal<string>('all');
  showActivityPanel = signal<boolean>(true);
  activities = signal<UserActivity[]>([]);
  
  private subscriptions: Subscription = new Subscription();
  
  // Actualités filtrées
  filteredNews = computed(() => {
    const news = this.newsItems();
    const filter = this.selectedFilter();
    
    if (filter === 'all') return news;
    return news.filter(item => item.type === filter);
  });
  
  // Catégories pour le filtre
  categories = [
    { value: 'all', label: 'Toute l\'actualité', icon: '📰' },
    { value: 'event', label: 'Événements', icon: '🎯' },
    { value: 'announcement', label: 'Annonces', icon: '📢' },
    { value: 'workout', label: 'Entraînements', icon: '💪' },
    { value: 'achievement', label: 'Réussites', icon: '🏆' }
  ];
  
  ngOnInit() {
    // Simuler l'arrivée de nouvelles actualités asynchrones
    this.subscriptions.add(
      this.newsService.simulateNewNews().subscribe(news => {
        if (news) {
          this.newsService.addNewsItem(news);
          // Ajouter une notification pour la nouvelle actualité
          this.notificationService.addNotification({
            id: Date.now(),
            title: '📰 Nouvelle actualité',
            message: news.title,
            type: 'info',
            date: new Date(),
            isRead: false,
            icon: '📢'
          });
        }
      })
    );
    
    // Simuler l'activité des membres
    this.subscriptions.add(
      this.newsService.simulateUserActivity().subscribe(activity => {
        if (activity) {
          this.activities.update(acts => [activity, ...acts].slice(0, 10));
        }
      })
    );
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
  likeNews(id: number) {
    this.newsService.likeNews(id);
  }
  
  formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Aujourd\'hui';
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return new Date(date).toLocaleDateString('fr-FR');
  }
  
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      event: '🎯',
      announcement: '📢',
      workout: '💪',
      achievement: '🏆'
    };
    return icons[type] || '📰';
  }
  
  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      event: 'bg-purple-100 text-purple-800',
      announcement: 'bg-blue-100 text-blue-800',
      workout: 'bg-green-100 text-green-800',
      achievement: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  }
  
  getActivityIcon(action: string): string {
    if (action.includes('terminé')) return '✅';
    if (action.includes('battu')) return '🏆';
    if (action.includes('rejoint')) return '🎯';
    if (action.includes('partagé')) return '💡';
    if (action.includes('atteint')) return '🎉';
    return '💪';
  }
}