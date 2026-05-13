import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cours {
  id: number;
  nom: string;
  capacite: number;
  reserves: number;
}

@Component({
  selector: 'app-plannign-reservation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plannign-reservation.html',
  styleUrl: './plannign-reservation.css',
})
export class PlannignReservation {

  // 📌 SIGNAL PRINCIPAL
  cours = signal<Cours[]>([
    { id: 1, nom: 'Yoga', capacite: 10, reserves: 0 },
    { id: 2, nom: 'Zumba', capacite: 8, reserves: 0 },
    { id: 3, nom: 'Pilates', capacite: 5, reserves: 0 },
  ]);

  // 📌 Réserver une place
  reserver(id: number) {
    this.cours.update(list =>
      list.map(c =>
        c.id === id && c.reserves < c.capacite
          ? { ...c, reserves: c.reserves + 1 }
          : c
      )
    );
  }

  // 📌 computed : ajouter statut "complet"
  coursAvecStatut = computed(() =>
    this.cours().map(c => ({
      ...c,
      complet: c.reserves >= c.capacite
    }))
  );
}