import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl = 'http://localhost:8080/login';

  constructor(private httpClient: HttpClient) {  }

  findById(id: string): Observable<Login> {
    return this.httpClient.get<Login>(`${this.baseUrl}/${id}`);
  }

}
