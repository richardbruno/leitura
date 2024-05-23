import { Component, OnInit, signal } from '@angular/core';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardTitle } from '@angular/material/card';
import { Consulta } from '../../models/consulta.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsultaService } from '../../services/consulta.service';
import { NgFor } from '@angular/common';
import { MatButton } from '@angular/material/button';

// tipo personalizado de dados, como classes e interfaces, porém mais simples.
type Card = {
  idConsulta: number;
  titulo: string;
  preco: number;
}

@Component({
  selector: 'app-consulta-card-list',
  standalone: true,
  imports: [MatCard, MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, NgFor, MatButton],
  templateUrl: './consulta-card-list.component.html',
  styleUrl: './consulta-card-list.component.css'
})
export class ConsultaCardListComponent implements OnInit {

  cards = signal<Card[]> ([]);
  consultas: Consulta[] = [];

  constructor(private consultaService: ConsultaService, 
              private carrinhoService: CarrinhoService,
              private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.carregarConsultas();
  }

  carregarConsultas() {
    // buscando todos as consultas
    this.consultaService.findAll(0, 10).subscribe(data => {
      this.consultas = data;
      this.carregarCards();
    });
  }

  carregarCards() {
    const cards: Card[] = [];
    this.consultas.forEach(consulta => {
      cards.push({
        idConsulta: consulta.id,
        titulo: consulta.nome,
        preco: consulta.preco
      });
    });
    this.cards.set(cards);
  }

  adicionarAoCarrinho(card: Card) {
    this.showSnackbarTopPosition('Produto adicionado ao carrinho!', 'Fechar');
    this.carrinhoService.adicionar({
      id: card.idConsulta,
      nome: card.titulo,
      preco: card.preco,
      quantidade: 1
    })

  }

  showSnackbarTopPosition(content:any, action:any) {
    this.snackBar.open(content, action, {
      duration: 2000,
      verticalPosition: "top", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}