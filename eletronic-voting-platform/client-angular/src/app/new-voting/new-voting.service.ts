import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {forkJoin, of, Observable, switchMap } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { ErrorPopupService } from "../error-popup.service";

@Injectable({
  providedIn: 'root',
})
export class NewVotingService {
  private themeUrl = 'http://localhost:8090/api/theme/ordered';
  private votingUrl = 'http://localhost:8090/api/voting/';
  private categoryUrl = 'http://localhost:8090/api/category/';
  private voting_typeUrl = 'http://localhost:8090/api/voting_type/';
  private phaseUrl = 'http://localhost:8090/api/phase/';
  private optionUrl = 'http://localhost:8090/api/vote_option/'

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

  createVoting(name: string, information: string, privacy: boolean, theme: string,
               owner: string | null, StartDate: Date, EndDate: Date, options: Array<string>): Observable<any> {
    if (owner === null) {
      console.error('userId é nulo.');
      return of([]); // ou outro valor padrão apropriado
    }

    const currentDate = new Date().toISOString();
    const start_date = this.formatDate(new Date(StartDate));
    const end_date = this.formatDate(new Date(EndDate));

    let categoryResponse: any;
    let phaseResponse: any;
    let votingId: any;

    const votingData = {
      name,
      information,
      creation_date: currentDate,
      theme,
      owner,
    };

    return this.http.post(this.votingUrl, votingData).pipe(
      switchMap((response: any) => {
        console.log('Resposta da criação da votação:', response);

        votingId = response.id; // Captura o ID da votação

        const categoryData = {
          name: response.name,
          information: response.information,
          voting: votingId,
        };

        console.log('Enviando solicitação POST para criar categoria:', categoryData);

        return this.http.post(this.categoryUrl, categoryData).pipe(
          tap((response) => {
            categoryResponse = response;
            console.log('Resposta da criação da categoria:', response);
          })
        );
      }),
      switchMap(() => {
        const votingTypeData = {
          n_choices: 1,
          type: "Simple Voting",
        };

        console.log('Enviando solicitação POST para criar voting_type:', votingTypeData);

        return this.http.post(this.voting_typeUrl, votingTypeData);
      }),
      switchMap((votingTypeResponse: any) => {
        console.log('Resposta da criação do voting_type:', votingTypeResponse);

        const phaseData = {
          n_phase: 1,
          name: "Fase 1",
          n_winners: 1,
          opening_date: start_date,
          closing_date: end_date,
          privacy,
          category: categoryResponse.id,
          votingType: votingTypeResponse.id,
        };

        console.log('Enviando solicitação POST para criar fase:', phaseData);

        return this.http.post(this.phaseUrl, phaseData).pipe(
          tap((response) => {
            phaseResponse = response;
            console.log('Resposta da criação da fase:', response);
          })
        );
      }),
      switchMap(() => {
        // Agora, itera sobre as opções e faz um POST para cada uma
        const optionRequests = options.map((optionName: string) => {
          const optionData = {
            name: optionName,
            information: '- NO DESCRIPTION -',
            phase: phaseResponse.id, // Utiliza o UUID da fase
          };

          console.log('Enviando solicitação POST para criar opção de voto:', optionData);

          return this.http.post(this.optionUrl, optionData);
        });

        // Use switchMap para combinar os resultados dos POSTs das opções
        return forkJoin(optionRequests).pipe(
          // Adiciona o ID da votação ao resultado final
          switchMap(() => of(votingId))
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
}

