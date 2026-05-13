import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './inscription.html'
})
export class InscriptionComponent {

  inscriptionForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.inscriptionForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],

      email: [
        '',
        [Validators.required, Validators.email]
      ],

      age: [
        '',
        [Validators.required, Validators.min(18)]
      ]
    });

  }

  onSubmit() {

    if (this.inscriptionForm.valid) {
      console.log(this.inscriptionForm.value);
      alert('Inscription réussie');
      this.inscriptionForm.reset();
    } else {
      this.inscriptionForm.markAllAsTouched();
    }

  }

}