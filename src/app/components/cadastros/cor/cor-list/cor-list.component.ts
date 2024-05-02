import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import {MatPaginatorModule} from '@angular/material/paginator';

import { Cor } from '../../../../models/cor.model'; 
import { CorService } from '../../../../services/cor.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-cor-list',
  standalone: true,
  imports: [
    NgFor,
    MatTableModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule,
    MatPaginatorModule, 
    RouterModule],
  templateUrl: './cor-list.component.html',
  styleUrl: './cor-list.component.css'
})
export class CorListComponent implements OnInit {

  totalRecords = 0;
  pageSize = 2;
  page = 0;
  
  displayedColumns: string[] = ['id', 'cor', 'acao'];
  cor: Cor[] = [];

  constructor (
    private corService: CorService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.corService.findAll(this.page , this.pageSize).subscribe(data => {
      this.cor = data;
      console.log(this.cor);
    });

    this.corService.count().subscribe(
      data => {
        this.totalRecords = data;
        console.log(this.cor);
      }
    )
    this.atualizarLista();
  }

  paginar(event: PageEvent): void{
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.ngOnInit();
  }

  excluir(id: number) {
    this.corService.delete(id).subscribe(
      () => {
        this.snackBar.open('Cor excluída com sucesso', 'Fechar', {
          duration: 4000,
        });
        this.atualizarLista();
      },
      error => {
        this.snackBar.open('Erro ao excluir cor', 'Fechar', {
          duration: 4000,
        });
      }
    );
  }

  atualizarLista() {
    this.corService.findAll().subscribe(
      cor => {
        this.cor = cor;
      },
      error => {
        console.log('Erro ao buscar cor:', error);
      }
    );
  }


}
