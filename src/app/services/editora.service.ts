import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Editora } from '../models/editora.model';

@Injectable({
  providedIn: 'root'
})
export class EditoraService {
  private baseUrl = 'http://localhost:8080/editora';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Editora[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Editora[]>(`${this.baseUrl}`, {params});
  }

  findById(id: string): Observable<Editora> {
    return this.httpClient.get<Editora>(`${this.baseUrl}/${id}`);
  }

  insert(editora: Editora): Observable<Editora> {
    return this.httpClient.post<Editora>(this.baseUrl, editora);
  }
  
  update(editora: Editora): Observable<Editora> {
    return this.httpClient.put<Editora>(`${this.baseUrl}/${editora.id}`, editora);
  }

  delete(editora: Editora): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${editora.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
