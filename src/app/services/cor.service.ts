import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cor } from '../models/cor.model';

@Injectable({
  providedIn: 'root'
})
export class CorService {
  private baseUrl = 'http://localhost:8080/cor';

  

  constructor(private httpClient: HttpClient) {  }

  findAll(): Observable<Cor[]> {
    
    return this.httpClient.get<Cor[]>(`${this.baseUrl}/getAll`);
  }

  findById(id: string): Observable<Cor> {
    return this.httpClient.get<Cor>(`${this.baseUrl}/search/${id}`);
  }

  insert(cor: Cor): Observable<Cor> {

    return this.httpClient.post<Cor>(`${this.baseUrl}/insert/`, cor);
  }
  
  update(cor: Cor): Observable<Cor> {
    return this.httpClient.put<Cor>(`${this.baseUrl}/${cor.id}/update/`, cor);
  }

  delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
