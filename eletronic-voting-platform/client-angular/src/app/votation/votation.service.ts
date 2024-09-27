import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VotationService {
  private votingUrl = 'http://localhost:8090/api/voting/';
  private findCategoriesUrl = 'http://localhost:8090/api/category/findByVotingId/{votingId}';
  private findPhaseUrl = 'http://localhost:8090/api/phase/findByCategoryId/{categoryId}';

  private postVoteUrl = 'http://localhost:8090/api/vote_vote_option';
  private GetVoteInviteUrl = 'http://localhost:8090/api/vote_invite/findByUserId/{userId}/{phaseId}';
  private EnterUserInVotingUrl = 'http://localhost:8090/api/vote_invite/create-invites/{userId}/{votingId}';
  private EnterOwnerInVotingUrl = 'http://localhost:8090/api/vote_invite/create-invites-owner/{userId}/{votingId}';
  private VoteablePhasesIds = 'http://localhost:8090/api/phase/phases-user-vote/{votingId}/{userId}'
  private UserAlreadyVotedUrl = 'http://localhost:8090/api/vote_vote_option/find-by-user-and-phase/{userId}/{phaseId}'
  private GetUsersUrl = 'http://localhost:8090/api/user/';
  private DeleteVoteUrl = 'http://localhost:8090/api/vote_vote_option/byInvited/{voteInviteId}';
  private GetVoteUrl = 'http://localhost:8090/api/vote_vote_option/{id}'
  private UpdateVoteDateUrl = 'http://localhost:8090/api/vote_invite/{id}'
  private baseUrl = 'http://localhost:8090/api';
  private classifyOptionsUrl = 'http://localhost:8090/api/vote_option/classify-options/{phaseId}';
  private classifyOptionsPointsUrl = 'http://localhost:8090/api/vote_option/classify-options-points/{phaseId}';

  constructor(private http: HttpClient) {}
  getVotingById(votingId: string): Observable<any> {
    const votingDetailsUrl = `${this.votingUrl}${votingId}/`;

    console.log('Chamando a função getVotingById() no serviço');

    return this.http.get(votingDetailsUrl).pipe(
      tap((votingDetails) => {
        console.log('Detalhes da votação recebidos:', votingDetails);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção dos detalhes da votação', error);
        throw error;
      })
    );
  }

  getCategoriesByVotingId(votingId: string): Observable<any> {
    const categoriesUrl = `${this.findCategoriesUrl.replace('{votingId}', votingId)}`;

    console.log('Chamando a função getCategoriesByVotingId() no serviço');

    return this.http.get(categoriesUrl, { params: { votingId } }).pipe(
      tap((categories) => {
        console.log('Categorias recebidas:', categories);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção das categorias', error);
        throw error;
      })
    );
  }

  getPhasesByCategoryId(categoryId: string): Observable<any[]> {
    const phasesUrl = `${this.findPhaseUrl.replace('{categoryId}', categoryId)}`;

    console.log('Chamando a função getPhasesByCategoryId() no serviço');

    return this.http.get(phasesUrl).pipe(
      map((phases: any) => {
        // Ensure that 'phases' is an array
        if (Array.isArray(phases)) {
          // Filter out undefined elements
          const filteredPhases = phases.filter(phase => phase !== undefined);

          // Sort the filtered phases by n_phase
          const sortedPhases = filteredPhases.sort((a, b) => a.n_phase - b.n_phase);

          return sortedPhases;
        } else {
          // If 'phases' is not an array, log an error and return an empty array
          console.error('Invalid data received from the server:', phases);
          return phases;
        }
      }),
      tap((sortedPhases: any[]) => {
        console.log('Fases ordenadas por n_phase:', sortedPhases);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção das fases', error);
        throw error;
      })
    ) as Observable<any[]>; // Converter o tipo do Observable
  }


  private findVoteOptionUrl = 'http://localhost:8090/api/vote_option/findByPhaseId/{phaseId}';
  getVoteOptionsByPhaseId(phaseId: string): Observable<any[]> {
    const voteOptionsUrl = `${this.findVoteOptionUrl.replace('{phaseId}', phaseId)}`;

    console.log('Chamando a função getVoteOptionsByPhaseId() no serviço');

    return this.http.get(voteOptionsUrl).pipe(
      tap((voteOptions: any) => {
        console.log('Opções de voto recebidas:', voteOptions);

      }),
      catchError((error) => {
        console.error('Erro durante a obtenção das opções de voto', error);
        throw error;
      })
    ) as Observable<any[]>; // Converter o tipo do Observable
  }

  getVoterInvitationByUserId(userId: string | null, phaseId: string): Observable<any | null> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of(null);
    }

    const voterInvitationUrl = `${this.GetVoteInviteUrl.replace('{userId}', userId).replace('{phaseId}', phaseId)}`;

    console.log(`Chamando a função getVoterInvitationByUserId() no serviço para o usuário com ID ${userId} e fase com ID ${phaseId}`);

    return this.http.get<any>(voterInvitationUrl).pipe(
      tap((response) => {
        console.log('Resposta do convite do eleitor recebido:', response[0].id);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção do convite do eleitor:', error);
        throw error;
      })
    );
  }



  // ...

  enterUserInVoting(userId: string | null, votingId: string): Observable<any> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of([]); // ou outro valor padrão apropriado
    }
    const enterUserUrl = `${this.EnterUserInVotingUrl.replace('{userId}', userId).replace('{votingId}', votingId)}`;
    console.log(`Chamando a função enterUserInVoting() no serviço para o usuário com ID ${userId} e votação com ID ${votingId}`);
    return this.http.post(enterUserUrl, {}).pipe(
      tap((response) => {
        console.log('Usuário entrou na votação com sucesso:', response);
      }),
      catchError((error) => {
        console.error('Erro ao entrar o usuário na votação:', error);
        throw error;
      })
    );
  }

  enterOwnerInVoting(userId: string | null, votingId: string): Observable<any> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of([]); // ou outro valor padrão apropriado
    }
    const enterUserUrl = `${this.EnterOwnerInVotingUrl.replace('{userId}', userId).replace('{votingId}', votingId)}`;
    console.log(`Chamando a função enterUserInVoting() no serviço para o usuário com ID ${userId} e votação com ID ${votingId}`);
    return this.http.post(enterUserUrl, {}).pipe(
      tap((response) => {
        console.log('Usuário entrou na votação com sucesso:', response);
      }),
      catchError((error) => {
        console.error('Erro ao entrar o usuário na votação:', error);
        throw error;
      })
    );
  }


  getVoteablePhasesForUser(votingId: string, userId: string | null): Observable<any[]> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of([]); // ou outro valor padrão apropriado
    }

    const voteablePhasesUrl = `${this.VoteablePhasesIds.replace('{votingId}', votingId).replace('{userId}', userId)}`;

    console.log(`Chamando a função getVoteablePhasesForUser() no serviço para o usuário com ID ${userId} e votação com ID ${votingId}`);

    return this.http.get<any[]>(voteablePhasesUrl).pipe(
      tap((phasesData) => {
        console.log('Fases votáveis recebidas:', phasesData);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção das fases votáveis:', error);
        throw error;
      })
    );
  }


  canUserVoteInPhase(userId: string | null, phaseId: string): Observable<any[]> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of([]);
    }

    const userAlreadyVotedUrl = `${this.UserAlreadyVotedUrl.replace('{userId}', userId).replace('{phaseId}', phaseId)}`;

    console.log(`Chamando a função canUserVoteInPhase() no serviço para o usuário com ID ${userId} e fase com ID ${phaseId}`);

    return this.http.get<any[]>(userAlreadyVotedUrl).pipe(
      tap((response) => {
        console.log(response);

        if (response && response.length > 0) {
          console.log('O usuário já votou nesta fase.');
        } else {
          console.log('O usuário pode votar nesta fase.');
        }
      }),
      catchError((error) => {
        console.error('Erro ao verificar se o usuário pode votar na fase:', error);
        throw error;
      })
    );
  }

  getAllUsers(): Observable<any[]> {
    console.log('Chamando a função getAllUsers() no serviço');

    return this.http.get<any[]>(this.GetUsersUrl).pipe(
      tap((users) => {

      }),
      catchError((error) => {
        console.error('Erro durante a obtenção dos usuários', error);
        throw error;
      })
    );
  }

  postVote(position: number, voteInviteId: string, voteOptionId: string | null): Observable<any> {
    const postVoteData = {
      position,
      voteInvite: voteInviteId,
      voteOption: voteOptionId
    };

    return this.http.post(this.postVoteUrl, postVoteData).pipe(
      tap((response) => {
        console.log('Voto postado com sucesso:', response);
      }),
      catchError((error) => {
        console.error('Erro ao postar voto:', error);
        throw error;
      })
    );
  }

  deleteVote(voteInviteId: string | null): Observable<void> {
    if (voteInviteId === null) {
      console.error('voteInviteId é nulo.');
      return of(); // Retorna um Observable vazio para indicar que não há valor
    }

    const deleteVoteUrl = `${this.DeleteVoteUrl.replace('{voteInviteId}', voteInviteId)}`;

    console.log(`Chamando a função deleteVote() no serviço para o voto com ID ${voteInviteId}`);

    return this.http.delete<void>(deleteVoteUrl).pipe(
      tap(() => {
        console.log('Voto excluído com sucesso');
        // Adicione qualquer comportamento adicional desejado para o sucesso da deleção
      }),
      catchError((error) => {
        // Verifica se o erro é relacionado à falta de resposta (status 204)
        if (error.status === 204) {
          console.log('Voto excluído com sucesso');
          return of(); // Retorna um Observable vazio para indicar que não há valor
        } else {
          console.error('Erro ao excluir o voto:', error);
          throw error;
        }
      })
    );
  }


  getVoteById(voteId: string): Observable<any> {
    const voteUrl = `${this.GetVoteUrl.replace('{id}', voteId)}`;

    console.log(`Chamando a função getVoteById() no serviço para o voto com ID ${voteId}`);

    return this.http.get(voteUrl).pipe(
      tap((voteDetails) => {

      }),
      catchError((error) => {
        console.error('Erro durante a obtenção dos detalhes do voto', error);
        throw error;
      })
    );
  }

  updateVoteDate(voteInviteId: string): Observable<void> {
    const updateVoteDateUrl = `${this.UpdateVoteDateUrl.replace('{id}', voteInviteId)}`;

    // Obter a data atual no formato ISO8601
    const newVoteDate = new Date().toISOString();

    const patchData = { vote_date: newVoteDate };

    return this.http.patch<void>(updateVoteDateUrl, patchData).pipe(
      tap(() => {
        console.log(`Vote date atualizada com sucesso para o vote_invite com ID ${voteInviteId}`);
      }),
      catchError((error) => {
        console.error('Erro durante a atualização da vote_date do vote_invite:', error);
        throw error;
      })
    );
  }

  getResults(phaseId: string): Observable<any> {
    const url = `${this.baseUrl}/phase/showStatistics/${phaseId}`;
    //const url = `${this.baseUrl}/phase/showStatistics/31716cbf-7cf6-4ad4-bfa6-40ff109ed5d8`;
    return this.http.get<any>(url);
  }

  getResultsPoints(phaseId: string): Observable<any> {
    const url = `${this.baseUrl}/phase/showStatisticsInPoints/${phaseId}`;
    //const url = `${this.baseUrl}/phase/showStatisticsInPoints/0019c2bd-ce26-4db3-9526-cfd804623326`;
    return this.http.get<any>(url);
  }

  classifyOptions(phaseId: string): Observable<any> {
    const classifyOptionsUrl = `${this.classifyOptionsUrl.replace('{phaseId}', phaseId)}`;

    console.log(`Chamando a função classifyOptions() no serviço para a fase com ID ${phaseId}`);

    return this.http.post<any>(classifyOptionsUrl, {}).pipe(
      tap((classificationData) => {
        console.log('Classificação das opções de voto recebida:', classificationData);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção da classificação das opções de voto:', error);
        throw error;
      })
    );
  }

  classifyOptionsPoints(phaseId: string): Observable<any> {
    const classifyOptionsPointsUrl = `${this.classifyOptionsPointsUrl.replace('{phaseId}', phaseId)}`;

    console.log(`Chamando a função classifyOptionsPoints() no serviço para a fase com ID ${phaseId}`);

    return this.http.post<any>(classifyOptionsPointsUrl, {}).pipe(
      tap((classificationPointsData) => {
        console.log('Classificação das opções de voto em pontos recebida:', classificationPointsData);
      }),
      catchError((error) => {
        console.error('Erro durante a obtenção da classificação das opções de voto em pontos:', error);
        throw error;
      })
    );
  }


}
