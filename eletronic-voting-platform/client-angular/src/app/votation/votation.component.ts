import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VotationService } from './votation.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { SessionStorageService } from '../session-storage.service';
import { ErrorPopupService } from "../error-popup.service";
import { InvitePopupService } from "../invite-popup.service";
import { DomSanitizer,SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-votation',
  templateUrl: './votation.component.html',
  styleUrls: ['./votation.component.css'],
  animations: [
    trigger('fadeCardContentAnimation', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0, height: '0' })),
      transition('visible <=> hidden', animate('1000ms ease-in-out'))
    ]),
    trigger('fadeDescriptionAnimation', [
      state('visible', style({ opacity: 1, height: '*' })),
      state('hidden', style({ opacity: 0, height: '0' })),
      transition('visible <=> hidden', animate('1000ms ease-in-out'))
    ])
  ]
})
export class VotationComponent implements OnInit {
  votingDetails: any;
  themeName: any;
  UserDetails: any;
  categories: any[] = [];
  userId: string | null = '';

  @ViewChild('infoIcon') infoIcon!: ElementRef;

  cardContentState = 'visible';
  descriptionState = 'hidden';
  contentVisible = true;
  categoriaSelecionada: string = '';
  IdCategoriaSelecionada: string = '';
  phases: any[] = [];
  currentPhaseIndex: number = 0;
  currentPhase: any;
  voteOptions: any[] = [];
  displayPhase: any;
  displayedPhaseIndex: number = 0;
  showPreviousButton: boolean = false;
  showNextButton: boolean = false;
  selectedCategory: any;
  isOptionDisabled: { [key: string]: boolean } = {};
  invitation_id: any;
  selectedVoteOptionId: string | null = null;
  VoteablePhases: any[] = [];
  results: any[] = [];
  resultsInPoints: any[] = []
  isOwner = false;
  canInvite = false;


  constructor(
    private votingService: VotationService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private errorPopupService: ErrorPopupService,
    private invitePopupService: InvitePopupService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.userId = this.sessionStorageService.getUserUuid();


    this.route.params.subscribe(params => {
      const votingId = params['id'];
      this.votingService.getVotingById(votingId).subscribe(
        (details) => {
          this.votingDetails = details;
          this.themeName = this.votingDetails.theme;
          this.UserDetails = this.votingDetails.owner;

          this.getVoteablePhasesForCurrentUser(this.userId,votingId);

          this.loadCategories(votingId);
          if(this.userId==this.UserDetails.id){
            this.EnterOwnerInVoting(this.userId, votingId)
          }
          else{
            this.EnterUserInVoting(this.userId, votingId);
          }

          // Chame a função para obter o ID do voter_invitation

          // Executa a função getVoteablePhasesForUser no final do ngOnInit

        },
        (error) => {
          console.error('Erro ao obter detalhes da votação:', error);
        }
      );


      console.log('user id:',this.votingDetails.owner.id);

    });

    if(this.userId==this.UserDetails.id){
      this.isOwner = true;
      this.canInvite = true;

    } else {
      this.isOwner = false;
      this.canInvite = false;
    }
  }

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  EnterUserInVoting(userId: string | null, votingId: string): void {
    this.votingService.enterUserInVoting(userId, votingId).subscribe(
      (VoteablePhases) => {
        // Atribua à variável global
        this.VoteablePhases = VoteablePhases;
        console.log('Fases votáveis recebidas no componente:', this.VoteablePhases);

        // Faça o que precisar com as fases votáveis recebidas
        // ...
      },
      (error) => {
        // Lide com o erro, se necessário
        console.error('Erro ao obter fases votáveis no componente:', error);
      }
    );
  }

  EnterOwnerInVoting(userId: string | null, votingId: string): void {
    this.votingService.enterOwnerInVoting(userId, votingId).subscribe(
      (VoteablePhases) => {
        // Atribua à variável global
        this.VoteablePhases = VoteablePhases;
        console.log('Fases votáveis recebidas no componente:', this.VoteablePhases);

        // Faça o que precisar com as fases votáveis recebidas
        // ...
      },
      (error) => {
        // Lide com o erro, se necessário
        console.error('Erro ao obter fases votáveis no componente:', error);
      }
    );
  }

  VoteablePhaseIds: any[] = []
  getVoteablePhasesForCurrentUser(userId: string | null, votingId: string): void {

    this.votingService.getVoteablePhasesForUser(votingId, userId).subscribe(
      (phasesData) => {
        this.VoteablePhaseIds = phasesData;
        // Faça o que for necessário com as fases votáveis recebidas
        console.log('Fases votáveis recebidas para o usuário:', phasesData);
      },
      (error) => {
        console.error('Erro ao obter fases votáveis para o usuário:', error);
      }
    );
  }


  toggleContentVisibility(): void {
    this.contentVisible = !this.contentVisible;
    if (!this.contentVisible) {
      this.cardContentState = 'hidden';
      this.descriptionState = 'hidden';
    } else {
      this.cardContentState = 'visible';
      this.descriptionState = 'hidden';
    }
  }

  loadCategories(votingId: string): void {
    this.votingService.getCategoriesByVotingId(votingId).subscribe(
      (categories) => {
        this.categories = categories;

        // Se houver categorias e fases, inicialize com a fase mais próxima
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
          this.loadPhases(this.selectedCategory);
        }
      },
      (error) => {
        console.error('Erro ao obter categorias:', error);
      }
    );
  }


  navigateToRecurrentPhase(): void {
    this.displayedPhaseIndex = this.currentPhaseIndex;

    this.loadVoteOptions(this.phases[this.displayedPhaseIndex].id)
  }

  navigateToPreviousPhase(): void {
    if (this.displayedPhaseIndex > 0){
      this.displayedPhaseIndex -= 1
    }

    if (this.displayedPhaseIndex == 0){
      this.showPreviousButton = false;
    }
    else{
      this.showPreviousButton = true;
    }
    if (this.displayedPhaseIndex == this.phases.length - 1){
      this.showNextButton = false;
    }
    else{
      this.showNextButton = true;
    }
    this.loadVoteOptions(this.phases[this.displayedPhaseIndex].id)
  }

  navigateToNextPhase(): void {
    if (this.displayedPhaseIndex < this.phases.length - 1) {
      this.displayedPhaseIndex += 1;
    }

    if (this.displayedPhaseIndex == this.phases.length - 1){
      this.showNextButton = false;
    }
    else{
      this.showNextButton = true;
    }
    if (this.displayedPhaseIndex == 0){
      this.showPreviousButton = false;
    }
    else{
      this.showPreviousButton = true;
    }
    this.loadVoteOptions(this.phases[this.displayedPhaseIndex].id)
  }

  faseParaExibir: any = null;
  loadPhases(categoria: any) {
    this.categoriaSelecionada = categoria.name;
    this.IdCategoriaSelecionada = categoria.id;

    // Call your service to get the phases of the selected category
    this.votingService.getPhasesByCategoryId(categoria.id).subscribe(
      (fases) => {
        this.phases = fases;

        if (this.phases && this.phases.length > 0) {
          const now = new Date();
          this.faseParaExibir = null;

          this.phases.forEach((fase) => {
            // Verificar se a fase ocorreu antes do momento atual
            const openingDate = new Date(fase.openingDate[0], fase.openingDate[1] - 1, fase.openingDate[2], fase.openingDate[3], fase.openingDate[4]);
            console.log(openingDate);

            if (openingDate <= now) {
              if (!this.faseParaExibir || openingDate > new Date(this.faseParaExibir.openingDate[0], this.faseParaExibir.openingDate[1] - 1, this.faseParaExibir.openingDate[2], this.faseParaExibir.openingDate[3], this.faseParaExibir.openingDate[4])) {
                this.faseParaExibir = fase;
              }
            }
            console.log('Esta é a fase para exibir',this.faseParaExibir);
          });

          console.log('Esta é a fase para exibir',this.faseParaExibir);
          // If no phase is occurring, display the first phase from the list
          if (!this.faseParaExibir) {
            this.faseParaExibir = this.phases[0];
          }
          console.log('Esta é a fase para exibir',this.faseParaExibir);

          // Rest of your code...

          this.currentPhase = this.faseParaExibir;
          this.displayPhase = this.currentPhase;

          this.currentPhaseIndex = this.phases.indexOf(this.currentPhase);
          if (this.currentPhaseIndex != 0) {
            this.displayedPhaseIndex = this.currentPhaseIndex ;
            this.currentPhaseIndex = this.currentPhaseIndex ;
          } else {
            this.displayedPhaseIndex = 0;
            this.currentPhaseIndex = 0;
          }

          if (this.displayedPhaseIndex == this.phases.length - 1) {
            this.showNextButton = false;
          } else {
            this.showNextButton = true;
          }

          if (this.displayedPhaseIndex == 0) {
            this.showPreviousButton = false;
          } else {
            this.showPreviousButton = true;
          }

          this.loadVoteOptions(this.phases[this.displayedPhaseIndex].id);
        }
      },
      (error) => {
        console.error('Erro ao obter fases:', error);
      }
    );
  }



  formatarData(dataArray: number[]): string {
    if (dataArray && dataArray.length === 5) {
      const year = dataArray[0];
      const month = dataArray[1];
      const day = dataArray[2];
      const hour = dataArray[3];
      const minute = dataArray[4];

      // Crie um objeto de data
      const dateObject = new Date(year, month - 1, day, hour, minute);

      // Obtenha as partes da data/formato desejado
      const formattedDate = `${dateObject.getFullYear()}/${this.padZero(dateObject.getMonth() + 1)}/${this.padZero(dateObject.getDate())} ${this.padZero(dateObject.getHours())}:${this.padZero(dateObject.getMinutes())}`;

      return formattedDate;
    } else {
      console.error('Os dados da data não são válidos:', dataArray);
      return 'Data inválida';
    }
  }

  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getResultsData(phaseId: string): void {
    this.votingService.getResults(phaseId).subscribe(
      (data) => {
        this.results = data;
      },
      (error) => {
        console.error('Error fetching results:', error);
      }
    );
  }

  getResultsDataInPoints(phaseId: string): void {
    this.votingService.getResultsPoints(phaseId).subscribe(
      (data) => {
        this.resultsInPoints = data;
      },
      (error) => {
        console.error('Error fetching results:', error);
      }
    );
  }

  isInvited = true;

  loadVoteOptions(phaseId: string): void {
    if (this.phases[this.displayedPhaseIndex].closingDate) {
      const currentDate = new Date();
      const closingDateArray = this.phases[this.displayedPhaseIndex].closingDate;

      // Criar um objeto Date a partir do array [ano, mês, dia, hora, minuto]
      const closingDate = new Date(closingDateArray[0], closingDateArray[1] - 1, closingDateArray[2], closingDateArray[3], closingDateArray[4]);

      // Verifica se a data atual ultrapassou a closingDate
      if (currentDate > closingDate) {
        this.showResults = false;
        this.isOwner = true;
      }else{
        this.showResults = true;
        if(this.userId==this.UserDetails.id){
          this.isOwner = true;
          this.canInvite = true;
        } else {
          this.isOwner = false;
          this.canInvite = false;
        }
      }
    }
    if(this.phases[this.displayedPhaseIndex].type == 'Points Voting'){
      this.getResultsDataInPoints(this.phases[this.displayedPhaseIndex].id)
      this.isPoints = true;

      this.votingService.classifyOptionsPoints(this.phases[this.displayedPhaseIndex].id).subscribe(
        (pointsClassificationData) => {
          // Handle the received data as needed
          console.log('Classificação das opções de voto em pontos recebida:', pointsClassificationData);
        },
        (error) => {
          console.error('Erro durante a obtenção da classificação das opções de voto em pontos:', error);
          // Handle the error as needed
        }
      );
    }
    else{
      this.getResultsData(this.phases[this.displayedPhaseIndex].id);
      this.isPoints = false;


      this.votingService.classifyOptions(this.phases[this.displayedPhaseIndex].id).subscribe(
        (classificationData) => {
          // Handle the received data as needed
          console.log('Classificação das opções de voto recebida:', classificationData);
        },
        (error) => {
          console.error('Erro durante a obtenção da classificação das opções de voto:', error);
          // Handle the error as needed
        }
      );
    }

    // Chame seu serviço para obter as opções de voto da fase atual
    this.votingService.getVoteOptionsByPhaseId(phaseId).subscribe(
      (options) => {
        // Desabilitar todas as opções inicialmente
        this.voteOptions = options.map((option) => {
          this.isOptionDisabled[option.id] = true;
          return option;
        });


        this.votingService.canUserVoteInPhase(this.userId, phaseId).subscribe(
          (voteUUID) => {
            if (voteUUID.length == 0) {


              if (this.currentPhase && this.phases[this.currentPhaseIndex]) {
                console.log(this.phases[this.currentPhaseIndex].categoryId);
                console.log('Pode votar aqui',this.VoteablePhaseIds);

                const currentPhase = this.phases[this.currentPhaseIndex];
                const now = new Date();

                this.voteOptions
                  .filter((option) => option.phase.id === currentPhase.id)
                  .forEach((option) => {
                    const openingDate = new Date(currentPhase.openingDate[0], currentPhase.openingDate[1] - 1, currentPhase.openingDate[2], currentPhase.openingDate[3], currentPhase.openingDate[4]);
                    const closingDate = new Date(currentPhase.closingDate[0], currentPhase.closingDate[1] - 1, currentPhase.closingDate[2], currentPhase.closingDate[3], currentPhase.closingDate[4]);

                    // Verificar se a data de abertura já passou e a data de fechamento ainda não passou
                    if (openingDate <= now && closingDate > now) {
                      this.isOptionDisabled[option.id] = false;

                    }

                  });

                this.getVoteablePhasesForCurrentUser(this.userId,this.votingDetails.id);

                let hasMatchingPhaseId = false;

                const hasMatchingCategoryId = this.VoteablePhaseIds.some(voteablePhase =>
                  voteablePhase.categoryId === this.phases[this.currentPhaseIndex].categoryId
                );

                if (hasMatchingCategoryId) {
                  const currentPhaseId = this.phases[this.currentPhaseIndex].id;
                  hasMatchingPhaseId = this.VoteablePhaseIds.some(voteablePhase =>
                    voteablePhase.phaseIds.includes(currentPhaseId)
                  );
                }

                this.isInvited = hasMatchingPhaseId;



                this.voteOptions
                  .filter((option) => option.phase.id === currentPhase.id)
                  .forEach((option) => {
                    // Verificar se a data de abertura já passou e a data de fechamento ainda não passou

                    if (!hasMatchingPhaseId) {
                      this.isOptionDisabled[option.id] = true;
                    }
                  });

                this.voteOptions
                  .filter((option) => option.phase.id === currentPhase.id)
                  .forEach((option) => {
                    // Verificar se a data de abertura já passou e a data de fechamento ainda não passou

                    if (this.UserDetails.id == this.sessionStorageService.getUserUuid()) {
                      this.isOptionDisabled[option.id] = false;
                    }
                  });
              }
            }
            else {

              voteUUID.sort((a, b) => a.position - b.position);
              console.log(voteUUID);
              voteUUID.forEach((uuid) => {
                this.votingService.getVoteById(uuid.id).subscribe(
                  (voteDetails) => {
                    console.log(`Detalhes do voto com ID ${uuid}:`, voteDetails);

                    // Marcar a opção correspondente ao UUID armazenado em voteDetails.id
                    this.isOptionDisabled[voteDetails.id] = false;

                    const phaseId = voteDetails.voteOption.phase.id;
                    console.log(this.selectedVoteOptions);
                    if (!this.selectedVoteOptions[phaseId]) {
                      this.selectedVoteOptions[phaseId] = [];
                    }

                    if (this.selectedVoteOptions[phaseId].indexOf(voteDetails.voteOption.id) === -1) {
                      // Se não estiver presente, adiciona
                      this.selectedVoteOptions[phaseId].push(voteDetails.voteOption.id);
                    }
                  },
                  (error) => {
                    console.error(`Erro ao obter detalhes do voto com ID ${uuid}:`, error);
                    // Lógica adicional em caso de erro, se necessário
                  }
                );
              });
            }
          },
        (error) => {
          console.error('Erro ao verificar se o usuário pode votar na fase:', error);
          // Adicione lógica adicional para tratamento de erro, se necessário
        });
        // Habilitar apenas as opções associadas à fase atual e que atendem às condições de data
      },
      (error) => {
        console.error('Erro ao obter opções de voto:', error);
      }
    );
  }

  isSubmitButtonDisabled(): boolean {
    const currentDate = new Date();
    const closingDateArray = this.phases[this.displayedPhaseIndex].closingDate;

    if (closingDateArray) {
      const closingDate = new Date(closingDateArray[0], closingDateArray[1] - 1, closingDateArray[2], closingDateArray[3], closingDateArray[4]);
      return currentDate > closingDate || this.voteOptions.every((option) => this.isOptionDisabled[option.id]);
    }

    return this.voteOptions.every((option) => this.isOptionDisabled[option.id]);
  }

  isDeleteButtonDisabled(): boolean {
    const currentDate = new Date();
    const closingDateArray = this.phases[this.displayedPhaseIndex].closingDate;

    if (closingDateArray) {
      const closingDate = new Date(closingDateArray[0], closingDateArray[1] - 1, closingDateArray[2], closingDateArray[3], closingDateArray[4]);
      return this.voteOptions.length === 0 || currentDate > closingDate || this.voteOptions.every((option) => !this.isOptionDisabled[option.id]);
    }

    return this.voteOptions.length === 0 || this.voteOptions.every((option) => !this.isOptionDisabled[option.id]);
  }

  selectedVoteOptions: { [phaseId: string]: string[] } = {};


  toggleVoteOption(option: any): void {
    const phase = this.phases[this.displayedPhaseIndex];

    if (phase.type === 'Points Voting') {
      // Lógica específica para Points Voting
      this.togglePointsVoteOption(option);
    } else {
      // Lógica padrão para outras formas de votação
      this.toggleDefaultVoteOption(option);
    }
  }

  togglePointsVoteOption(option: any): void {
    const phaseId = option.phase.id;

    if (!this.selectedVoteOptions[phaseId]) {
      this.selectedVoteOptions[phaseId] = [];
    }

    const selectedIndex = this.selectedVoteOptions[phaseId].indexOf(option.id);

    if (selectedIndex !== -1) {
      // A opção já está selecionada, então a removemos da lista
      this.selectedVoteOptions[phaseId].splice(selectedIndex, 1);
    } else {
      // Adiciona a opção à lista
      this.selectedVoteOptions[phaseId].push(option.id);

      // Verifica se o tamanho do array ultrapassa n_choices
      if (this.selectedVoteOptions[phaseId].length > this.phases[this.displayedPhaseIndex].n_choices) {
        // Se ultrapassar, remove a última opção adicionada
        this.selectedVoteOptions[phaseId].pop();
      }
    }
  }

  getPositionInSelectedOptions(optionId: string, phaseId: string): number {
    const selectedIndex = this.selectedVoteOptions[phaseId]?.indexOf(optionId);

    // Retorna a posição + 1 se a opção estiver no array, senão retorna 0
    return selectedIndex !== -1 ? selectedIndex + 1 : 0;
  }

  getOrdinalNumber(n: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }

  getCircleColor(position: number): string {
    const colors = ["#FFD700", "#C0C0C0", "#CD7F32", "#00CED1", "#FF00FF", "#FFFF00"]; // Adicione mais cores conforme necessário
    const index = Math.min(position - 1, colors.length - 1);
    return colors[index];
  }


  toggleDefaultVoteOption(option: any): void {
    const phaseId = option.phase.id;
    console.log(this.selectedVoteOptions);
    if (!this.selectedVoteOptions[phaseId]) {
      this.selectedVoteOptions[phaseId] = [];
    }

    const selectedIndex = this.selectedVoteOptions[phaseId].indexOf(option.id);

    if (selectedIndex !== -1) {
      // A opção já está selecionada, então a removemos da lista
      this.selectedVoteOptions[phaseId].splice(selectedIndex, 1);
    } else {
      // Verifica se atingiu o limite de escolhas permitido
      if (this.selectedVoteOptions[phaseId].length < this.phases[this.displayedPhaseIndex].n_choices) {
        // Adiciona a opção à lista
        this.selectedVoteOptions[phaseId].push(option.id);
      }
    }
  }

  isSelected(optionId: string): boolean {
    const phaseId = this.phases[this.displayedPhaseIndex].id;

    // Verifica se a opção está na lista de opções selecionadas para a fase atual
    return this.selectedVoteOptions[phaseId]?.includes(optionId) || false;
  }

  position: number = 0 ;
  submitVote(): void {
    console.log(this.IdCategoriaSelecionada);
    console.log(this.phases[this.displayedPhaseIndex].id);
    console.log(this.selectedVoteOptions);

    const phaseId = this.phases[this.displayedPhaseIndex].id;

    this.votingService.canUserVoteInPhase(this.userId, phaseId).subscribe(
      (VoteUUID) => {
        if (VoteUUID.length === 0) {
          console.log('O usuário pode votar nesta fase.');

          // Obtém o ID do convite do eleitor
          this.votingService.getVoterInvitationByUserId(this.userId, phaseId).subscribe(
            (invitation) => {
              // Utilize o 'invitationId' conforme necessário na lógica da função submitVote
              console.log('ID do convite do eleitor obtido:', invitation[0].id);

              // Faz o post do voto para cada opção selecionada
              for (const selectedOptionId of this.selectedVoteOptions[phaseId]) {
                // Ajuste para votações pontuais
                const position = this.phases[this.displayedPhaseIndex].type === 'Points Voting'
                  ? this.getPositionInSelectedOptions(selectedOptionId, phaseId)
                  : 0;

                this.votingService.postVote(position, invitation[0].id, selectedOptionId).subscribe(
                  (voteResponse: any) => {
                    console.log('Voto postado com sucesso:', voteResponse);

                    // Atualiza a data após a postagem do voto com sucesso
                    this.votingService.updateVoteDate(invitation[0].id).subscribe(
                      () => {
                        console.log('Data de voto atualizada com sucesso.');
                        this.loadVoteOptions(phaseId);
                      },
                      (error) => {
                        console.error('Erro ao atualizar a data de voto:', error);
                      }
                    );
                  },
                  (error) => {
                    console.error('Erro ao postar voto:', error);
                  }
                );
              }
            },
            (error) => {
              console.error('Erro ao obter ID do convite do eleitor:', error);
            }
          );
        } else {
          console.log('O usuário já votou nesta fase. Não será feito o post do voto.');
          this.handleError('Error submitting vote', 'You have already submitted your vote. You cannot submit more than one vote per phase.');
          // Adicione lógica adicional se necessário quando o usuário já votou
        }
      },
      (error) => {
        console.error('Erro ao verificar se o usuário pode votar na fase:', error);
        // Adicione lógica adicional para tratamento de erro, se necessário
      }
    );
  }

  deleteVote(): void {
    console.log(this.IdCategoriaSelecionada);
    console.log(this.phases[this.displayedPhaseIndex].id);
    console.log(this.selectedVoteOptionId);

    const phaseId = this.phases[this.displayedPhaseIndex].id;

    console.log('Voto deletado com sucesso');
    this.votingService.getVoterInvitationByUserId(this.userId, phaseId).subscribe(
      (invitation) => {
        // Utilize o 'invitationId' conforme necessário na lógica da função submitVote
        console.log('ID do convite do eleitor obtido:', invitation[0].id);

        // Faz o post do voto apenas se o usuário ainda não votou
        this.votingService.deleteVote(invitation[0].id).subscribe(() => {
          console.log('Voto excluído com sucesso');
          this.loadVoteOptions(phaseId);
        });
      },
      (error) => {
        console.error('Erro ao obter ID do convite do eleitor:', error);
      }
    );
  }


  changeVote(): void {
    // Lógica para alterar o voto
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

  inviteUsers(): void {
    this.votingService.getAllUsers().subscribe(users => {
      // Faça algo com a lista de usuários recebida

      // Passa a lista de usuários para a função abrirPopupConvite
      this.abrirPopupConvite(users);
    });
  }

  abrirPopupConvite(users: any[]): void {
    // Faça algo com a lista de usuários dentro da função
    console.log('Lista de usuários na função abrirPopupConvite:', users);

    // Chamada para abrir o popup
    this.invitePopupService.displayInvitePopup(users,this.phases[this.displayedPhaseIndex].id);
  }

  showInfo = false;

  toggleInfoVisibility() {
    this.showInfo = !this.showInfo;
  }

  formatOptionInfo(option: any): SafeHtml {
    const formattedInfo = `<strong>${option.name}</strong><hr style="margin: 5px 0;"><small>${option.information}</small>`;
    return this.sanitizer.bypassSecurityTrustHtml(formattedInfo);
  }

  showResults: boolean = true;
  isPoints: boolean = true;

  seeResults(): void {
    console.log(this.phases[this.displayedPhaseIndex].id);
    if(this.phases[this.displayedPhaseIndex].type == 'Points Voting'){
      this.getResultsDataInPoints(this.phases[this.displayedPhaseIndex].id)
      this.isPoints = true;
    }
    else{
      this.getResultsData(this.phases[this.displayedPhaseIndex].id);
      this.isPoints = false;
    }

    this.showResults = !this.showResults;
    // Adicione aqui o código para navegar para a página de resultados ou realizar outras ações necessárias
  }


}
