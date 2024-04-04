import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from '../models/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private baseUrl = 'http://localhost:8080/autor';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Autor[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Autor[]>(`${this.baseUrl}/getAll/`, {params});
  }

  findById(id: string): Observable<Autor> {
    return this.httpClient.get<Autor>(`${this.baseUrl}/search/${id}`);
  }

  insert(autor: Autor): Observable<Autor> {
    return this.httpClient.post<Autor>(`${this.baseUrl}/insert/`, autor);
  }
  
  update(autor: Autor): Observable<Autor> {
    return this.httpClient.put<Autor>(`${this.baseUrl}/update/${autor.id}`, autor);
  }

  delete(autor: Autor): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${autor.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
