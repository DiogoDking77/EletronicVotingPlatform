import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewCategoryService {
  private themeUrl = 'http://localhost:8090/api/theme/';
  private votingTypeUrl = 'http://localhost:8090/api/voting_type/';
  private votingUrl = 'http://localhost:8090/api/voting/';
  private categoryUrl = 'http://localhost:8090/api/category/';
  private getcategoryUrl = 'http://localhost:8090/api/category/{id}';
  private orderPointsUrl = 'http://localhost:8090/api/order_points';
  private phaseUrl = 'http://localhost:8090/api/phase';
  private getCategoryNoPhaseUrl = 'http://localhost:8090/api/voting/{id}/categories_no_phase';
  private voteOptionUrl = 'http://localhost:8090/api/vote_option'

  constructor(private http: HttpClient) {}

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

  getCategoryInformation(categoryId: string): Observable<any> {
    const url = this.getcategoryUrl.replace('{id}', categoryId);

    console.log(`Fetching category information for category ID ${categoryId}`);

    return this.http.get(url).pipe(
      tap((categoryInfo) => {
        console.log('Category information received:', categoryInfo);
      }),
      catchError((error) => {
        console.error('Error fetching category information', error);
        throw error;
      })
    );
  }

  createPhases(phases: any[], categoryId: string): Observable<any> {
    const phaseObservables: Observable<any>[] = [];

    for (const phase of phases) {


      let votingTypeId: string;
      let phaseId: string;
      console.log(phase.numberOfVotes)
      const votingTypeData = {
        type: phase.votingType,
        n_choices: phase.numberOfVotes,
      };

      if (votingTypeData.type == 'Simple Voting' || votingTypeData.n_choices <= 0) {
        votingTypeData.n_choices = 1; // Define automaticamente como 1
      }

      const votingTypeObservable = this.http.post(this.votingTypeUrl, votingTypeData).pipe(
        concatMap((votingTypeResponse: any) => {
          votingTypeId = votingTypeResponse.id;

          if (phase.votingType === 'Points Voting') {
            const orderPointsObservables: Observable<any>[] = [];

            for (let i = 0; i < phase.orderPoints.length; i++) {
              const orderPointsData = {
                position: i + 1,
                points: phase.orderPoints[i],
                votingType: votingTypeId,
              };

              const orderPointsObservable = this.http.post(this.orderPointsUrl, orderPointsData);
              orderPointsObservables.push(orderPointsObservable);
            }

            return forkJoin(orderPointsObservables).pipe(
              catchError((error) => {
                console.error('Error creating order points:', error);
                return of({ success: false, error });
              })
            );
          } else {
            return of(null);
          }
        }),
        concatMap(() => {
          const formattedOpeningDate = this.formatDate(new Date(phase.startDate));
          const formattedClosingDate = this.formatDate(new Date(phase.endDate));

          console.log(phases)
          const phaseData = {
            n_phase: phases.indexOf(phase) + 1,
            name: phase.name ? phase.name : `${phases.indexOf(phase) + 1}º Phase`,
            n_winners: phase.numberOfWinners,
            opening_date: formattedOpeningDate,
            closing_date: formattedClosingDate,
            privacy: phase.privacy,
            category: categoryId,
            votingType: votingTypeId,
          };

          return this.http.post(this.phaseUrl, phaseData).pipe(
            tap((phaseResponse: any) => {
              phaseId = phaseResponse.id;
            }),
            catchError((error) => {
              console.error('Error creating phase:', error);
              return of({ success: false, error });
            })
          );
        }),
        concatMap(() => {
          const voteOptionObservables: Observable<any>[] = [];

          for (const option of phase.optionContainer) {
            const voteOptionData = {
              name: option[0],
              information: option[1],
              phase: phaseId,
            };

            const voteOptionObservable = this.http.post(this.voteOptionUrl, voteOptionData).pipe(
              catchError((error) => {
                console.error('Error creating vote option:', error);
                return of({ success: false, error });
              })
            );
            voteOptionObservables.push(voteOptionObservable);
          }

          return forkJoin(voteOptionObservables);
        }),
        catchError((error) => {
          console.error('Error creating voting type or phase for phase:', error);
          return of({ success: false, error });
        }),
        map(() => {
          return { success: true };
        })
      );

      phaseObservables.push(votingTypeObservable);
    }

    return forkJoin(phaseObservables);
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
