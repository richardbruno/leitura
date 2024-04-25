import { Component, OnInit } from '@angular/core';
import { Livro } from '../../../../models/livro.model';
import { LivroService } from '../../../../services/livro.service';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormBuilder,FormsModule, FormGroup,FormGroupDirective,NgForm, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
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

@Component({
  selector: 'app-livro-list',
  standalone: true,
  imports: [NgFor, MatTableModule, MatToolbarModule, MatIconModule
    , MatButtonModule, RouterModule, MatPaginatorModule,MatMenuModule,MatInputModule,MatCardModule],
  templateUrl: './livro-list.component.html',
  styleUrl: './livro-list.component.css'
})
export class LivroListComponent{
  displayedColumns: string[] = ['id', 'titulo', 'preco', 'autor', 'ano_publicacao', 'editora', 'isbn', 'acao'];
  livros: Livro[] = [];

  totalRecords = 0;
  pageSize = 2;
  page = 0;

  constructor(private livroService: LivroService) {

  }

   ngOnInit(): void {
     this.livroService.findAll(this.page, this.pageSize).subscribe(data => {
       this.livros = data;
       console.log(this.livros);
     });

     this.livroService.count().subscribe(data => {
       this.totalRecords = data;
       console.log(this.totalRecords);
     });
   }
  // // Método para paginar os resultados
   paginar(event: PageEvent): void {
     this.page = event.pageIndex;
     this.pageSize = event.pageSize;
     this.ngOnInit();
   }
}