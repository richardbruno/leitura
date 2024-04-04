import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/usuario';

  constructor(private httpClient: HttpClient) {  }

  findAll(page?: number, pageSize?: number): Observable<Usuario[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Usuario[]>(`${this.baseUrl}/getAll/`, {params});
  }

  findById(id: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.baseUrl}/search/${id}`);
  }

  insert(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.baseUrl}/insert/`, usuario);
  }
  
  update(usuario: Usuario): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.baseUrl}/update/${usuario.id}`, usuario);
  }

  delete(usuario: Usuario): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/DeleteForId/${usuario.id}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
}
