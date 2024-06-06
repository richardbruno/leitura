import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagamento } from '../models/pagamento.model';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private baseUrl = 'http://localhost:8080/Pagamento';

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Pagamento[]> {

    return this.httpClient.get<Pagamento[]>(`${this.baseUrl}/getAll`);
  }

  findById(id: string): Observable<Pagamento> {
    return this.httpClient.get<Pagamento>(`${this.baseUrl}/search/${id}`);
  }

  insert(pagamento: Pagamento): Observable<Pagamento> {
    return this.httpClient.post<Pagamento>(`${this.baseUrl}/insert/`, pagamento);
  }
  
  update(pagamento: Pagamento): Observable<Pagamento> {
    return this.httpClient.put<Pagamento>(`${this.baseUrl}/update/${pagamento.id}`, pagamento);
  }

  delete(pagamento: Pagamento): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${pagamento.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
