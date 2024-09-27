import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, Observable, switchMap} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { ErrorPopupService } from "../error-popup.service";

@Injectable({
  providedIn: 'root',
})
export class NewAdvancedVotingService {
  private themeUrl = 'http://localhost:8090/api/theme/ordered';
  private votingUrl = 'http://localhost:8090/api/voting/';
  private categoryUrl = 'http://localhost:8090/api/category/';
  private getCategoryNoPhaseUrl = 'http://localhost:8090/api/voting/{id}/categories_no_phase';

  constructor(private http: HttpClient, private errorPopupService: ErrorPopupService) {}

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  theme(): Observable<any> {
    console.log('Chamando a função theme() no serviço');
    return this.http.get(this.themeUrl).pipe(
      tap((themes) => {
        console.log('Temas recebidos:', themes);
      }),
      catchError((error) => {
        console.error('Erro durante o login', error);
        throw error;
      })
    );
  }

  createVoting(name: string, information: string, privacy: boolean, theme: string, owner: string | null, StartDate: Date, EndDate: Date, categories: { name: string, information: any }[]): Observable<any> {
    const currentDate = new Date().toISOString();
    const start_date = this.formatDate(new Date(StartDate));
    const end_date = this.formatDate(new Date(EndDate));

    const votingData = {
      name,
      information,
      creation_date: currentDate,
      theme,
      owner,
    };

    console.log('Enviando solicitação POST para criar votação:', votingData);

    return this.http.post(this.votingUrl, votingData).pipe(
      switchMap((votingResponse: any) => {
        console.log('Resposta da criação da votação:', votingResponse);

        // Map the array of categories to an array of HTTP requests
        const categoryRequests = categories.map(category => {
          const categoryData = {
            name: category.name,
            information: category.information,
            voting: votingResponse.id, // Chave estrangeira da votação
          };

          console.log('Enviando solicitação POST para criar categoria:', categoryData);

          // Faz o post da categoria
          return this.http.post(this.categoryUrl, categoryData);
        });

        // Use forkJoin to wait for all categoryRequests to complete
        return forkJoin(categoryRequests).pipe(
          map(() => votingResponse) // Map to the original voting response
        );
      }),
      catchError((error) => {
        const errorDetail = error.error?._embedded?.errors?.[0]?.message;

        // Remover "Internal Server Error: " da mensagem
        let cleanErrorMessage = errorDetail ? errorDetail.replace(/^Internal Server Error: /, '') : 'Unknown error';

        // Remover "entity.<...>: " da mensagem
        cleanErrorMessage = cleanErrorMessage.replace(/^entity\..+?: /, '');

        // Mostrar erro usando a função handleError
        this.handleError('Error creating voting.', cleanErrorMessage || 'Unknown error');
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


  getCategoryIdsWithoutPhase(votingId: string): Observable<string[]> {
    const url = this.getCategoryNoPhaseUrl.replace('{id}', votingId);

    console.log(`Fetching category IDs without phase for voting ID ${votingId}`);

    return this.http.get<string[]>(url).pipe(
      tap((categoryIds) => {
        console.log('Category IDs without phase received:', categoryIds);
      }),
      catchError((error) => {
        console.error('Error while fetching category IDs without phase', error);
        throw error;
      })
    );
  }

}

