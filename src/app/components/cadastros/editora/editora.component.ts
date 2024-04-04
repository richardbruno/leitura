import { Component } from '@angular/core';
import { FormBuilder,FormControl,FormsModule, FormGroup,FormGroupDirective,NgForm, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditoraService } from '../../../services/editora.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Editora } from '../../../models/editora.model';
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
  selector: 'editora',
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule,
           MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule,
           MatMenuModule, MatIconModule],
  templateUrl: './editora.component.html',
  styleUrl: './editora.component.css'
})
export class EditoraComponent {

  formGroup: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,) { 

      iconRegistry.addSvgIconLiteral('thumbs-up', sanitizer.bypassSecurityTrustHtml(THUMBUP_ICON));

      const editora: Editora = activatedRoute.snapshot.data['editora'];
      this.formGroup = formBuilder.group({

        id: [(editora && editora.id) ? editora.id : null],
        nomeEditora: [(editora && editora.nomeEditora) ? editora.nomeEditora : '', 
              Validators.compose([Validators.required])],
        descricaoEditora: [(editora && editora.descricaoEditora) ? editora.descricaoEditora : '', 
              Validators.compose([Validators.required])],
        dataFundacao: [(editora && editora.dataFundacao) ? editora.dataFundacao : '', 
              Validators.compose([Validators.required])],
        paisOrigem: [(editora && editora.paisOrigem) ? editora.paisOrigem : '', 
              Validators.compose([Validators.required])],
        site: [(editora && editora.site) ? editora.site : '', 
              Validators.compose([Validators.required])],

      });
   
  }

  cadastrar() {
    
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;

      const operacao = editora.id == null
      ? this.editoraService.insert(editora)
      : this.editoraService.update(editora);

      operacao.subscribe({
        next: () => this.router.navigateByUrl('/editora'),
        error: (error: HttpErrorResponse) => {
          console.log('Falha ao Cadastrar Editora' + JSON.stringify(error));
          this.tratarErros(error);
        }
      });
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id != null) {
        this.editoraService.delete(editora).subscribe({
          next: () => {
            this.router.navigateByUrl('/editora');
          },
          error: (err) => {
            console.log('Falha ao Excluir Editora' + JSON.stringify(err));
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
        alert(error.error?.message || 'Erro ao cadastrar editora.');
    } else if (error.status >= 500) {
        alert('Erro interno do servidor.');
    }
  }

  errorMessages: {[controlName: string]: {[errorName: string] : string}} = {
    nomeEditora: {
      required: 'Insira o nome de editora.',
    },
    descricaoEditora: {
      required: 'Insira uma descrição.',
      apiError: ' ' 
    },
    dataFundacao: {
        required: 'Informe a data de fundação da editora.',
      },
      paisOrigem: {
        required: 'Insira o paíos de origem e da editora.',
        apiError: ' ' 
      },
      site: {
      required: 'Insira o site da editora.',
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