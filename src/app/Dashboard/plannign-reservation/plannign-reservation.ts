import { Component, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Cours {
  id: number;
  nom: string;
  capacite: number;
  reserves: number;
  description?: string;
  horaire?: string;
  duree?: number;
  niveau?: 'débutant' | 'intermédiaire' | 'avancé';
  coach?: string;
  image?: string;
}

interface Reservation {
  id: number;
  coursId: number;
  nomMembre: string;
  date: Date;
  statut: 'confirmée' | 'annulée';
}

@Component({
  selector: 'app-planning-reservation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plannign-reservation.html',
  styleUrls: ['./plannign-reservation.css']
})
export class PlanningReservation {

  // Signaux principaux
  cours = signal<Cours[]>([
    { 
      id: 1, 
      nom: 'Yoga', 
      capacite: 10, 
      reserves: 3,
      description: 'Séance de yoga pour détendre le corps et l\'esprit',
      horaire: 'Lundi 09:00 - 10:30',
      duree: 90,
      niveau: 'débutant',
      coach: 'Sophie Martin',
      image: '🧘‍♀️'
    },
    { 
      id: 2, 
      nom: 'Zumba', 
      capacite: 8, 
      reserves: 5,
      description: 'Danse fitness dynamique et énergique',
      horaire: 'Mercredi 18:00 - 19:00',
      duree: 60,
      niveau: 'intermédiaire',
      coach: 'Carlos Rodriguez',
      image: '💃'
    },
    { 
      id: 3, 
      nom: 'Pilates', 
      capacite: 5, 
      reserves: 4,
      description: 'Renforcement musculaire en douceur',
      horaire: 'Vendredi 10:00 - 11:15',
      duree: 75,
      niveau: 'débutant',
      coach: 'Julie Dubois',
      image: '🧘‍♂️'
    },
    { 
      id: 4, 
      nom: 'Musculation', 
      capacite: 12, 
      reserves: 8,
      description: 'Entraînement complet en salle de musculation',
      horaire: 'Mardi 17:00 - 18:30',
      duree: 90,
      niveau: 'avancé',
      coach: 'Marc Laurent',
      image: '💪'
    },
    { 
      id: 5, 
      nom: 'CrossFit', 
      capacite: 6, 
      reserves: 6,
      description: 'Entraînement intensif fonctionnel',
      horaire: 'Jeudi 19:00 - 20:00',
      duree: 60,
      niveau: 'avancé',
      coach: 'Thomas Bernard',
      image: '🏋️'
    }
  ]);

  // Liste des réservations
  reservations = signal<Reservation[]>([
    { id: 1, coursId: 1, nomMembre: 'Jean Dupont', date: new Date(), statut: 'confirmée' }
  ]);

  // Filtres et recherche
  searchText = signal<string>('');
  selectedNiveau = signal<string>('tous');
  showModal = signal<boolean>(false);
  selectedCours = signal<Cours | null>(null);
  membreNom = signal<string>('');
  
  // Notification
  notification = signal<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  constructor() {
    // Effect pour logger les changements
    effect(() => {
      console.log('📊 Planning mis à jour:', {
        totalCours: this.cours().length,
        placesDisponibles: this.totalPlacesDisponibles(),
        prochainCours: this.prochainsCours()[0]?.nom
      });
    });
  }

  // Stats calculées
  totalPlacesDisponibles = computed(() => {
    return this.cours().reduce((total, cours) => total + (cours.capacite - cours.reserves), 0);
  });

  totalReservations = computed(() => {
    return this.cours().reduce((total, cours) => total + cours.reserves, 0);
  });

  tauxOccupation = computed(() => {
    const totalCapacite = this.cours().reduce((total, cours) => total + cours.capacite, 0);
    const totalReserves = this.totalReservations();
    return totalCapacite > 0 ? Math.round((totalReserves / totalCapacite) * 100) : 0;
  });

  // Cours avec statut et pourcentage
  coursAvecStatut = computed(() => {
    let filtered = this.cours();
    
    // Filtre recherche
    const search = this.searchText().toLowerCase();
    if (search) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search) ||
        c.coach?.toLowerCase().includes(search)
      );
    }
    
    // Filtre niveau
    if (this.selectedNiveau() !== 'tous') {
      filtered = filtered.filter(c => c.niveau === this.selectedNiveau());
    }
    
    return filtered.map(c => ({
      ...c,
      complet: c.reserves >= c.capacite,
      pourcentage: (c.reserves / c.capacite) * 100,
      placesRestantes: c.capacite - c.reserves
    }));
  });

  // Prochains cours
  prochainsCours = computed(() => {
    return this.coursAvecStatut()
      .filter(c => !c.complet)
      .sort((a, b) => (a.horaire || '').localeCompare(b.horaire || ''))
      .slice(0, 3);
  });

  // Cours les plus populaires
  coursPopulaires = computed(() => {
    return this.coursAvecStatut()
      .sort((a, b) => b.pourcentage - a.pourcentage)
      .slice(0, 3);
  });

  // Couleur de la barre de progression
  getBarreColor(pourcentage: number): string {
    if (pourcentage >= 90) return 'bg-red-500';
    if (pourcentage >= 70) return 'bg-orange-500';
    if (pourcentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  }

  // Niveau badge color
  getNiveauColor(niveau?: string): string {
    const colors = {
      débutant: 'bg-green-100 text-green-800',
      intermédiaire: 'bg-yellow-100 text-yellow-800',
      avancé: 'bg-red-100 text-red-800'
    };
    return niveau ? colors[niveau as keyof typeof colors] : 'bg-gray-100 text-gray-800';
  }

  // Réserver une place
  reserver(coursId: number) {
    const cours = this.cours().find(c => c.id === coursId);
    
    if (!cours) return;
    
    if (cours.reserves >= cours.capacite) {
      this.showNotification('Désolé, ce cours est complet !', 'error');
      return;
    }
    
    // Ouvrir modal pour saisir le nom
    this.selectedCours.set(cours);
    this.membreNom.set('');
    this.showModal.set(true);
  }

  // Confirmer la réservation
  confirmerReservation() {
    if (!this.membreNom() || this.membreNom().trim().length < 2) {
      this.showNotification('Veuillez entrer un nom valide', 'error');
      return;
    }
    
    const cours = this.selectedCours();
    if (!cours) return;
    
    // Mettre à jour les réservations
    this.cours.update(list =>
      list.map(c =>
        c.id === cours.id && c.reserves < c.capacite
          ? { ...c, reserves: c.reserves + 1 }
          : c
      )
    );
    
    // Ajouter à l'historique des réservations
    const newReservation: Reservation = {
      id: Date.now(),
      coursId: cours.id,
      nomMembre: this.membreNom(),
      date: new Date(),
      statut: 'confirmée'
    };
    this.reservations.update(list => [...list, newReservation]);
    
    this.showNotification(
      `Réservation confirmée pour ${cours.nom} !`,
      'success'
    );
    
    this.showModal.set(false);
    this.selectedCours.set(null);
    this.membreNom.set('');
  }

  // Annuler une réservation (fonctionnalité supplémentaire)
  annulerReservation(reservationId: number, coursId: number) {
    if (confirm('Annuler cette réservation ?')) {
      this.reservations.update(list => list.filter(r => r.id !== reservationId));
      this.cours.update(list =>
        list.map(c =>
          c.id === coursId && c.reserves > 0
            ? { ...c, reserves: c.reserves - 1 }
            : c
        )
      );
      this.showNotification('Réservation annulée avec succès', 'info');
    }
  }

  // Obtenir les réservations d'un cours
  getReservationsByCours(coursId: number) {
    return this.reservations().filter(r => r.coursId === coursId);
  }

  // Get badge color for complet status
  getStatusBadge(complet: boolean, placesRestantes: number): { text: string; color: string } {
    if (complet) {
      return { text: 'Complet', color: 'bg-red-500' };
    }
    if (placesRestantes <= 2) {
      return { text: `Plus que ${placesRestantes} place(s) !`, color: 'bg-orange-500 animate-pulse' };
    }
    return { text: `${placesRestantes} places disponibles`, color: 'bg-green-500' };
  }

  // Show notification
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({ show: true, message, type });
    setTimeout(() => {
      this.notification.set({ show: false, message: '', type: 'success' });
    }, 3000);
  }

  // Reset filters
  resetFilters() {
    this.searchText.set('');
    this.selectedNiveau.set('tous');
  }

  // Export planning
  exportPlanning() {
    const planning = this.coursAvecStatut().map(c => ({
      Nom: c.nom,
      Horaire: c.horaire,
      Coach: c.coach,
      Niveau: c.niveau,
      'Places totales': c.capacite,
      Réservations: c.reserves,
      Statut: c.complet ? 'Complet' : 'Disponible'
    }));
    
    const csvContent = [
      Object.keys(planning[0]).join(','),
      ...planning.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `planning_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showNotification('Planning exporté avec succès !', 'success');
  }
}