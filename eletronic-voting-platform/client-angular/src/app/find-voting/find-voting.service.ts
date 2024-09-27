// Criar uma interface para representar a estrutura da resposta da API
interface VotingApiResponse {
  id: string;
  name: string;
  information: string;
  creationDate: number[];
  theme: {
    id: string;
    theme: string;
  };
  owner: {
    id: string;
    name: string;
    genre: string;
    dateOfBirth: number[];
    nationality: string;
    email: string;
    password: string;
    creationDate: number[];
    userRole: string;
  };
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FindVotingService {
  private votingUrl = 'http://localhost:8090/api/user/allvotings';
  private invitedVotingUrl = 'http://localhost:8090/api/user/{id}/invitedvotingsphases';
  private ownedVotingUrl = 'http://localhost:8090/api/user/{userId}/ownervotings';
  private votedVotingUrl = 'http://localhost:8090/api/user/{id}/votingsvoted';

  constructor(private http: HttpClient) { }

  listVotings(): Observable<VotingApiResponse[]> {
    return this.http.get<any>(this.votingUrl)
      .pipe(
        map(response => response as VotingApiResponse[])
      );
  }

  listInvitedVotings(userId: string | null): Observable<VotingApiResponse[]> {
    if (userId === null) {
      // Se userId for nulo, você pode tomar alguma ação apropriada,
      // como retornar um Observable vazio ou lidar de outra forma.
      console.error('userId é nulo.');
      return of([]); // ou outra ação apropriada
    }

    const url = this.invitedVotingUrl.replace('{id}', userId);
    return this.http.get<any>(url)
      .pipe(
        map(response => response as VotingApiResponse[])
      );
  }

  listOwnedVotings(userId: string | null): Observable<VotingApiResponse[]> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of([]);
    }

    const url = this.ownedVotingUrl.replace('{userId}', userId);
    return this.http.get<any>(url)
      .pipe(
        map(response => response as VotingApiResponse[])
      );
  }

  listVotedVotings(userId: string | null): Observable<VotingApiResponse[]> {
    if (userId === null) {
      console.error('userId é nulo.');
      return of([]);
    }

    const url = this.votedVotingUrl.replace('{id}', userId);
    return this.http.get<any>(url)
      .pipe(
        map(response => response as VotingApiResponse[])
      );
  }

}


