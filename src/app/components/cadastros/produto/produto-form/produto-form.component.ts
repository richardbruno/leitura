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
import { Produto } from '../../../../models/produto.model';
import { ProdutoService } from '../../../../services/produto.service';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProdutoFormComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    const produto: Produto = activatedRoute.snapshot.data['produto'];

    this.formGroup = formBuilder.group({
      id: [(produto && produto.id) ? produto.id : null],
      estilo: [(produto && produto.estilo) ? produto.estilo : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      tipoDeFonteDeLuz: [(produto && produto.tipoDeFonteDeLuz) ? produto.tipoDeFonteDeLuz : '', 
            Validators.compose([Validators.required])],
      cor: [(produto && produto.cor) ? produto.cor : '', 
            Validators.compose([Validators.required,])],
      marca: [(produto && produto.marca) ? produto.marca : '', 
            Validators.compose([Validators.required,])],
      descricao: [(produto && produto.descricao) ? produto.descricao : '', 
            Validators.compose([Validators.required])],
      valor: [(produto && produto.valor) ? produto.valor : '', 
            Validators.compose([Validators.required,])],                                                                                         
    });

  }

  voltarPagina() {
    this.location.back();
  }

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const produto = this.formGroup.value;

      // operacao obtem o retorno de um observable de insert ou update
      const operacao = produto.id == null
      ? this.produtoService.insert(produto)
      : this.produtoService.update(produto);

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
      const produto = this.formGroup.value;
      if (produto.id != null) {
        this.produtoService.delete(produto).subscribe({
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
    estilo: {
      required: 'Insira o estilo do produto.',
      minlength: 'O estilo deve possuir ao menos 4 caracteres.'
    },
    tipoDeFonteDeLuz: {
      required: 'Insira o tipo de fonte de luz.',
    },
    cor: {
      required: 'Insira a cor do autor.',
    },
    marca: {
      required: 'Insira a marca do produto.',
    },
    descricao: {
      required: 'Insira a descrição do produto.',
    },
    valor: {
      required: 'Insira o valor do produto.',

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
