import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Adherent {
  id: number;
  Nomcomplet: string;
  telephone: string;
  email: string;
  statut: 'actif' | 'inactif' | 'en_cours';
  dateInscription: Date;
  avatar?: string;
}

interface ValidationErrors {
  Nomcomplet?: string;
  email?: string;
  telephone?: string;
}

@Component({
  selector: 'app-adherant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './adherant.html',
  styleUrls: ['./adherant.css']
})
export class Adherant {
  
  Math = Math;
  
  // Signaux
  searchText = signal<string>('');
  selectedStatut = signal<string>('tous');
  currentPage = signal<number>(1);
  itemsPerPage = 5;
  showModal = signal<boolean>(false);
  editingAdherent = signal<Adherent | null>(null);
  
  // Validation en temps réel
  validationErrors = signal<ValidationErrors>({});
  formTouched = signal<boolean>(false);
  
  // Notification
  notification = signal<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Données des adhérents
  private adherentsSignal = signal<Adherent[]>([
    {
      id: 1,
      Nomcomplet: 'Ramatoulaye Gueye',
      telephone: '+221 78 522 49 44',
      email: 'ramatoulaye.gueye@email.com',
      statut: 'actif',
      dateInscription: new Date('2024-01-15'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramatoulaye'
    },
    {
      id: 2,
      Nomcomplet: 'Awa Diop',
      telephone: '+221 70 000 00 02',
      email: 'awa.diop@email.com',
      statut: 'actif',
      dateInscription: new Date('2024-02-20'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Awa'
    },
    {
      id: 3,
      Nomcomplet: 'Moussa Ndiaye',
      telephone: '+221 70 000 00 03',
      email: 'moussa.ndiaye@email.com',
      statut: 'en_cours',
      dateInscription: new Date('2024-03-10'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moussa'
    },
    {
      id: 4,
      Nomcomplet: 'Fatou Ba',
      telephone: '+221 70 000 00 04',
      email: 'fatou.ba@email.com',
      statut: 'actif',
      dateInscription: new Date('2024-01-05'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatou'
    },
    {
      id: 5,
      Nomcomplet: 'Ibrahima Sow',
      telephone: '+221 70 000 00 05',
      email: 'ibrahima.sow@email.com',
      statut: 'inactif',
      dateInscription: new Date('2023-12-01'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahima'
    },
    {
      id: 6,
      Nomcomplet: 'Khady Fall',
      telephone: '+221 70 000 00 06',
      email: 'khady.fall@email.com',
      statut: 'actif',
      dateInscription: new Date('2024-02-28'),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khady'
    }
  ]);

  // Formulaire
  formData = signal<Partial<Adherent>>({
    Nomcomplet: '',
    telephone: '',
    email: '',
    statut: 'actif'
  });

  // Computed signal pour la validation (ne modifie pas les signaux)
  formValid = computed(() => {
    const data = this.formData();
    const errors: ValidationErrors = {};
    
    // Validation Nom complet
    if (!data.Nomcomplet || data.Nomcomplet.trim().length === 0) {
      errors.Nomcomplet = 'Le nom complet est requis';
    } else if (data.Nomcomplet.trim().length < 2) {
      errors.Nomcomplet = 'Le nom doit contenir au moins 2 caractères';
    } else if (data.Nomcomplet.trim().length > 50) {
      errors.Nomcomplet = 'Le nom ne doit pas dépasser 50 caractères';
    }
    
    // Validation Email
    const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!data.email || data.email.trim().length === 0) {
      errors.email = 'L\'email est requis';
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Email invalide (ex: nom@domaine.com)';
    } else {
      // Vérifier unicité (sans modifier de signal)
      const emailExists = this.adherentsSignal().some(a => 
        a.email.toLowerCase() === data.email!.toLowerCase() && 
        a.id !== this.editingAdherent()?.id
      );
      if (emailExists) {
        errors.email = 'Cet email est déjà utilisé';
      }
    }
    
    // Validation Téléphone
    const phoneRegex = /^(\+221|00221|0)?[7-8][0-9]{8}$/;
    const cleanPhone = (data.telephone || '').replace(/\s/g, '');
    if (!data.telephone || data.telephone.trim().length === 0) {
      errors.telephone = 'Le téléphone est requis';
    } else if (!phoneRegex.test(cleanPhone)) {
      errors.telephone = 'Téléphone invalide (ex: +221 78 123 45 67)';
    } else {
      // Vérifier unicité
      const phoneExists = this.adherentsSignal().some(a =>
        a.telephone.replace(/\s/g, '') === cleanPhone &&
        a.id !== this.editingAdherent()?.id
      );
      if (phoneExists) {
        errors.telephone = 'Ce numéro est déjà utilisé';
      }
    }
    
    // Mettre à jour les erreurs (seulement si différent)
    const currentErrors = this.validationErrors();
    if (JSON.stringify(currentErrors) !== JSON.stringify(errors)) {
      // Utiliser setTimeout pour éviter l'erreur de rendu
      setTimeout(() => {
        this.validationErrors.set(errors);
      });
    }
    
    return Object.keys(errors).length === 0;
  });

  // Validation d'un champ spécifique (appelée depuis les événements)
  validateField(field: keyof ValidationErrors, value: string) {
    // Forcer la validation en déclenchant le computed
    this.formValid();
    
    // Optionnel : mettre à jour formTouched
    if (!this.formTouched()) {
      this.formTouched.set(true);
    }
  }

  // Vérifier si le formulaire est valide (utilise le computed)
  isFormValid(): boolean {
    return this.formValid();
  }

  // Mise à jour des champs avec validation
  updateField(field: string, value: string) {
    this.formData.update(data => ({ ...data, [field]: value }));
    this.formTouched.set(true);
    // Déclencher la validation
    setTimeout(() => {
      this.formValid();
    });
  }

  // Adhérents filtrés
  filteredAdherents = computed(() => {
    let filtered = this.adherentsSignal();
    
    const search = this.searchText().toLowerCase();
    if (search) {
      filtered = filtered.filter(item =>
        item.Nomcomplet.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.telephone.toLowerCase().includes(search)
      );
    }
    
    if (this.selectedStatut() !== 'tous') {
      filtered = filtered.filter(item => item.statut === this.selectedStatut());
    }
    
    return filtered;
  });

  // Pagination
  paginatedAdherents = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredAdherents().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredAdherents().length / this.itemsPerPage));

  paginationInfo = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage() * this.itemsPerPage, this.filteredAdherents().length);
    const total = this.filteredAdherents().length;
    
    return {
      start,
      end,
      total,
      text: `Affichage de ${start} à ${end} sur ${total} adhérents`
    };
  });

  // Statistiques
  stats = computed(() => ({
    total: this.adherentsSignal().length,
    actif: this.adherentsSignal().filter(a => a.statut === 'actif').length,
    inactif: this.adherentsSignal().filter(a => a.statut === 'inactif').length,
    en_cours: this.adherentsSignal().filter(a => a.statut === 'en_cours').length
  }));

  // CRUD Actions
  addAdherent() {
    this.editingAdherent.set(null);
    this.formData.set({
      Nomcomplet: '',
      telephone: '',
      email: '',
      statut: 'actif'
    });
    this.validationErrors.set({});
    this.formTouched.set(false);
    this.showModal.set(true);
  }

  editAdherent(adherent: Adherent) {
    this.editingAdherent.set(adherent);
    this.formData.set({ ...adherent });
    this.validationErrors.set({});
    this.formTouched.set(false);
    this.showModal.set(true);
  }

  saveAdherent() {
    this.formTouched.set(true);
    
    // Valider avant sauvegarde
    const isValid = this.isFormValid();
    
    if (!isValid) {
      this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
      return;
    }
    
    const formValue = this.formData();
    
    if (this.editingAdherent()) {
      // Modification
      const updatedAdherents = this.adherentsSignal().map(a =>
        a.id === this.editingAdherent()?.id
          ? { ...a, ...formValue as Adherent }
          : a
      );
      this.adherentsSignal.set(updatedAdherents);
      this.showNotification('Adhérent modifié avec succès!', 'success');
    } else {
      // Ajout
      const newId = Math.max(...this.adherentsSignal().map(a => a.id), 0) + 1;
      const newAdherent: Adherent = {
        id: newId,
        Nomcomplet: formValue.Nomcomplet!,
        telephone: formValue.telephone!,
        email: formValue.email!,
        statut: formValue.statut as 'actif' | 'inactif' | 'en_cours',
        dateInscription: new Date(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formValue.Nomcomplet!.replace(/\s/g, '')}`
      };
      this.adherentsSignal.set([...this.adherentsSignal(), newAdherent]);
      this.showNotification('Adhérent ajouté avec succès!', 'success');
    }
    
    this.showModal.set(false);
    this.resetForm();
  }

  deleteAdherent(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
      const updatedAdherents = this.adherentsSignal().filter(a => a.id !== id);
      this.adherentsSignal.set(updatedAdherents);
      this.showNotification('Adhérent supprimé avec succès!', 'success');
      
      if (this.paginatedAdherents().length === 0 && this.currentPage() > 1) {
        this.currentPage.set(this.currentPage() - 1);
      }
    }
  }

  // Utilitaires
  getStatutColor(statut: string): string {
    const colors = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-red-100 text-red-800',
      en_cours: 'bg-yellow-100 text-yellow-800'
    };
    return colors[statut as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  getStatutLabel(statut: string): string {
    const labels = {
      actif: 'Actif',
      inactif: 'Inactif',
      en_cours: 'En cours'
    };
    return labels[statut as keyof typeof labels] || statut;
  }

  resetForm() {
    this.formData.set({
      Nomcomplet: '',
      telephone: '',
      email: '',
      statut: 'actif'
    });
    this.validationErrors.set({});
    this.formTouched.set(false);
    this.editingAdherent.set(null);
  }

  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({ show: true, message, type });
    setTimeout(() => {
      this.notification.set({ show: false, message: '', type: 'success' });
    }, 3000);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  exportToCSV() {
    const headers = ['ID', 'Nom complet', 'Email', 'Téléphone', 'Statut', "Date d'inscription"];
    const data = this.filteredAdherents().map(a => [
      a.id,
      a.Nomcomplet,
      a.email,
      a.telephone,
      this.getStatutLabel(a.statut),
      a.dateInscription.toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adherents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showNotification('Export CSV réussi!', 'success');
  }
}