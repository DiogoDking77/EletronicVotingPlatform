import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmPopupService {
  private deleteUserByIdUrl = 'http://localhost:8090/api/user/';

  constructor(private http: HttpClient) {
    // Não é necessário iniciar a escuta do evento aqui, pois será feito no método displayInvitePopup
  }

  private deleteConfirmationSubject = new BehaviorSubject<string | null>(null);

  displayDeleteConfirmation(userId: string | null): Observable<string | null> {
    this.deleteConfirmationSubject.next(userId);

    const confirmationResult = new Observable<string | null>((observer) => {
      // Exibir uma div ou modal de confirmação aqui
      const confirmationPopup = document.createElement('div');
      confirmationPopup.className = 'delete-confirmation-popup';
      confirmationPopup.style.position = 'fixed';
      confirmationPopup.style.top = '50%';
      confirmationPopup.style.left = '50%';
      confirmationPopup.style.transform = 'translate(-50%, -50%)';
      confirmationPopup.style.border = '1px solid #ccc';
      confirmationPopup.style.backgroundColor = '#fff';
      confirmationPopup.style.padding = '20px'; // Altera o tamanho do padding para 20px
      confirmationPopup.style.zIndex = '9999';

      const confirmationText = document.createElement('p');
      confirmationText.textContent = `Are you sure you want to delete this account?`;
      confirmationText.style.marginBottom = '20px'; // Adiciona espaçamento abaixo da mensagem

      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.justifyContent = 'center'; // Centraliza os botões

      const confirmButton = document.createElement('button');
      confirmButton.textContent = 'Yes';
      confirmButton.className = 'delete-confirm-button';
      confirmButton.style.padding = '10px';
      confirmButton.style.marginRight = '10px';
      confirmButton.style.cursor = 'pointer';
      confirmButton.style.backgroundColor = '#f44336';
      confirmButton.style.color = 'white';
      confirmButton.style.border = 'none';
      confirmButton.onclick = () => {
        observer.next(userId);
        observer.complete();
        document.body.removeChild(confirmationPopup);
      };

      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'No';
      cancelButton.className = 'delete-cancel-button';
      cancelButton.style.padding = '10px';
      cancelButton.style.marginRight = '10px';
      cancelButton.style.cursor = 'pointer';
      cancelButton.style.backgroundColor = '#FFD180'; // Laranja claro
      cancelButton.style.color = 'white';
      cancelButton.style.border = 'none';
      cancelButton.onclick = () => {
        observer.next(null);
        observer.complete();
        document.body.removeChild(confirmationPopup);
      };

      buttonContainer.appendChild(confirmButton);
      buttonContainer.appendChild(cancelButton);

      confirmationPopup.appendChild(confirmationText);
      confirmationPopup.appendChild(buttonContainer);

      document.body.appendChild(confirmationPopup);
    });

    return confirmationResult;
  }

  deleteConfirmed(userId: string): Observable<any> {
    const url = `${this.deleteUserByIdUrl}${userId}`;
    return this.http.delete(url);
  }
}
