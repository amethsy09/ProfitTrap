import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adherant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adherant.html',
  styleUrl: './adherant.css',
})
export class Adherant {

  title = "Adherants";

  // 🔍 champ de recherche
  searchText: string = '';

  adherants = [
    {
      id: 1,
      Nomcomplet: 'Ramatoulaye Gueye',
      telehone: '+22178522494',
      email: 'exemple@gmail.com',
      statut: 'inactif'
    },
    {
      id: 2,
      Nomcomplet: 'Awa Diop',
      telehone: '+22170000002',
      email: 'awa@gmail.com',
      statut: 'actif'
    },
    {
      id: 3,
      Nomcomplet: 'Moussa Ndiaye',
      telehone: '+22170000003',
      email: 'moussa@gmail.com',
      statut: 'en_cours'
    },
    {
      id: 4,
      Nomcomplet: 'Fatou Ba',
      telehone: '+22170000004',
      email: 'fatou@gmail.com',
      statut: 'actif'
    },
    {
      id: 5,
      Nomcomplet: 'Ibrahima Sow',
      telehone: '+22170000005',
      email: 'ibra@gmail.com',
      statut: 'en_cours'
    },
    {
      id: 6,
      Nomcomplet: 'Khady Fall',
      telehone: '+22170000006',
      email: 'khady@gmail.com',
      statut: 'actif'
    }
  ];

  // 🔥 FILTRE DYNAMIQUE
  get filteredAdherants() {
    return this.adherants.filter(item =>
      item.Nomcomplet.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.telehone.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.statut.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}