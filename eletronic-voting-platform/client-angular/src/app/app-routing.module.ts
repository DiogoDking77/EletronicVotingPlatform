// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {NewVotingComponent} from "./new-voting/new-voting.component";
import {VotationComponent} from "./votation/votation.component";
import { LoginService } from './login/login.service';
import {NewVotingService} from "./new-voting/new-voting.service";
import {FindVotingComponent} from "./find-voting/find-voting.component";
import {NewAdvancedVotingComponent} from "./new-advanced-voting/new-advanced-voting.component";
import {NewCategoryComponent} from "./new-category/new-category.component";
import {ProfilePageComponent} from "./profile-page/profile-page.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'new-voting', component: NewVotingComponent},
  {path: 'voting/:id', component: VotationComponent},
  {path: 'find-voting', component: FindVotingComponent},
  {path: 'new-advanced-voting/new-category/:id', component: NewCategoryComponent},
  {path: 'new-advanced-voting', component: NewAdvancedVotingComponent},
  {path: 'profile', component: ProfilePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [LoginService , NewVotingService],
  exports: [RouterModule]
})
export class AppRoutingModule { }


