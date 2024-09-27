import {Component, ElementRef, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NewCategoryService} from "./new-category.service";
import {forkJoin} from "rxjs";
import {ActivatedRoute, Router} from '@angular/router';
import { NgModel } from '@angular/forms';
import { SimpleChanges } from '@angular/core';
import { ErrorPopupService } from "../error-popup.service";
import { SessionStorageService } from '../session-storage.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.css']
})
export class NewCategoryComponent implements OnInit,OnChanges {
  @ViewChild('optionInput') optionInput: ElementRef;
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('informationInput') informationInput: ElementRef;

  constructor(private categoryService: NewCategoryService, private router: Router, private route: ActivatedRoute, private errorPopupService: ErrorPopupService, private sessionStorageService: SessionStorageService) {
    this.optionInput = {} as ElementRef;
    this.nameInput = {} as ElementRef;
    this.informationInput = {} as ElementRef;
  }


  phases: {
    name: string,
    privacy: boolean,
    startDate: Date,
    endDate: Date,
    optionContainer: Array<Array<string>>,
    votingType: string,
    numberOfWinners: number,
    numberOfVotes: number | null,
    orderPoints: Array<number>,
    newOptionName: string,
    newOptionInformation: string
  }[] = [];

  ngOnInit(): void {
    this.getCategoryInformation();
    this.generatePhases();
    this.isNumberVotesVisible = false;
    console.log('ngOninit')
  }

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('selectedVotingType' in changes) {
      console.log('Selected Voting Type changed:', this.selectedVotingType);
      // Coloque aqui a lógica que precisa ser executada quando selectedVotingType muda
    }
  }

  numberOfPhases: number = 1;
  categoryName: string = '';
  currentPhase: number = 0;
  selectedVotingType: string = '';
  votingTypes: string[] = ['Simple Voting', 'Multiple Voting', 'Points Voting'];
  isNumberVotesVisible: boolean = true;
  showTable: boolean = true;
  isTableVisible: boolean = true;
  pointsMatrix: any[][] = []; // Substitua 'any[][]' pelos tipos apropriados



  generatePhases() {
    this.phases = Array.from({ length: this.numberOfPhases }, (_, i) => this.createDefaultPhase());
  }

  createDefaultPhase(): any {
    return {
      name: '',
      privacy: false,
      startDate: new Date(),
      endDate: new Date(),
      optionContainer: [],
      votingType: 'Simple Voting',
      numberOfWinners: 1,
      numberOfVotes: null,
      orderPoints: [],
      newOptionName: '',  // Inicialize aqui
      newOptionInformation: ''  // Inicialize aqui
    };
  }


  onPhaseNameChange(newName: string, index: number): void {
    console.log('name:', newName);
    this.phases[index].name = newName;
  }

  onPhaseOptionNameChange(newOptionName: string, index: number): void {
    console.log('onPhaseOptionNameChange:', newOptionName);
    this.phases[index].newOptionName = newOptionName.trim();
  }

  onPhaseOptionInfoChange(newOptionInfo: string, index: number): void {
    console.log('onPhaseOptionInfoChange:', newOptionInfo);
    this.phases[index].newOptionInformation = newOptionInfo.trim();
  }

  public category: any;  // Certifique-se de ajustar o tipo conforme necessário

  getCategoryInformation(): void {
    const categoryId = this.route.snapshot.paramMap.get('id');

    if (categoryId) {
      this.categoryService.getCategoryInformation(categoryId).subscribe(
        (categoryInfo) => {
          console.log('Category information:', categoryInfo);
          this.category = categoryInfo;  // Atribua à propriedade de classe
        },
        (error) => {
          console.error('Error fetching category information', error);
        }
      );
    } else {
      console.error('Category ID not found in the URL');
    }
  }
  addOption(i: number, name:string, info:string) {

      console.log('name' ,this.phases[i])
    // Verifique se phases[i] está definido e se newOptionName e newOptionInformation estão definidos
      const optionName = name.trim();
      const informationName = info.trim();

      console.log('optionName:', optionName);
      console.log('informationName:', informationName);

      if (optionName !== '' && informationName !== '') {
        this.phases[i].optionContainer.push([optionName, informationName]);
        this.phases[i].newOptionName = '';
        this.phases[i].newOptionInformation = '';
      }

  }



  removeOption(i: number, index: number) {
    this.phases[i].optionContainer.splice(index, 1);
  }

  generateNumberArray(count: number | null | undefined): number[] {
    return count != null ? Array.from({ length: count }, (_, i) => i + 1) : [];
  }

  generateNumbers(count: number | null | undefined): number[] {
    return count != null ? Array.from({ length: count }, (_, i) => i + 1) : [];
  }

  onNumberOfVotesChange(n_choices: number, index: number): void {
    const MAX_VOTES = 15;
    console.log('number of votes:', n_choices);
    this.phases[index].numberOfVotes = n_choices;
  }

  onVotingTypeChange(type: string,i: number): void {
    // Verifica o tipo de votação selecionado
    switch (type) {
      case 'Simple Voting':
        // Lógica para o caso de voto simples
        this.phases[i].votingType = 'Simple Voting'
        this.isNumberVotesVisible = false;  // ou qualquer outra lógica que você precise
        break;
      case 'Multiple Voting':
        // Lógica para o caso de voto múltiplo
        this.phases[i].votingType = 'Multiple Voting'
        this.isNumberVotesVisible = true;  // ou qualquer outra lógica que você precise
        break;
      case 'Points Voting':
        // Lógica para o caso de voto por pontos
        this.phases[i].votingType = 'Points Voting'
        this.isNumberVotesVisible = true;  // ou qualquer outra lógica que você precise
        break;
      default:
        // Caso padrão, se o tipo de votação não corresponder a nenhum caso
        this.phases[i].votingType = 'Simple Voting'
        this.isNumberVotesVisible = false;  // ou qualquer outra lógica que você precise
        break;

    }

    // Mais lógica, se necessário...

    // Exemplo de log para verificar o valor de isNumberVotesVisible após a alteração
    console.log('isNumberVotesVisible:', this.isNumberVotesVisible);
  }

  PutPoints(pts: number, i: number, j:number):void{
    this.phases[i].orderPoints[j-1]=pts;
  }

  log(): void {
    console.log(this.phases)
  }

  CreatePhases(): void {
    const phaseId = this.route.snapshot.paramMap.get('id');

    if (phaseId) {
      // Check if dates are valid before proceeding
      const data_error_msg = this.areDatesValid();
      if(data_error_msg){
        this.handleError('Error creating category/phases.', data_error_msg)
        // Handle the invalid dates scenario (e.g., show an error message to the user)
        return;
      }

      const error_msg = this.arePhasesValid();
      if(error_msg){
        this.handleError('Error creating category/phases.', error_msg)
        // Handle the invalid dates scenario (e.g., show an error message to the user)
        return;
      }


      this.categoryService.createPhases(this.phases, phaseId).subscribe(
        (response) => {
          console.log('Phases created successfully:', response);
          this.checkAndNavigate();
          // Handle any additional logic or UI updates after successful creation
        },
        (error) => {
          console.error('Error creating phases:', error);
          // Handle errors or show error messages to the user
        }
      );
    } else {
      console.error('ID da fase não encontrado na URL.');
      // Handle the absence of the phase ID in the URL as needed
    }
  }

// Adicione a função para validar as fases
  arePhasesValid(): string | null {
    const uniqueOptionsSet = new Set<string>();

    for (let i = 0; i < this.phases.length; i++) {
      const phase = this.phases[i];

      // Verifique se a primeira fase tem pelo menos duas opções de voto
      if (i === 0 && phase.optionContainer.length < 2) {
        return 'The first phase must have at least two voting options.';
      }



      if(phase.numberOfWinners < 1){
        return 'You should have at least one winner for each phase';
      }

      if(phase.votingType !== 'Simple Voting'){
        console.log(phase.numberOfVotes);
        if(!phase.numberOfVotes){
          return 'You should define the number of votes in phase' + (i + 1);
        }
      }

      if(phase.numberOfVotes){
        if(phase.votingType !== 'Simple Voting' && phase.numberOfVotes < 1){
          return 'You have at leat to be able to male one vote in phase' + (i + 1);
        }
      }

      // Verifique se o número de vencedores é inferior ao número de opções de voto se não for a última fase
      if (i !== 0 && phase.numberOfWinners > (phase.optionContainer.length + this.phases[i - 1].numberOfWinners)) {
        return 'Number of winners must be less than the number of voting options in phase ' + (i + 1);
      }

      if (i === 0 && phase.numberOfWinners >= phase.optionContainer.length) {
        return 'Number of winners must be less than the number of voting options in phase ' + (i + 1);
      }

      if(phase.numberOfVotes){
        if (i!=0  && phase.votingType !== 'Simple Voting' && phase.numberOfVotes > (phase.optionContainer.length + this.phases[i-1].numberOfWinners) ){
          return 'Number of votes must be less than the number of voting options in phase ' + (i + 1);
        }
      }




      // Verifique se o número de vencedores é inferior a 2 se a fase anterior tem menos de 2 vencedores
      if (i > 0 && (this.phases[i - 1].numberOfWinners + phase.optionContainer.length) < 2) {
        return 'Increase the number of voting options of the phase' + (i + 1) +  ', or increase the number of winner of the phase' + (i);
      }


      if (phase.votingType === 'Points Voting' && phase.orderPoints) {
        console.log('meu deus')
        // Verifique se o array de pontos está organizado do maior para o menor
        const uniqueNumbersSet = new Set(phase.orderPoints);
        if (uniqueNumbersSet.size !== phase.orderPoints.length) {
          return 'In phase ' + (i + 1) + ', you should give unique points for each position.';
          // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        }

        if (phase.orderPoints.length !== phase.numberOfVotes) {
          return 'In phase ' + (i + 1) + ', you should give points for each position.';
          // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        }

        if (phase.orderPoints.some(value => value === 0)) {
          return 'In phase ' + (i + 1) + ', points for each position should be greater than 0.';
          // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        }

// Verifique se o array de pontos está organizado do maior para o menor
        const isOrdered = phase.orderPoints.every((value, index, array) => {
          if (index > 0) {
            return value <= array[index - 1];
          }
          return true;
        });

        if (!isOrdered) {
          return 'In phase ' + (i + 1) + ', you should not give more points to a position that is inferior to another.';
          // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        }

        // Verifique se o tamanho do array de pontos é igual ao número de vencedores
        // if (phase.orderPoints.length !== phase.numberOfWinners) {
        //   return 'In phase ' + i + ', the number of elements in orderPoints should be equal to the number of winners.';
        //   // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        // }

        // Verifique se não há elementos vazios no array de pontos
        if (phase.orderPoints.some(value => value === undefined)) {
          return 'In phase ' + (i + 1) + ', you should define a number of points for each position.';
          // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        }
      }

      const uniqueNamesSet = new Set(phase.optionContainer.map(option => option[0]));
      if (uniqueNamesSet.size !== phase.optionContainer.length) {
        return 'In phase ' + (i + 1) + ', options of vote should have unique names.';
        // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
      }

      // Verifique se não há opções de voto com nomes iguais entre fases
      for (const option of phase.optionContainer) {
        const optionName = option[0];
        if (uniqueOptionsSet.has(optionName)) {
          return 'Option "' + optionName + '" appears in multiple phases.';
          // Adicione o tratamento de erro adequado ou retorne false se desejar interromper a execução.
        }
        uniqueOptionsSet.add(optionName);
      }

    }

    // Se todas as verificações passarem, as fases são consideradas válidas
    return null;
  }


  private areDatesValid(): string | null {
    // Iterate through phases to check date validity
    for (let i = 0; i < this.phases.length; i++) {
      const currentPhase = this.phases[i];

      const now = new Date();
      const startDate = new Date(currentPhase.startDate);
      const endDate = new Date(currentPhase.endDate);
      if (now > startDate && now > endDate) {
        // A data atual está dentro do intervalo especificad;
        return `Make sure that the start date and end date of phase ${i + 1} occur before the current date.`;
      }
      // Check if the startDate is before the endDate of its associated phase
      if (currentPhase.startDate >= currentPhase.endDate) {
        return 'The data phases should happen sequentially';
      }

      // Check if the startDate is before the endDate of the next phase (if exists)
      if (i < this.phases.length - 1) {
        const nextPhase = this.phases[i + 1];
        if (currentPhase.startDate >= nextPhase.startDate || currentPhase.startDate >= nextPhase.endDate) {
          return 'The data phases should happen sequentially';
        }
        if (currentPhase.endDate >= nextPhase.startDate || currentPhase.endDate >= nextPhase.endDate) {
          return 'The data phases should happen sequentially';
        }
      }
    }

    // All dates are valid
    return null;
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

  checkAndNavigate(): boolean {
    let hasMoreCategories = false;

    this.categoryService.getCategoryIdsWithoutPhase(this.category.voting.id).subscribe(
      (categoryIds) => {
        if (categoryIds.length === 0) {
          // If the array is empty, navigate to voting/:id
          this.handleSuccess('New Voting', 'Your voting was created successfully')
          this.router.navigate(['/voting', this.category.voting.id]);
        } else {
          this.handleSuccess('Category Added', 'The new category has been successfully added' )
          // If the array is not empty, navigate to new-advanced-voting/new-category/:id with the first element
          console.log(this.category)
          const firstCategoryId = categoryIds[0];

          if (firstCategoryId) {
            this.categoryService.getCategoryInformation(firstCategoryId).subscribe(
              (categoryInfo) => {
                console.log('Category information:', categoryInfo);
                this.category = categoryInfo;  // Atribua à propriedade de classe
              },
              (error) => {
                console.error('Error fetching category information', error);
              }
            );
          } else {
            console.error('Category ID not found in the URL');
          }

          this.generatePhases();
          this.router.navigate(['/new-advanced-voting/new-category', firstCategoryId]);
          hasMoreCategories = true;

        }
      },
      (error) => {
        console.error('Error checking categories without phase', error);
        // Handle the error, if necessary
      }
    );

    return hasMoreCategories;
  }

  handleSuccess(errorHead: string, errorMessage: string) {
    this.errorPopupService.displaySuccess(errorHead,errorMessage);
  }

  navigateToHome(): void {
    this.handleError('Permission Denied','Complete your voting creation first')
  }

  navigateToCreateVotations(): void {
    this.handleError('Permission Denied','Complete your voting creation first')
  }

  navigateToProfile(): void {
    this.handleError('Permission Denied','Complete your voting creation first')
  }

  logout(): void{
    this.handleError('Permission Denied','Complete your voting creation first')
  }

  protected readonly Array = Array;
}
