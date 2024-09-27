// find-voting.component.ts

import { Component, OnInit } from '@angular/core';
import { FindVotingService } from './find-voting.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../session-storage.service';

@Component({
  selector: 'app-find-voting',
  templateUrl: './find-voting.component.html',
  styleUrls: ['./find-voting.component.css']
})
export class FindVotingComponent implements OnInit {
  votings: any[] = [];
  selectedVoting: any | null = null;
  userId: string | null = ""; // Substitua pelo método real de obtenção do ID do usuário

  constructor(
    private findVotingService: FindVotingService,
    private router: Router,
    private sessionStorageService: SessionStorageService // Injete o SessionStorageService
  ) {}

  ngOnInit(): void {
    this.loadVotings();

    // Obtendo e exibindo o e-mail do usuário no console
    this.userId = this.sessionStorageService.getUserUuid();
  }


  loadVotings(): void {
    switch (this.selectedTab) {
      case 'all':
        this.findVotingService.listVotings().subscribe(
          response => {
            this.handleVotingsResponse(response);
          },
          error => {
            console.error('Erro ao buscar votações no componente', error);
          }
        );
        break;
      case 'invited':
        this.findVotingService.listInvitedVotings(this.userId).subscribe(
          response => {
            const uniqueVotings = this.filterUniqueVotings(response);
            this.handleVotingsResponse(uniqueVotings);
          },
          error => {
            console.error('Erro ao buscar votações convidadas no componente', error);
          }
        );
        break;
      case 'owned':
        this.findVotingService.listOwnedVotings(this.userId).subscribe(
          response => {
            this.handleVotingsResponse(response);
          },
          error => {
            console.error('Erro ao buscar suas votações no componente', error);
          }
        );
        break;
      case 'voted':
        this.findVotingService.listVotedVotings(this.userId).subscribe(
          response => {
            this.handleVotingsResponse(response);
          },
          error => {
            console.error('Erro ao buscar votações no componente', error);
          }
        );
        break;
      default:
        break;
    }
  }

  filterUniqueVotings(votings: any[]): any[] {
    const uniqueVotingsMap = new Map<string, any>();

    // Filtra votações únicas com base no campo 'id'
    votings.forEach(voting => {
      uniqueVotingsMap.set(voting.id, voting);
    });

    // Converte o mapa de volta para um array
    const uniqueVotings = Array.from(uniqueVotingsMap.values());

    return uniqueVotings;
  }

  navigateToHome(): void {
    this.router.navigate(['/find-voting']);
  }

  navigateToCreateVotations(): void {
    this.router.navigate(['/new-voting']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void{
    this.sessionStorageService.clear();
    this.router.navigate(['/login']);
  }

  selectVoting(voting: any): void {
    this.selectedVoting = voting;
  }

  clearSelectedVoting(): void {
    this.selectedVoting = null;
  }

  onEnterClick(): void {
    this.router.navigate(['/voting', this.selectedVoting.id]);
  }

  handleVotingsResponse(response: any): void {
    if (Array.isArray(response)) {
      this.votings = response;
    } else if (response && Array.isArray(response.content)) {
      // Algumas APIs podem retornar a lista dentro de uma propriedade 'content'

    } else {
      console.error('A resposta da API não contém um array de votações:', response);
    }
  }

  formatarData(dataArray: number[]): string {
    if (dataArray && dataArray.length === 7) {
      const year = dataArray[0];
      const month = dataArray[1];
      const day = dataArray[2];
      const hour = dataArray[3];
      const minute = dataArray[4];

      // Crie uma string no formato desejado
      const formattedDate = `${year}/${month}/${day} ${hour}:${minute}`;

      return formattedDate;
    } else {
      console.error('Os dados da data não são válidos:', dataArray);
      return 'Data inválida';
    }
  }

  selectedTab: 'all' | 'invited' | 'owned' | 'voted' = 'all';

  setTab(tab: 'all' | 'invited' | 'owned' | 'voted'): void {
    this.selectedTab = tab;
    this.loadVotings();
  }

  getFilteredVotings(): any[] {
    // A lógica de filtragem será feita na função loadVotings
    return this.votings;
  }
}
