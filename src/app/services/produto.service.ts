import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/Produto';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Produto[]> {

    return this.httpClient.get<Produto[]>(`${this.baseUrl}/getAll`);
  }

  findById(id: string): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.baseUrl}/search/${id}`);
  }

  insert(produto: Produto): Observable<Produto> {
    return this.httpClient.post<Produto>(`${this.baseUrl}/insert/`, produto);
  }
  
  update(produto: Produto): Observable<Produto> {
    return this.httpClient.put<Produto>(`${this.baseUrl}/update/${produto.id}`, produto);
  }

  delete(produto: Produto): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${produto.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
