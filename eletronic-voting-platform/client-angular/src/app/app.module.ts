import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NewVotingComponent } from './new-voting/new-voting.component';
import { LoginService } from './login/login.service';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {NewVotingService} from "./new-voting/new-voting.service";
import { VotationComponent } from './votation/votation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FindVotingComponent } from './find-voting/find-voting.component';
import { NewAdvancedVotingComponent } from './new-advanced-voting/new-advanced-voting.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { SessionStorageService} from "./session-storage.service";
import { VotingInfoCardComponent } from './voting-info-card/voting-info-card.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NewVotingComponent,
    VotationComponent,
    FindVotingComponent,
    NewAdvancedVotingComponent,
    NewCategoryComponent,
    ProfilePageComponent,
    VotingInfoCardComponent
  ],
  imports: [
    MatSnackBarModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    // Adicione o FormsModule aqui
  ],
  providers: [LoginService, NewVotingService, SessionStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }




