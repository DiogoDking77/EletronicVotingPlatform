import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorPopupService {
  private createPopup(title: string, backgroundColor: string, message: string, popupClass: string): void {
    const popup = document.createElement('div');
    popup.className = popupClass;

    const header = document.createElement('div');
    header.className = 'popup-header';
    header.style.backgroundColor = backgroundColor;
    header.textContent = title;

    const contentContainer = document.createElement('div');
    contentContainer.className = 'popup-content';

    const messageElement = document.createElement('div');
    messageElement.className = 'popup-message';
    messageElement.textContent = message;
    // Define a cor do texto com base na cor de fundo para melhor legibilidade


    contentContainer.appendChild(header);
    contentContainer.appendChild(messageElement);

    const closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = () => {
      document.body.removeChild(popup);
      window.removeEventListener('click', closePopupOnClickOutside);
    };
    contentContainer.appendChild(closeButton);

    popup.appendChild(contentContainer);

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.classList.add('show');
    }, 0);

    const closePopupOnClickOutside = (event: MouseEvent) => {
      if (!popup.contains(event.target as Node)) {
        document.body.removeChild(popup);
        window.removeEventListener('click', closePopupOnClickOutside);
      }
    };

    setTimeout(() => {
      window.addEventListener('click', closePopupOnClickOutside);
    }, 0);

    // Adiciona um timeout para fechar o popup automaticamente após 1,5 segundos
    setTimeout(() => {
      document.body.removeChild(popup);
      window.removeEventListener('click', closePopupOnClickOutside);
    }, 1500);

    console.log(`${popupClass} popup displayed`);
  }

  displayError(title: string, message: string): void {
    this.createPopup(title, '#f13e3e', message, 'error-popup');
  }

  displaySuccess(title: string, message: string): void {
    this.createPopup(title, '#86ef86', message, 'success-popup');
  }
}
