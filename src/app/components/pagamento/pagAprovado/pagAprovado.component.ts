import { Location, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Pagamento } from '../../../models/pagamento.model';
import { PagamentoService } from '../../../services/pagamento.service';

@Component({
  selector: 'app-pagAprovado',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './pagAprovado.component.html',
  styleUrl: './pagAprovado.component.css'
}) 
export class PagAprovadoComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private pagamentoService: PagamentoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    const pagamento: Pagamento = activatedRoute.snapshot.data['pagamento'];

    this.formGroup = formBuilder.group({
      id: [(pagamento && pagamento.id) ? pagamento.id : null],
      nomeTitular: [(pagamento && pagamento.nomeTitular) ? pagamento.nomeTitular : '', 
            Validators.compose([Validators.required])],
      numCartao: [(pagamento && pagamento.numCartao) ? pagamento.numCartao : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(16),
                                Validators.maxLength(16)])],
      vencimento: [(pagamento && pagamento.vencimento) ? pagamento.vencimento : '', 
            Validators.compose([Validators.required,
              Validators.minLength(4),
              Validators.maxLength(4)])],
      cvv: [(pagamento && pagamento.cvv) ? pagamento.cvv : '', 
            Validators.compose([Validators.required,
              Validators.minLength(3),
              Validators.maxLength(3)])]                                                                                    
    });

  }

  voltarPagina() {
    this.location.back();
  }

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const pagamento = this.formGroup.value;

      // operacao obtem o retorno de um observable de insert ou update
      const operacao = pagamento.id == null
      ? this.pagamentoService.insert(pagamento)
      : this.pagamentoService.update(pagamento);

      // realiza a operacao e trata a resposta.
      operacao.subscribe({
        next: () => this.voltarPagina(),
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
        alert(error.error?.message || 'Erro no envio do formulário.');
    } else if (error.status >= 500) {
        alert('Erro interno do servidor. error:500.');
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const pagamento = this.formGroup.value;
      if (pagamento.id != null) {
        this.pagamentoService.delete(pagamento).subscribe({
          next: () => {
            this.voltarPagina();
          },
          error: (err) => {
            console.log('Erro ao Excluir' + JSON.stringify(err));
          }
        });
      }
    }
  }

  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    nomeTitular: {
      required: 'Campo Obrigatório',
    },
    numCartao: {
      required: 'Campo Obrigatório',
      minlength: 'Cartão Inválido.',
      maxlength:'Cartão Inválido.'
    },
    vencimento: {
      required: 'Campo Obrigatório',
      minlength: 'Cartão Inválido.',
      maxlength:'Cartão Inválido.'
    },
    cvv: {
      required: 'Campo Obrigatório',
      minlength: 'Cartão Inválido.',
      maxlength:'Cartão Inválido.'
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
