import { Component, signal, computed, effect } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Validateur personnalisé pour le nom complet
function nameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const isValid = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/.test(value);
    return isValid ? null : { pattern: true };
  };
}

// Validateur pour l'âge (entre 16 et 120)
function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    const age = parseInt(value, 10);
    if (isNaN(age)) return { invalid: true };
    if (age < 16) return { min: 16 };
    if (age > 120) return { max: 120 };
    return null;
  };
}

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inscription.html',
  styleUrls: ['./inscription.css']
})
export class InscriptionComponent {

  inscriptionForm: FormGroup;
  showPassword = signal<boolean>(false);
  submitted = signal<boolean>(false);
  
  // Notification
  notification = signal<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });

  constructor(private fb: FormBuilder) {
    this.inscriptionForm = this.fb.group({
      civilite: ['monsieur', Validators.required],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), nameValidator()]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), nameValidator()]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/)]],
      confirmEmail: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern(/^(\+221|00221|0)?[7-8][0-9]{8}$/)]],
      age: ['', [Validators.required, ageValidator()]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPassword: ['', [Validators.required]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      ville: ['', [Validators.required, Validators.minLength(2)]],
      codePostal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      newsletter: [false],
      conditions: [false, Validators.requiredTrue]
    }, {
      validators: [this.emailMatchValidator.bind(this), this.passwordMatchValidator.bind(this)]
    });

    // Effect pour logger les changements du formulaire
    effect(() => {
      if (this.submitted()) {
        console.log('📝 Formulaire d\'inscription - Statut:', {
          valid: this.inscriptionForm.valid,
          errors: this.getAllErrors(),
          values: this.inscriptionForm.value,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    });
  }

  // Validateur personnalisé : vérifier que les emails correspondent
  emailMatchValidator(group: FormGroup): ValidationErrors | null {
    const email = group.get('email')?.value;
    const confirmEmail = group.get('confirmEmail')?.value;
    
    if (email && confirmEmail && email !== confirmEmail) {
      group.get('confirmEmail')?.setErrors({ mismatch: true });
      return { emailMismatch: true };
    }
    
    if (confirmEmail && group.get('confirmEmail')?.errors) {
      const errors = { ...group.get('confirmEmail')?.errors };
      // Utiliser la syntaxe entre crochets pour supprimer la propriété 'mismatch'
      if (errors['mismatch']) {
        delete errors['mismatch'];
      }
      group.get('confirmEmail')?.setErrors(Object.keys(errors).length ? errors : null);
    }
    
    return null;
  }

  // Validateur personnalisé : vérifier que les mots de passe correspondent
  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword && group.get('confirmPassword')?.errors) {
      const errors = { ...group.get('confirmPassword')?.errors };
      // Utiliser la syntaxe entre crochets pour supprimer la propriété 'mismatch'
      if (errors['mismatch']) {
        delete errors['mismatch'];
      }
      group.get('confirmPassword')?.setErrors(Object.keys(errors).length ? errors : null);
    }
    
    return null;
  }

  // Récupérer toutes les erreurs du formulaire
  getAllErrors(): any {
    const errors: any = {};
    Object.keys(this.inscriptionForm.controls).forEach(key => {
      const control = this.inscriptionForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.inscriptionForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.submitted()));
  }

  // Obtenir le message d'erreur pour un champ
  getFieldError(fieldName: string): string {
    const field = this.inscriptionForm.get(fieldName);
    if (!field || !field.errors || !(field.touched || this.submitted())) return '';
    
    const errors = field.errors;
    
    switch(fieldName) {
      case 'nom':
      case 'prenom':
        if (errors['required']) return 'Ce champ est requis';
        if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} caractères`;
        if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} caractères`;
        if (errors['pattern']) return 'Utilisez uniquement des lettres, espaces, apostrophes ou tirets';
        break;
        
      case 'email':
        if (errors['required']) return 'L\'email est requis';
        if (errors['email'] || errors['pattern']) return 'Email invalide (ex: nom@domaine.com)';
        break;
        
      case 'confirmEmail':
        if (errors['required']) return 'Veuillez confirmer votre email';
        if (errors['mismatch']) return 'Les emails ne correspondent pas';
        break;
        
      case 'telephone':
        if (errors['required']) return 'Le téléphone est requis';
        if (errors['pattern']) return 'Format invalide (ex: +221 78 123 45 67)';
        break;
        
      case 'age':
        if (errors['required']) return 'L\'âge est requis';
        if (errors['min']) return 'Vous devez avoir au moins 16 ans';
        if (errors['max']) return 'Âge maximum 120 ans';
        if (errors['invalid']) return 'Âge invalide';
        break;
        
      case 'password':
        if (errors['required']) return 'Le mot de passe est requis';
        if (errors['minlength']) return 'Minimum 8 caractères';
        if (errors['pattern']) return 'Doit contenir: majuscule, minuscule, chiffre et caractère spécial';
        break;
        
      case 'confirmPassword':
        if (errors['required']) return 'Veuillez confirmer votre mot de passe';
        if (errors['mismatch']) return 'Les mots de passe ne correspondent pas';
        break;
        
      case 'adresse':
        if (errors['required']) return 'L\'adresse est requise';
        if (errors['minlength']) return 'Adresse trop courte';
        break;
        
      case 'ville':
        if (errors['required']) return 'La ville est requise';
        break;
        
      case 'codePostal':
        if (errors['required']) return 'Le code postal est requis';
        if (errors['pattern']) return 'Code postal invalide (5 chiffres)';
        break;
        
      case 'conditions':
        if (errors['required']) return 'Vous devez accepter les conditions';
        break;
    }
    
    return 'Champ invalide';
  }

  // Force la validation de tous les champs
  markAllFieldsAsTouched() {
    Object.keys(this.inscriptionForm.controls).forEach(key => {
      const control = this.inscriptionForm.get(key);
      control?.markAsTouched();
    });
    this.submitted.set(true);
  }

  // Soumission du formulaire
  onSubmit() {
    this.submitted.set(true);
    
    if (this.inscriptionForm.valid) {
      // Simuler un appel API
      const formData = this.inscriptionForm.value;
      console.log('📋 Nouvelle inscription:', formData);
      
      // Afficher la notification de succès
      this.showNotification(
        `Bienvenue ${formData.prenom} ${formData.nom} ! Inscription réussie.`,
        'success'
      );
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        this.inscriptionForm.reset({
          civilite: 'monsieur',
          newsletter: false,
          conditions: false
        });
        this.submitted.set(false);
        Object.keys(this.inscriptionForm.controls).forEach(key => {
          this.inscriptionForm.get(key)?.markAsUntouched();
        });
      }, 2000);
    } else {
      this.markAllFieldsAsTouched();
      this.showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
    }
  }

  // Afficher une notification
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({ show: true, message, type });
    setTimeout(() => {
      this.notification.set({ show: false, message: '', type: 'success' });
    }, 4000);
  }

  // Basculer l'affichage du mot de passe
  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  // Vérifier la force du mot de passe
  getPasswordStrength(): { score: number; text: string; color: string } {
    const password = this.inscriptionForm.get('password')?.value || '';
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[@$!%*?&]/)) score++;
    
    const strengthMap: { [key: number]: { score: number; text: string; color: string } } = {
      0: { score: 0, text: 'Très faible', color: 'bg-red-500' },
      1: { score: 20, text: 'Faible', color: 'bg-orange-500' },
      2: { score: 40, text: 'Moyen', color: 'bg-yellow-500' },
      3: { score: 60, text: 'Bon', color: 'bg-blue-500' },
      4: { score: 80, text: 'Fort', color: 'bg-green-500' },
      5: { score: 100, text: 'Très fort', color: 'bg-green-600' }
    };
    
    return strengthMap[score] || strengthMap[0];
  }
}