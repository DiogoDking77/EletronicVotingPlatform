import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, of, Observable, switchMap, throwError} from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ErrorPopupService } from "../error-popup.service";

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private userUrl = 'http://localhost:8090/api/user';
  private nationalitiesUrl = 'https://restcountries.com/v3.1/independent?status=true&fields=name';
  private allNationalitiesUrl = 'https://restcountries.com/v3.1/all';
  constructor(private http: HttpClient, private errorPopupService: ErrorPopupService) {}

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  register(name: string, genre: string, email: string, password: string, dateOfBirth: Date, nationality: string, firstPassword: string): Observable<any> {
    const start_date = this.formatDate(new Date(dateOfBirth));
    let userId: any;

    if (firstPassword !== password) {
      const passwordMismatchError = 'Passwords don\'t match.';
      this.handleError('Registration error', passwordMismatchError);
      return throwError(passwordMismatchError);
    }

    const userData = {
      name, genre, email, password, dateOfBirth, nationality
    };

    console.log('Enviando solicitação POST para criar user:', userData);

    return this.http.post(this.userUrl, userData).pipe(
      switchMap((response: any) => {
        console.log('Resposta da criação do user:', response);
        userId = response.id; // Captura o ID da votação
        return userId;
      }),
      catchError((error) => {
        const errorDetail = error.error?._embedded?.errors?.[0]?.message;

        // Remover "Internal Server Error: " da mensagem
        let cleanErrorMessage = errorDetail ? errorDetail.replace(/^Internal Server Error: /, '') : 'Unknown error';

        // Remover "entity.<...>: " da mensagem
        cleanErrorMessage = cleanErrorMessage.replace(/^entity\..+?: /, '');

        // Mostrar erro usando a função handleError
        this.handleError('Registration error', cleanErrorMessage || 'Unknown error');
        // Use throwError with both the original error and birthDateError
        throw error;
      })
    );
  }


  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  getAllNationalities(): Observable<any[]> {
    return this.http.get(this.allNationalitiesUrl).pipe(
      catchError((error) => {
        const cleanErrorMessage = 'Failed to fetch nationalities.';
        this.handleError('Nationalities Fetch Error', cleanErrorMessage);
        throw error;
      }),
      map((response: any) => {
        // Certifique-se de que a resposta é um array antes de tentar ordenar
        if (Array.isArray(response)) {
          // Organize as nacionalidades por a.demonyms.eng.m alfabeticamente
          return response.sort((a, b) => (a.demonyms?.eng?.m || '').localeCompare(b.demonyms?.eng?.m || ''));
        } else {
          throw new Error('Invalid response format');
        }
      })
    );
  }


  getNationalities(): Observable<any[]> {
    return this.getAllNationalities().pipe(
      tap((nationalities) => {
        console.log('Lista de nacionalidades:', nationalities);
      })
    );
  }

}

