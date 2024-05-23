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
import { Editora } from '../../../../models/editora.model';
import { EditoraService } from '../../../../services/editora.service';

@Component({
  selector: 'app-editora-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule],
  templateUrl: './editora-form.component.html',
  styleUrl: './editora-form.component.css'
})
export class EditoraFormComponent {

  formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private editoraService: EditoraService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    const editora: Editora = activatedRoute.snapshot.data['editora'];

    this.formGroup = formBuilder.group({
      id: [(editora && editora.id) ? editora.id : null],
      nomeEditora: [(editora && editora.nomeEditora) ? editora.nomeEditora : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      descricaoEditora: [(editora && editora.descricaoEditora) ? editora.descricaoEditora : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(10)])],
      paisOrigem: [(editora && editora.paisOrigem) ? editora.paisOrigem : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(4)])],
      site: [(editora && editora.site) ? editora.site : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(10)])],
      dataFundacao: [(editora && editora.dataFundacao) ? editora.dataFundacao : '', 
            Validators.compose([Validators.required])]                    
    });

  }

  voltarPagina() {
    this.location.back();
  }

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;

      // operacao obtem o retorno de um observable de insert ou update
      const operacao = editora.id == null
      ? this.editoraService.insert(editora)
      : this.editoraService.update(editora);

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
      if (error.error?.errors) {
        error.error.errors.forEach((validationError: any) => {
          const formControl = this.formGroup.get(validationError.fieldName);
          console.log(validationError);
          if (formControl) {
            console.log(formControl);
            formControl.setErrors({ apiError: validationError.message });
          }
        });
      };
    } else if (error.status < 400) {
        alert(error.error?.message || 'Erro ao enviar formulário.');
    } else if (error.status >= 500) {
        alert('Erro interno do servidor. error:500.');
    }
  }

  excluir() {
    if (this.formGroup.valid) {
      const editora = this.formGroup.value;
      if (editora.id != null) {
        this.editoraService.delete(editora).subscribe({
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
    nomeEditora: {
      required: 'O nome da editora deve ser informado.',
      minlength: 'O nome deve possuir ao menos 4 caracteres.'
    },
    descricaoEditora: {
      required: 'Informe uma descrição sobre a editora.',
      minlength: 'A descrição deve possuir ao menos 10 caracteres.',
    },
    paisOrigem: {
      required: 'Informe o país de origem da editora.',
      minlength: 'A descrição deve possuir ao menos 4 caracteres.',
    },
    site: {
      required: 'Informe o site da editora.',
      minlength: 'A URL deve possuir ao menos 10 caracteres.',
    },
    dataFundacao: {
      required: 'Informe a data de fundação da editora.',
      
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

    return 'Erro não mapeado';
  }

}
