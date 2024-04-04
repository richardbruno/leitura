import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = 'http://localhost:8080/livro';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Livro[]>(`${this.baseUrl}`, {params});
  }

  findById(id: string): Observable<Livro> {
    return this.httpClient.get<Livro>(`${this.baseUrl}/${id}`);
  }

  insert(livro: Livro): Observable<Livro> {
    return this.httpClient.post<Livro>(this.baseUrl, livro);
  }
  
  update(livro: Livro): Observable<Livro> {
    return this.httpClient.put<Livro>(`${this.baseUrl}/${livro.id}`, livro);
  }

  delete(livro: Livro): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${livro.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
