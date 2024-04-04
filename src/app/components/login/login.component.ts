import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Login } from '../../models/login.model';

@Component({
  selector: 'login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

    const login: Login = activatedRoute.snapshot.data['login'];

    this.formGroup = formBuilder.group({
      id: [(login && login.id) ? login.id : null],
      email: [(login && login.email) ? login.email : '', 
            Validators.compose ([Validators.required, 
                                 Validators.minLength(4)])],
      senha: [(login && login.senha) ? login.senha : '',
            Validators.compose([Validators.required, 
                                Validators.minLength(2), 
                                Validators.maxLength(2)])]});
  }
}