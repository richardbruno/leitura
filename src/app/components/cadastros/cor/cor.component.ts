import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EmptyError, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { Cor } from '../../../models/cor.model';
import { CorService } from '../../../services/cor.service';


@Component({
  selector: 'app-cor',
  standalone: true,
  imports: [NgIf, 
    ReactiveFormsModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule, 
    MatCardModule, 
    MatToolbarModule, 
    RouterModule],
  templateUrl: './cor.component.html',
  styleUrl: './cor.component.css'
})
export class CorComponent {

  formGroup: FormGroup;

  constructor (
    private formBuilder: FormBuilder,
    private corService: CorService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      
    const cor: Cor = activatedRoute.snapshot.data['cor'];
      
    this.formGroup = formBuilder.group({
      id: [(cor && cor.id) ? cor.id : null],
      
      descricao: [(cor && cor.descricao) ? cor.descricao: '', Validators.compose([Validators.required])],
    });
  }

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const cor = this.formGroup.value;

      // operacao obtem o retorno de um observable de insert ou update
      const operacao = cor.id == null
      ? this.corService.insert(cor)
      : this.corService.update(cor);

      // realiza a operacao e trata a resposta.
      operacao.subscribe({
        next: () => this.router.navigateByUrl('/cor'),
        error: (error: HttpErrorResponse) => {
          console.log('Erro ao salvar' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  tratarErros(error: HttpErrorResponse) {
    if (error.status === 400) {
      // erros relacionados a campos
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
        // obs: o fieldName tem o mesmo valor da api
        const formControl = this.formGroup.get(validationError.fieldName);
          console.log(validationError);
          if (formControl) {
            console.log(formControl);
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      };
    } else if (error.status < 400) {
        // Erro genérico não relacionado a um campo específico.
        alert(error.error?.message || 'Erro genérico no envio do formulário.');
    } else if (error.status >= 500) {
        alert('Erro interno do servidor. Por favor, tente novamente mais tarde.');
    }
  }

  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    cor: {
      required: 'O nome da cor deve ser informado.',
      minlength: 'O nome da cor deve possuir ao menos 4 caracteres.'
    }
  }

  getErrorMessage(controlName: string, errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    // retorna a mensagem de erro
    for (const errorName in errors) {
      if (errors.hasOwnProperty(errorName) && 
          this.errorMessages[controlName][errorName]) {
        return this.errorMessages[controlName][errorName];
      }
    }

    return 'Erro não mapeado (entre em contato com o desenvolvedor)';
  }

}
