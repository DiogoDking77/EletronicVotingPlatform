import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { SessionStorageService } from '../session-storage.service';
import { ErrorPopupService} from "../error-popup.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(
    private loginService: LoginService,
    private router: Router,
    private sessionStorageService: SessionStorageService,
    private errorPopupService: ErrorPopupService
  ) {}

  handleError(errorHead: string, errorMessage: string) {
    this.errorPopupService.displayError(errorHead,errorMessage);
  }

  handleSuccess(errorHead: string, errorMessage: string) {
    this.errorPopupService.displaySuccess(errorHead,errorMessage);
  }

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  // Adicione esta variável ao seu componente
  loginSuccessMessage: string = '';
  showPassword: boolean = false;

  login(email: string, password: string): void {
    console.log('Form is valid. Attempting login...');
    this.loginService.login(email, password).subscribe(
      (response) => {
        console.log('Login successful', response);

        // Armazenando ID e e-mail na sessão
        this.sessionStorageService.setUserDetails(response.id, response.email);

        this.errorMessage = ''; // Limpa a mensagem de erro

        // Navegar para a rota desejada, por exemplo:
        this.handleSuccess('Login Successfully','Hello ' + response.email + ' !')
        this.router.navigate(['/find-voting']);
      },
      (error) => {
        console.error('Error during login', error);
        this.errorMessage = this.extractErrorMessage(error);
        this.handleError('Login Error',this.errorMessage)
      }
    );
  }



  togglePassword(): void {
    const inputElement: HTMLInputElement | null = document.getElementById('grid-first-password') as HTMLInputElement;
    if (inputElement) {
      this.showPassword = !this.showPassword;
      inputElement.type = this.showPassword ? 'text' : 'password';
    }
  }

  private extractErrorMessage(error: any): string {
    if (error.error && error.error.message) {
      return error.error.message;
    } else {
      return 'An error occurred during login.';
    }
  }

}
