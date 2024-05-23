import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consulta } from '../models/consulta.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  private baseUrl = 'http://localhost:8080/consultas';

  constructor(private http: HttpClient) { }

  findAll(pagina: number, tamanhoPagina: number): Observable<Consulta[]> {
    const params = {
      page: pagina.toString(),
      pageSize: tamanhoPagina.toString()
    }
    return this.http.get<Consulta[]>(`${this.baseUrl}`, { params });
  }

  findById(id: string): Observable<Consulta> {
    return this.http.get<Consulta>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string, pagina: number, tamanhoPagina: number): Observable<Consulta[]> {
    const params = {
      page: pagina.toString(),
      pageSize: tamanhoPagina.toString()
    }
    return this.http.get<Consulta[]>(`${this.baseUrl}/search/${nome}`, { params });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/search/${nome}/count`);
  }

}
