import { Injectable, signal } from '@angular/core';
import { Observable, interval, map, of, delay } from 'rxjs';
import { NewsItem, UserActivity } from './community.model';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private newsItems = signal<NewsItem[]>([
    {
      id: 1,
      title: '🏆 Défi du mois : Relevez le challenge !',
      content: 'Ce mois-ci, nous lançons un défi "100km en 30 jours". Inscrivez-vous à l\'accueil pour participer et gagnez des lots exclusifs !',
      author: 'Coach Marc',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marc',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      likes: 45,
      comments: 12,
      image: '🏃',
      type: 'event',
      isLiked: false
    },
    {
      id: 2,
      title: '💪 Nouveau cours de HIIT disponible',
      content: 'Nous ajoutons 3 nouveaux créneaux de HIIT le mardi et jeudi soir. Premier cours offert !',
      author: 'Sophie Martin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      likes: 89,
      comments: 23,
      image: '💪',
      type: 'announcement',
      isLiked: false
    },
    {
      id: 3,
      title: '🎉 Félicitations à Thomas !',
      content: 'Thomas a atteint son objectif de perte de poids : -15kg en 3 mois ! Un exemple pour toute la communauté.',
      author: 'La communauté',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      likes: 234,
      comments: 56,
      image: '🎉',
      type: 'achievement',
      isLiked: false
    },
    {
      id: 4,
      title: '📢 Fermeture exceptionnelle',
      content: 'La salle sera fermée le 14 juillet pour cause de jour férié. Profitez-en pour vous reposer !',
      author: 'Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      likes: 12,
      comments: 5,
      image: '📢',
      type: 'announcement',
      isLiked: false
    },
    {
      id: 5,
      title: '💡 Astuce de la semaine',
      content: 'Pensez à bien vous hydrater avant, pendant et après votre séance. L\'eau est essentielle pour vos performances !',
      author: 'Nutritionniste',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
      date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      likes: 67,
      comments: 8,
      image: '💧',
      type: 'workout',
      isLiked: false
    }
  ]);

  // Simuler l'arrivée de nouvelles actualités (RxJS Observable)
  simulateNewNews(): Observable<NewsItem> {
    const newNews: NewsItem[] = [
      {
        id: Date.now(),
        title: '🎯 Nouveau record !',
        content: 'La salle bat son record de fréquentation avec 250 membres aujourd\'hui ! Continuez comme ça 💪',
        author: 'La Direction',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Direction',
        date: new Date(),
        likes: 0,
        comments: 0,
        image: '🎯',
        type: 'announcement',
        isLiked: false
      },
      {
        id: Date.now() + 1,
        title: '🏅 Challenge terminé !',
        content: 'Félicitations à tous les participants du challenge "Squat challenge" !',
        author: 'Coach Team',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coach',
        date: new Date(),
        likes: 0,
        comments: 0,
        image: '🏅',
        type: 'event',
        isLiked: false
      },
      {
        id: Date.now() + 2,
        title: '🎂 Joyeux anniversaire à Julie !',
        content: 'Toute l\'équipe te souhaite un merveilleux anniversaire !',
        author: 'L\'équipe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
        date: new Date(),
        likes: 0,
        comments: 0,
        image: '🎂',
        type: 'achievement',
        isLiked: false
      }
    ];
    
    const randomNews = newNews[Math.floor(Math.random() * newNews.length)];
    return of(randomNews).pipe(delay(Math.random() * 10000 + 5000)); // Arrive entre 5 et 15 secondes
  }

  // Simuler l'activité des membres (RxJS Observable)
  simulateUserActivity(): Observable<UserActivity> {
    const activities: UserActivity[] = [
      { id: Date.now(), userName: 'Jean', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean', action: 'a terminé', target: 'un cours de Yoga', timestamp: new Date() },
      { id: Date.now() + 1, userName: 'Marie', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie', action: 'a battu son record', target: 'de cardio', timestamp: new Date() },
      { id: Date.now() + 2, userName: 'Pierre', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre', action: 'a rejoint', target: 'le challenge du mois', timestamp: new Date() },
      { id: Date.now() + 3, userName: 'Sophie', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', action: 'a partagé', target: 'une nouvelle recette healthy', timestamp: new Date() },
      { id: Date.now() + 4, userName: 'Lucas', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', action: 'a atteint', target: '100 séances !', timestamp: new Date() }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    return of(randomActivity).pipe(delay(Math.random() * 15000 + 10000)); // Arrive entre 10 et 25 secondes
  }

  getNewsItems() {
    return this.newsItems.asReadonly();
  }

  addNewsItem(news: NewsItem) {
    this.newsItems.update(items => [news, ...items]);
  }

  likeNews(itemId: number) {
    this.newsItems.update(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, likes: item.likes + 1, isLiked: true }
          : item
      )
    );
  }
}