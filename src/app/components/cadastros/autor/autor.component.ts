import { Component } from '@angular/core';
import { FormBuilder,FormControl,FormsModule, FormGroup,FormGroupDirective,NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AutorService } from '../../../services/autor.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Autor } from '../../../models/autor.model';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconRegistry, MatIconModule} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ErrorStateMatcher} from '@angular/material/core';
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

@Component({
  selector: 'autor',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule,
           MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule,
           MatMenuModule, MatIconModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.css'
})
export class AutorComponent {
  
  email = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  formGroup: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
    private autorService: AutorService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,) { 

      iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));

      const autor: Autor = activatedRoute.snapshot.data['autor'];
      this.formGroup = formBuilder.group({

        id: [(autor && autor.id) ? autor.id : null],
        nomeAutor: [(autor && autor.nomeAutor) ? autor.nomeAutor : '', 
              Validators.compose([Validators.required])],
        biografia: [(autor && autor.biografia) ? autor.biografia : '', 
              Validators.compose([Validators.required])],
        dataNascimento: [(autor && autor.dataNascimento) ? autor.dataNascimento : '', 
              Validators.compose([Validators.required])],
        nacionalidade: [(autor && autor.nacionalidade) ? autor.nacionalidade : '', 
              Validators.compose([Validators.required])],
        generoLiterario: [(autor && autor.generoLiterario) ? autor.generoLiterario : '', 
              Validators.compose([Validators.required])],
        email: [(autor && autor.email) ? autor.email : '', 
              Validators.compose([Validators.required])],
        senha: [(autor && autor.senha) ? autor.senha : '', 
              Validators.compose([Validators.required])],

      });
   
  }

  cadastrar() {
    
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;

      const operacao = autor.id == null
      ? this.autorService.insert(autor)
      : this.autorService.update(autor);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/autor'),
        error: (error: HttpErrorResponse) => {
          console.log('Falha ao Cadastrar Autor' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const autor = this.formGroup.value;
      if (autor.id != null) {
        this.autorService.delete(autor).subscribe({
          next: () => {
            this.router.navigateByUrl('/autor');
          },
          error: (err) => {
            console.log('Falha ao Excluir Autor' + JSON.stringify(err));
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
        alert(error.error?.message || 'Erro ao cadastrar autor.');
    } else if (error.status >= 500) {
        alert('Erro interno do servidor.');
    }
  }

  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    nomeAutor: {
      required: 'Insira o nome de autor.',
    },
    biografia: {
      required: 'Insira uma biografia.',
      apiError: ' ' 
    },
    dataNascimento: {
        required: 'Informe a data de nascimento do autor.',
      },
    nacionalidade: {
        required: 'Insira a nacionalidade do autor.',
        apiError: ' ' 
      },
    email: {
      required: 'Insira seu e-mail.',
    },
    senha: {
      required: 'Insira uma senha forte.',
      apiError: ' ' 
    },
    generoLiterario: {
      required: 'Insira o gênero literário do autor.',
      apiError: ' ' 
    },
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