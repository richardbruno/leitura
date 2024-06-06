import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, signal} from '@angular/core';
import { ItemCarrinho } from '../../models/itemcarrinho.model';
import { CarrinhoService } from '../../services/carrinho.service';
import { MatCard, MatCardActions, MatCardContent, MatCardFooter, MatCardTitle,} from '@angular/material/card';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

type Card = {
  idConsulta: number;
  titulo: string;
  preco: number;
  urlImagem: string;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [NgFor, NgIf, MatCard, MatCardActions, MatCardContent, MatCardTitle, MatCardFooter, MatButton, MatSelectModule, MatSelect,RouterModule],
  templateUrl: './carrinho.component.html',
  styleUrl: './carrinho.component.css'
})
export class CarrinhoComponent implements OnInit {

  cards = signal<Card[]> ([]);
  carrinhoItens: ItemCarrinho[] = [];
  selectedPage: string = '';

  constructor(private carrinhoService: CarrinhoService,
              private router: Router,
  ) { }

  ngOnInit(): void {
    this.carrinhoService.carrinho$.subscribe( itens => {
      this.carrinhoItens = itens;
    })
  }

  navigate() {
    if (this.selectedPage) {
      this.router.navigate([this.selectedPage]);
    }
  }

  removerItem(item: ItemCarrinho): void {
    const index = this.carrinhoItens.indexOf(item);
    if (index !== -1) {
      if (this.carrinhoItens[index].quantidade > 1) {
        this.carrinhoItens[index].quantidade--;
      } else {
        this.carrinhoItens.splice(index, 1);
      }
    }
  }

  finalizarCompra(): void {

  }

  calcularTotal(): number {
    return this.carrinhoItens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

}