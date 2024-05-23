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
import { Livro } from '../../../../models/livro.model';
import { LivroService } from '../../../../services/livro.service';

@Component({
  selector: 'app-livro-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './livro-form.component.html',
  styleUrl: './livro-form.component.css'
})
export class LivroFormComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private livroService: LivroService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    const livro: Livro = activatedRoute.snapshot.data['livro'];

    this.formGroup = formBuilder.group({
      id: [(livro && livro.id) ? livro.id : null],
      titulo: [(livro && livro.titulo) ? livro.titulo : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      preco: [(livro && livro.preco) ? livro.preco : '', 
            Validators.compose([Validators.required])],
      autor: [(livro && livro.autor) ? livro.autor : '', 
            Validators.compose([Validators.required,])],
      ano_publicacao: [(livro && livro.ano_publicacao) ? livro.ano_publicacao : '', 
            Validators.compose([Validators.required,])],
      editora: [(livro && livro.editora) ? livro.editora : '', 
            Validators.compose([Validators.required])],
      isbn: [(livro && livro.isbn) ? livro.isbn : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(10),
                                Validators.maxLength(13)])],                                                                                         
    });

  }

  voltarPagina() {
    this.location.back();
  }

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const livro = this.formGroup.value;

      // operacao obtem o retorno de um observable de insert ou update
      const operacao = livro.id == null
      ? this.livroService.insert(livro)
      : this.livroService.update(livro);

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
      const livro = this.formGroup.value;
      if (livro.id != null) {
        this.livroService.delete(livro).subscribe({
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
    titulo: {
      required: 'Insira um título.',
      minlength: 'O titulo deve possuir ao menos 4 caracteres.'
    },
    preco: {
      required: 'Insira o preço (R$).',
    },
    autor: {
      required: 'Insira o nome do autor.',
    },
    ano_publicacao: {
      required: 'Insira o ano de publicação do livro.',
    },
    editora: {
      required: 'Insira a editora do livro.',
    },
    isbn: {
      required: 'Insira o número de registro ISBN.',
      minlength: 'o ISBN deve possuir no mínimo 10 caracteres.',
      maxlength: 'O ISBN deve possuir no máximo 13 caracteres.',

      apiError: ' ' // mensagem da api
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
