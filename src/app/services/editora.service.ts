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

  findAll(): Observable<Editora[]> {
    

    return this.httpClient.get<Editora[]>(`${this.baseUrl}/getAll`);
  }

  findById(id: string): Observable<Editora> {
    return this.httpClient.get<Editora>(`${this.baseUrl}/search/${id}`);
  }

  insert(editora: Editora): Observable<Editora> {
    return this.httpClient.post<Editora>(`${this.baseUrl}/insert/`, editora);
  }
  
  update(editora: Editora): Observable<Editora> {
    return this.httpClient.put<Editora>(`${this.baseUrl}/${editora.id}/update/`, editora);
  }

  delete(editora: Editora): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${editora.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
