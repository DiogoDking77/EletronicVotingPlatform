import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginUrl = 'http://localhost:8090/api/user/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginDTO = { email: email, password: password };

    return this.http.post(this.loginUrl, loginDTO).pipe(
      catchError((error) => {
        console.error('Erro durante o login', error);
        throw error;
      })
    );
  }
}

