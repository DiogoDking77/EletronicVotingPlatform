import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RegisterService } from "./register.service";
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorPopupService } from "../error-popup.service";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit{

  constructor(private registerService: RegisterService, private router: Router, private errorPopupService: ErrorPopupService) {

  }

  ngOnInit(): void {
    this.registerService.getAllNationalities().subscribe(
      (countries: any) => {
        this.countries = countries;
        this.filterUniqueNationalities();
        console.log(this.uniqueNationalities);
      },
      (error) => {
        console.error('Erro ao carregar países:', error);
      }
    );
  }

  handleSuccess(errorHead: string, errorMessage: string) {
    this.errorPopupService.displaySuccess(errorHead,errorMessage);
  }

  name: string = '';
  genre: string = '';
  email: string = '';

  firstPassword: string = '';
  password: string = '';
  dateOfBirth: Date = new Date();
  nationality: string = '';

  showFirstPassword: boolean = false;
  showPassword: boolean = false;
  countries: any[] = [];
  uniqueNationalities: string[] = [];



  filterUniqueNationalities(): void {
    // Filtra nacionalidades únicas
    this.uniqueNationalities = Array.from(new Set(this.countries.map(country => country.demonyms?.eng?.m || country.name.common)));
  }

  register(name: string, genre: string, email: string, password: string, dateOfBirth: Date, firstPassword: string): void {

    this.registerService.register(name, genre, email, password, dateOfBirth, this.nationality, firstPassword)
      .subscribe(
        (userId) => {
          console.log('User registado com sucesso. ID:', userId);

          // Navegue para a página de detalhes da votação com o ID recém-criado
          this.handleSuccess('Account created successfully','Now you can login')
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Erro ao registar user', error);
        }
      );
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
}

