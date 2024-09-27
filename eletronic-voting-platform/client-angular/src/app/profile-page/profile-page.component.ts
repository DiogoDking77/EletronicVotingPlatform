import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ProfilePageService } from './profile-page.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from '../session-storage.service';
import { ErrorPopupService } from "../error-popup.service";
import { ConfirmPopupService } from "../confirm-popup.service";
import {InvitePopupService} from "../invite-popup.service";


@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent  implements OnInit {
  userData: any;
  isPasswordModalVisible: boolean = false;

  userId: string | null = "";

  isEditingProfile: boolean = false;

  isOpenMenu: boolean = false;

  isEditingPassword: boolean = false;

  passwordSaved: boolean = false;


  constructor(
    private profileService: ProfilePageService,
    private route: ActivatedRoute,

    private errorPopupService: ErrorPopupService,

    private confirmPopupService: ConfirmPopupService,

    private sessionStorageService: SessionStorageService,

    private router: Router,
  ) {}

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  ngOnInit(): void {
    this.userId = this.sessionStorageService.getUserUuid();


    this.profileService.getAllNationalities().subscribe(
      (countries: any) => {
        this.countries = countries;
        this.filterUniqueNationalities();
        console.log(this.uniqueNationalities);
      },
      (error) => {
        console.error('Erro ao carregar países:', error);
      }
    );



    if (this.userId) {
      this.profileService.getUserById(this.userId).subscribe(
        (data) => {
          this.userData = data;
        },
        (error) => {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      );
    } else {
      console.error('ID do usuário não encontrado na URL.');
    }
  }

  firstPassword: string = '';
  password: string = '';

  showFirstPassword: boolean = false;
  showPassword: boolean = false;

  countries: any[] = [];
  uniqueNationalities: string[] = [];

  filterUniqueNationalities(): void {
    // Filtra nacionalidades únicas
    this.uniqueNationalities = Array.from(new Set(this.countries.map(country => country.demonyms?.eng?.m || country.name.common)));
  }

  formatarData(dataArray: number[] | null): string {
    if (dataArray && dataArray.length >= 3) {
      const year = dataArray[0];
      const month = this.padZero(dataArray[1]);
      const day = this.padZero(dataArray[2]);
      return `${year}-${month}-${day}`;
    } else {
      console.error('Os dados da data não são válidos:', dataArray);
      return '';
    }
  }


  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }


  openPasswordModal() {
    this.isPasswordModalVisible = true;
  }

  closePasswordModal() {
    this.isPasswordModalVisible = false;
  }

  toggleFirstPassword(): void {
    const inputElement: HTMLInputElement | null = document.getElementById('grid-first-password') as HTMLInputElement;
    if (inputElement) {
      this.showFirstPassword = !this.showFirstPassword;
      inputElement.type = this.showFirstPassword ? 'text' : 'password';
    }
  }


  togglePassword(): void {
    const inputElement: HTMLInputElement | null = document.getElementById('grid-password') as HTMLInputElement;
    if (inputElement) {
      this.showPassword = !this.showPassword;
      inputElement.type = this.showPassword ? 'text' : 'password';
    }
  }

  savePassword(firstPassword: string, password: string) {
    if (firstPassword !== password) {
      // Mostra um erro se as senhas não são iguais
      this.handleError('Error editing password', 'Passwords do not match');
      return;
    }

    if (!firstPassword || !password) {
      this.handleError('Error editing password', 'Password fields cannot be empty');
      return;
    }

    this.profileService.updateUserPassword(this.userId, firstPassword).subscribe(
      (response) => {
        console.log('Senha atualizada com sucesso!', response);
        this.closePasswordModal();
        this.passwordSaved = true;
      },
      (error) => {
        const errorDetail = error.error?._embedded?.errors?.[0]?.message;

        // Remover "Internal Server Error: " da mensagem
        let cleanErrorMessage = errorDetail ? errorDetail.replace(/^Internal Server Error: /, '') : 'Unknown error';

        // Remover "entity.<...>: " da mensagem
        cleanErrorMessage = cleanErrorMessage.replace(/^entity\..+?: /, '');

        // Mostrar erro usando a função handleError
        this.handleError('Error editing password', cleanErrorMessage || 'Unknown error');
        // Use throwError with both the original error and birthDateError
        throw error;
      }
    );
  }

  togglePasswordEditing() {
    this.isEditingPassword = !this.isEditingPassword;

    if (this.isEditingPassword) {
      this.openPasswordModal();
    } else {
      this.closePasswordModal();
      this.updateProfileButtonLabel();
    }
  }

  updateProfileButtonLabel(): void {
    if (this.passwordSaved) {
      // Se a senha foi salva, muda o texto para "Edit Password"
      this.isEditingProfile ? 'Cancel' : 'Edit Password';
    } else {
      // Se a senha não foi salva, mantém o texto original
      this.isEditingProfile ? 'Cancel' : 'Edit Profile';
    }
  }


  toggleProfileEditing() {
    this.isEditingProfile = !this.isEditingProfile;

    // Se desejar carregar dados do usuário ao clicar em "Edit Profile", pode fazer isso aqui
  }

  toggleMenu(){
    this.isOpenMenu = !this.isOpenMenu;
  }

  confirmProfileEditing(): void {
    const name = (document.getElementById('grid-name') as HTMLInputElement).value;
    const genre = (document.getElementById('genre-dropdown') as HTMLSelectElement).value;
    const email = (document.getElementById('grid-email') as HTMLSelectElement).value;
    const nationality = (document.getElementById('grid-nationality') as HTMLSelectElement).value;
    const dateOfBirth = (document.getElementById('grid-birth-date') as HTMLSelectElement).value;

    // Verificar se algum campo está vazio
    if (!name || !genre || !email || !nationality || !dateOfBirth) {
      this.handleError('Error editing profile', 'All fields are required');
      return;
    }

    // Verificar se a data de nascimento é superior à data atual
    const currentDate = new Date();
    const birthDate = new Date(dateOfBirth);
    if (birthDate > currentDate) {
      this.handleError('Error editing profile', 'Birth date cannot be in the future');
      return;
    }

    const updatedProfileData = {
      name: name,
      genre: genre,
      email: email,
      nationality: nationality,
      dateOfBirth: dateOfBirth
    };


    this.profileService.updateUserProfile(this.userId, updatedProfileData).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso!', response);
        this.isEditingProfile = false; // Defina como false para sair do modo de edição
      },
      (error) => {
        const errorDetail = error.error?._embedded?.errors?.[0]?.message;

        // Remover "Internal Server Error: " da mensagem
        let cleanErrorMessage = errorDetail ? errorDetail.replace(/^Internal Server Error: /, '') : 'Unknown error';

        // Remover "entity.<...>: " da mensagem
        cleanErrorMessage = cleanErrorMessage.replace(/^entity\..+?: /, '');

        // Mostrar erro usando a função handleError
        this.handleError('Error editing profile', cleanErrorMessage || 'Unknown error');
        // Use throwError with both the original error and birthDateError
        throw error;
      }
    );
  }

  deleteAccount(): void {
    this.userId = this.sessionStorageService.getUserUuid();
    this.confirmPopupService.displayDeleteConfirmation(this.userId).subscribe((result) => {
      if (result) {
        this.confirmPopupService.deleteConfirmed(result).subscribe(
          () => {
            console.log('Usuário excluído com sucesso!');
            this.sessionStorageService.clear();
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Erro ao excluir usuário:', error);
            // Adicione tratamento de erro, se necessário
          }
        );
      } else {
        console.log('Exclusão de usuário cancelada.');
        // Adicione qualquer lógica adicional aqui, se necessário
      }
    });
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


}
