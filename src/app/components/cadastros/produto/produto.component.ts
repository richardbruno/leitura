import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, FormGroup, FormGroupDirective, NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LuminariaService } from '../../../services/Luminaria.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Produto } from '../../../models/produto.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpErrorResponse } from '@angular/common/http';

const THUMBUP_ICON =
  `
  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.` +
  `44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5` +
  `1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
  </svg>
`;

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export class InputErrorStateMatcherExample {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
}

@Component({
  selector: 'produto',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule,
    MatMenuModule, MatIconModule],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.css'
})
export class ProdutoComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private luminariaService: LuminariaService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,) {

    iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));

    const produto: Produto = activatedRoute.snapshot.data['produto'];
    this.formGroup = formBuilder.group({

      id: [(produto && produto.id) ? produto.id : null],
      estilo: [(produto && produto.estilo) ? produto.estilo : '',
      Validators.compose([Validators.required])],

      tipoDeFonteDeLuz: [(produto && produto.tipoDeFonteDeLuz) ? produto.tipoDeFonteDeLuz : '',
      Validators.compose([Validators.required])],

      cor: [(produto && produto.cor) ? produto.cor : '',
      Validators.compose([Validators.required])],

      marca: [(produto && produto.marca) ? produto.marca : '',
      Validators.compose([Validators.required])],

      descricao: [(produto && produto.descricao) ? produto.descricao : '',
      Validators.compose([Validators.required])],

      valor: [(produto && produto.valor) ? produto.valor : '',
      Validators.compose([Validators.required])],

    });

  }
/*
  initializeForm() {

    codigo de editar

    const luminaria: Produto = this.activatedRoute.snapshot.data['luminaria'];

    // selecionando o estado
    const estado = this.estados
      .find(estado => estado.id === (municipio?.estado?.id || null)); 

    this.formGroup = this.formBuilder.group({
      id: [(municipio && municipio.id) ? municipio.id : null],
      nomeProduro: [(municipio && municipio.nome) ? municipio.nome : '', Validators.required],
      estado: [estado]
    });
  }*/

  cadastrar() {

    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const produto = this.formGroup.value;

      const operacao = produto.id == null
        ? this.luminariaService.insert(produto)
        : this.luminariaService.update(produto);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/produto'),
        error: (error: HttpErrorResponse) => {
          console.log('Falha ao Cadastrar Produto' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const produto = this.formGroup.value;
      if (produto.id != null) {
        this.luminariaService.delete(produto).subscribe({
          next: () => {
            this.router.navigateByUrl('/produto');
          },
          error: (err) => {
            console.log('Falha ao Excluir Produto' + JSON.stringify(err));
          }
        });
      }
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
      alert(error.error?.message || 'Erro ao cadastrar produto.');
    } else if (error.status >= 500) {
      alert('Erro interno do servidor.');
    }
  }

  errorMessages: { [controlName: string]: { [errorName: string]: string } } = {
    nomeProduto: {
      required: 'Insira um nome para o produto.',
    },
    preco: {
      required: 'Insira um valor para o produto.',
    },
    descricao: {
      required: 'Insira a descrição do produto.',
      apiError: ' '
    },
    estoque: {
      required: 'Insira a quantidade em estoque.',
    },
    fornecedor: {
      required: 'Insira o nome do fornecedor.',
      apiError: ' '
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

    return 'Erro não mapeado';
  }

}