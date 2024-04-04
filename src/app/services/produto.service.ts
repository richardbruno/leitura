import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/produto';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Produto[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Produto[]>(`${this.baseUrl}`, {params});
  }

  findById(id: string): Observable<Produto> {
    return this.httpClient.get<Produto>(`${this.baseUrl}/${id}`);
  }

  insert(produto: Produto): Observable<Produto> {
    return this.httpClient.post<Produto>(this.baseUrl, produto);
  }
  
  update(produto: Produto): Observable<Produto> {
    return this.httpClient.put<Produto>(`${this.baseUrl}/${produto.id}`, produto);
  }

  delete(produto: Produto): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${produto.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
