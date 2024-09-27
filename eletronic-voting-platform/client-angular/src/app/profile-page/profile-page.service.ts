import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {catchError, map} from "rxjs/operators";
import { ErrorPopupService } from "../error-popup.service";

@Injectable({
  providedIn: 'root'
})
export class ProfilePageService {
  private getUserByIdUrl = 'http://localhost:8090/api/user/';

  private updateUserByIdUrl = 'http://localhost:8090/api/user/';

  private nationalitiesUrl = 'https://restcountries.com/v3.1/independent?status=true&fields=name';
  private allNationalitiesUrl = 'https://restcountries.com/v3.1/all';

  constructor(private http: HttpClient, private errorPopupService: ErrorPopupService) { }

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  getUserById(userId: string): Observable<any> {
    const url = `${this.getUserByIdUrl}${userId}`;
    return this.http.get(url);
  }

  updateUserProfile(userId: string | null, updatedProfileData: any): Observable<any> {
    const url = `${this.updateUserByIdUrl}${userId}`;
    return this.http.patch(url, updatedProfileData);
  }

  updateUserPassword(userId: string | null, firstPassword: string): Observable<any> {
    const url = `${this.updateUserByIdUrl}${userId}`;
    return this.http.patch(url, { password: firstPassword });
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



}
