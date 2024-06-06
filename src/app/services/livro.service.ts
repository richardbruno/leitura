import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = 'http://localhost:8080/Livro';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Livro[]> {

    return this.httpClient.get<Livro[]>(`${this.baseUrl}/getAll`);
  }

  getImage(nomeImagem: string): Observable<Blob> {
    return this.httpClient.get(`${this.baseUrl}/image/download/${nomeImagem}`, { responseType: 'blob' });
  }

  findById(id: string): Observable<Livro> {
    return this.httpClient.get<Livro>(`${this.baseUrl}/search/${id}`);
  }

  insert(livro: Livro): Observable<Livro> {
    return this.httpClient.post<Livro>(`${this.baseUrl}/insert/`, livro);
  }
  
  update(livro: Livro): Observable<Livro> {
    return this.httpClient.put<Livro>(`${this.baseUrl}/update/${livro.id}`, livro);
  }

  delete(livro: Livro): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${livro.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
