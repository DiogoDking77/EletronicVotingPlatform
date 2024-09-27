import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { NewVotingService } from "./new-voting.service";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionStorageService } from '../session-storage.service';
import { ErrorPopupService } from "../error-popup.service";

@Component({
  selector: 'app-new-voting',
  templateUrl: './new-voting.component.html',
  styleUrls: ['./new-voting.component.css'],
})
export class NewVotingComponent implements OnInit  {
  @ViewChild('optionInput') optionInput: ElementRef;

  constructor(private votingService: NewVotingService, private router: Router, private sessionStorageService: SessionStorageService, private errorPopupService: ErrorPopupService) {
    // Inicialize a propriedade no construtor
    this.optionInput = {} as ElementRef;
  }

  optionContainer: Array<string> = [];
  selectedThemeId: string = '';
  userId: string | null = "";

  ngOnInit(): void {
    this.userId = this.sessionStorageService.getUserUuid();
    console.log('User Id:', this.userId);
    this.executarTheme();
  }

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  handleSuccess(errorHead: string, errorMessage: string) {
    this.errorPopupService.displaySuccess(errorHead,errorMessage);
  }

  navigateToHome(): void {
    this.router.navigate(['/find-voting']);
  }

  navigateToCreateVotations(): void {
    this.router.navigate(['/new-voting']);
  }

  navigateToAdvancedVoting(): void {
    this.router.navigate(['/new-advanced-voting']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void{
    this.sessionStorageService.clear();
    this.router.navigate(['/login']);
  }

  executarTheme(): void {
    // Chama a função theme() do serviço quando o botão é clicado
    this.votingService.theme().subscribe(
      (themes:  { id: string; theme: string }[] ) => {
        const selectElement = document.getElementById('grid-state') as HTMLSelectElement;

        // Limpa as opções existentes, mantendo a primeira opção como padrão
        selectElement.innerHTML = '<option value="" disabled selected>Select a theme</option>';

        // Adiciona as novas opções
        themes.forEach((theme: { id: string; theme: string }) => {
          const option = document.createElement('option');
          option.value = theme.id; // Defina o valor da opção como o ID do tema
          option.text = theme.theme;  // Define o texto visível da opção como o nome do tema
          selectElement.add(option);
        });

        console.log('Temas recebidos e adicionados ao select:', themes);
      },
      error => {
        console.error('Erro ao buscar temas no componente', error);
        // Lide com o erro, se necessário
      }
    );
  }

  // Função para tratar a seleção de um tema no select
  selecionarTema(event: Event): void {
    this.selectedThemeId = (event.target as HTMLSelectElement).value;
    console.log('Tema selecionado:', this.selectedThemeId);
  }

  votationName: string = '';
  votationDescription: string = '';
  privacidade: boolean = false;
  StartDate: Date = new Date();
  EndDate: Date = new Date();

  criarvotacao(name: string, description: string, privacy: boolean, StartDate: Date, EndDate: Date): void {
    // Verificar se StartDate é anterior a EndDate
    if (StartDate >= EndDate) {
      const error_head = 'Error creating voting.';
      const error_msg = 'The start date must be before the end date.';
      this.handleError(error_head,error_msg)
      return;
    }

    if (this.optionContainer.length < 2) {
      const error_head = 'Error creating voting.';
      const error_msg = 'A voting must have at least 2 options.';
      this.handleError(error_head, error_msg);
      return;
    }

    const themeUUID = this.selectedThemeId;

    this.votingService.createVoting(name, description, privacy, themeUUID, this.userId, StartDate, EndDate, this.optionContainer)
      .subscribe(
        (votingId) => {
          console.log('Votação criada com sucesso. ID:', votingId);

          // Navegue para a página de detalhes da votação com o ID recém-criado
          this.handleSuccess('New Voting', 'Your voting was created successfully')
          this.router.navigate(['/voting', votingId]);
        },
        (error) => {
          console.error('Erro ao criar votação', error);
        }
      );
  }



  addOption() {
    const optionText = this.optionInput.nativeElement.value.trim();
    if (optionText !== '') {
      this.optionContainer.push(optionText);
      this.optionInput.nativeElement.value = '';
    }
  }

  removeOption(index: number) {
    this.optionContainer.splice(index, 1);
  }
}
