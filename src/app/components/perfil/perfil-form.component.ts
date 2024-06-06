import { Location, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Data, Router, RouterModule } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, RouterModule, MatIconModule],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.css'
})
export class PerfilFormComponent {

  dia!: number;
  mes!: number;
  ano!: number;
  
  

  formGroup: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location) {

    const usuario: Usuario = activatedRoute.snapshot.data['usuario'];

    this.formGroup = formBuilder.group({
      id: [(usuario && usuario.id) ? usuario.id : null],
      nomeUsuario: [(usuario && usuario.nomeUsuario) ? usuario.nomeUsuario : '', 
            Validators.compose([Validators.required, 
                                Validators.minLength(4)])],
      cpf: [(usuario && usuario.cpf) ? usuario.cpf : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(14),
                                Validators.maxLength(14)])],
      email: [(usuario && usuario.email) ? usuario.email : '', 
            Validators.compose([Validators.required,])],
      senha: [(usuario && usuario.senha) ? usuario.senha : '', 
            Validators.compose([Validators.required,])],
      dataDeNacimento: [(usuario && usuario.dataDeNacimento) ? usuario.dataDeNacimento : '', 
            Validators.compose([Validators.required])],
      cep: [(usuario && usuario.cep) ? usuario.cep : '', 
            Validators.compose([Validators.required,
                                Validators.minLength(8),
                                Validators.maxLength(8)])],                                                                                         
    });

  }

  voltarPagina() {
    this.location.back();
  }

  invertDate(date: Date): Date {
    // Obter os componentes da data original
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() retorna meses de 0 a 11, então adicionamos 1
    const year = date.getFullYear();

    // Crie uma nova data com os componentes invertidos (ano, mês, dia)
    const invertedDateStr = `${year}-${month}-${day}`;
    const invertedDate = new Date(invertedDateStr);

    return invertedDate;
}

  salvar() {
    // marca todos os campos do formulario como 'touched'
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      

      const currentDate = this.formGroup.get('dataDeNascimento')?.value;
      if (currentDate) {
        const invertedDate = this.invertDate(new Date(currentDate));
        this.formGroup.get('dataDeNascimento')?.setValue(invertedDate);
      }
      
      const usuario = this.formGroup.value;

      console.log('if')

      // operacao obtem o retorno de um observable de insert ou update
      const operacao = usuario.id == null
      ? this.usuarioService.insert(usuario)
      : this.usuarioService.update(usuario);
      console.log(usuario)

      // realiza a operacao e trata a resposta.
      operacao.subscribe({
        next: () => {
          this.voltarPagina()
          console.log('deu certo')
        },
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
      const usuario = this.formGroup.value;
      if (usuario.id != null) {
        this.usuarioService.delete(usuario).subscribe({
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
    nomeUsuario: {
      required: 'Insira um título.',
      minlength: 'O nome de usuario deve possuir ao menos 4 caracteres.'
    },
    cpf: {
      required: 'Insira o CPF.',
      minlength: 'O CPF deve possuir este padrão 000.000.000-00',
      maxlength: 'O CPF deve possuir este padrão 000.000.000-00',
    },
    email: {
      required: 'Insira o nome do autor.',
    },
    senha: {
      required: 'Insira sua senha.',
    },
    telefone: {
      required: 'Insira seu telefone.',
    },
    cep: {
      required: 'Insira seu CEP.',
      minlength: 'o CEP deve possuir 8 caracteres.',
      maxlength: 'O CEP deve possuir 8 caracteres.',

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
