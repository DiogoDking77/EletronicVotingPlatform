import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NewVotingService} from "../new-voting/new-voting.service";
import {NewAdvancedVotingService} from "./new-advanced-voting.service";
import {forkJoin} from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from '../session-storage.service';
import { ErrorPopupService } from "../error-popup.service";

@Component({
  selector: 'app-new-advanced-voting',
  templateUrl: './new-advanced-voting.component.html',
  styleUrls: ['./new-advanced-voting.component.css']
})
export class NewAdvancedVotingComponent implements OnInit{
  @ViewChild('optionInput') optionInput: ElementRef;
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('informationInput') informationInput: ElementRef;

  constructor(
    private votingService: NewAdvancedVotingService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
    private errorPopupService: ErrorPopupService
  ) {
    // Inicialize a propriedade no construtor
    this.optionInput = {} as ElementRef;
    this.nameInput = {} as ElementRef;
    this.informationInput = {} as ElementRef;
  }

  optionContainer: Array<Array<string>> = [];
  selectedThemeId: string = '';
  userId: string | null = '';// Nova propriedade para armazenar o UUID do tema selecionado

  ngOnInit(): void {
    this.userId = this.sessionStorageService.getUserUuid();
    // Chama a função executarTheme() durante a inicialização do componente
    this.executarTheme();
  }

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  navigateToHome(): void {
    this.router.navigate(['/find-voting']);
  }

  navigateToCreateVotations(): void {
    this.router.navigate(['/new-voting']);
  }

  navigateToCasualVoting(): void {
    this.router.navigate(['/new-voting']);
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
      (themes: { id: string; theme: string }[] ) => {
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
  haveCategories: boolean = false;
  StartDate: Date = new Date();
  EndDate: Date = new Date();
  // TO DO, add start e end date
  criarvotacao(name: string, description: string, privacy: boolean, StartDate: Date, EndDate: Date): void {
    // Obtém o UUID do tema selecionado (já está sendo armazenado em selectedThemeId)
    const themeUUID = this.selectedThemeId;

    // Obtém as categorias do array optionContainer
    let categories;
    if (this.haveCategories) {
      // Verifica se há nomes de categorias duplicados
      const categoryNames = this.optionContainer.map(categoryName => categoryName[0]);
      const uniqueCategoryNames = new Set(categoryNames);

      if (uniqueCategoryNames.size !== categoryNames.length) {
        const error_head = 'Error creating voting.';
        const error_msg = 'Category names must be unique.';
        this.handleError(error_head, error_msg);
        return;
      }

      categories = this.optionContainer.map(categoryName => {
        return {
          name: categoryName[0], // Assume que o nome da categoria está na posição 0 do array
          information: categoryName[1], // Assume que a informação está na posição 1 do array
        };
      });
    } else {
      categories = [{
        name: name, // Usa o nome da votação como nome da categoria
        information: null, // Define a informação como nula
      }];
    }

    // Verifica se categories tem pelo menos um elemento se haveCategories é true
    if (this.haveCategories && categories.length < 1) {
      const error_head = 'Error creating voting.';
      const error_msg = 'At least one category is required.';
      this.handleError(error_head, error_msg);
      return;
    }

    this.votingService.createVoting(name, description, privacy, themeUUID, this.userId, StartDate, EndDate, categories)
      .subscribe(
        (votingResponse) => {
          // Lida com a resposta da criação da votação, se necessário
          console.log('Votação criada com sucesso:', votingResponse);



          this.checkAndNavigate(votingResponse.id);
        },
        (error) => {
          // Lida com o erro ao criar a votação, se necessário
          console.error('Erro ao criar votação', error);
        }
      );
  }

  addCategory() {
    const optionName = this.nameInput.nativeElement.value.trim();
    const descriptionName = this.informationInput.nativeElement.value.trim();

    if (optionName !== '' && descriptionName !== '') {
      this.optionContainer.push([optionName, descriptionName]);
      this.nameInput.nativeElement.value = '';
      this.informationInput.nativeElement.value = '';
    }
  }

  removeOption(index: number) {
    this.optionContainer.splice(index, 1);
  }

  checkAndNavigate(votingId: string): void {
    this.votingService.getCategoryIdsWithoutPhase(votingId).subscribe(
      (categoryIds) => {
        if (categoryIds.length === 0) {
          // If the array is empty, navigate to voting/:id
          this.router.navigate(['/voting', votingId]);
        } else {
          // If the array is not empty, navigate to new-advanced-voting/new-category/:id with the first element
          const firstCategoryId = categoryIds[0];
          this.router.navigate(['/new-advanced-voting/new-category', firstCategoryId]);
        }
      },
      (error) => {
        console.error('Error checking categories without phase', error);
        // Handle the error, if necessary
      }
    );
  }

}
