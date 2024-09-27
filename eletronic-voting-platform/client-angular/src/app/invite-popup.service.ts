import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class InvitePopupService {
  private searchSubject = new BehaviorSubject<string>('');
  private allUsers: any[] = [];
  public selectedUsers: any[] = [];
  userId: string | null = '';
  private PostInviteUrl = 'http://localhost:8090/api/vote_invite'
  private ConvertToInviteUrl = 'http://localhost:8090/api/vote_invite/isInvited/{userId}/{phaseId}'
  private VerifyInviteUrl = 'http://localhost:8090/api/vote_invite/existsByUserAndPhase/{userId}/{phaseId}'

  constructor(private http: HttpClient, private sessionStorageService: SessionStorageService) {
    // Não é necessário iniciar a escuta do evento aqui, pois será feito no método displayInvitePopup
  }


  displayInvitePopup(users: any, phaseId: string): void {
    this.userId = this.sessionStorageService.getUserUuid();

    // Supondo que 'users.content' seja uma array de objetos de usuário
    this.allUsers = users.content.filter((user: { deleted: boolean, id: string }) => {
      // Filtra os usuários que não tenham o mesmo ID que this.userId
      return user.deleted !== true && user.id !== this.userId;
    });
    console.log(this.allUsers);

    // Cria um elemento div para o pop-up de convite
    const invitePopup = document.createElement('div');
    invitePopup.className = 'invite-popup grid grid-cols-2 gap-4';
    invitePopup.style.backgroundColor = '#f16f3e';

    // Coluna da Esquerda
    const leftColumn = document.createElement('div');
    leftColumn.className = 'col-span-1 rounded';
    leftColumn.style.padding = '20px';
    leftColumn.style.backgroundColor = '#FFFFFF'

    const inviteUsersTitle = document.createElement('h2');
    inviteUsersTitle.textContent = 'Invite Users';
    leftColumn.appendChild(inviteUsersTitle);

    // Adiciona um campo de busca por email
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Type user emails';
    searchInput.className = 'custom-input-style appearance-none block w-full border-2 border-orange-500 rounded py-3 px-4 leading-tight focus:outline-none text-orange-500 placeholder-orange-300'; // Adiciona a classe personalizada
    leftColumn.appendChild(searchInput);

    // Adiciona um elemento para a lista de usuários filtrados
    const userListContainer = document.createElement('div');
    userListContainer.className = 'user-list-container';
    leftColumn.appendChild(userListContainer);

// Adiciona a coluna da esquerda ao pop-up
    invitePopup.appendChild(leftColumn);

// Coluna da Direita
    // Coluna da Direita
    const rightColumn = document.createElement('div');
    rightColumn.className = 'col-span-1 h-full grid grid-rows-3 rounded';
    rightColumn.style.padding = '20px';
    rightColumn.style.backgroundColor = '#FFFFFF'



    // Título: Descrição "Selected Users:"
    const inviteSelectedUsersTitle = document.createElement('h2');
    inviteSelectedUsersTitle.textContent = 'Selected Users:';
    inviteSelectedUsersTitle.className = ''
    rightColumn.appendChild(inviteSelectedUsersTitle);

    // Lista de usuários selecionados
    const selectedUsersContainer = document.createElement('div');
    selectedUsersContainer.className = 'flex flex-col';

    const selectedUserslist = document.createElement('div');
    selectedUserslist.className = 'selected-users-list-container';
    selectedUsersContainer.appendChild(selectedUserslist);
    rightColumn.appendChild(selectedUsersContainer);

    const buttonDiv = document.createElement('div');
    buttonDiv.className = ' w-full flex flex-row justify-between'; // Alterada para flex-row

// Botão "Send Invite"
    const sendInviteButton = document.createElement('button');
    sendInviteButton.textContent = 'Send Invite';
    sendInviteButton.className = 'appearance-none block border-2 border-orange-500 rounded py-3 px-4 leading-tight focus:outline-none text-orange-500 placeholder-orange-300';
    sendInviteButton.style.width = '65%';
    sendInviteButton.onclick = () => {
      const phase_Id = phaseId;

      this.sendInvitesToSelectedUsers(phase_Id);
      document.body.removeChild(invitePopup);
    };

// Botão "Cancel"
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'appearance-none block border-2 border-orange-500 rounded py-3 px-4 leading-tight focus:outline-none text-orange-500 placeholder-orange-300';
    cancelButton.style.width = '35%';
    cancelButton.onclick = () => {
      // Lógica para cancelar/fechar o popup
      document.body.removeChild(invitePopup);
    };

    buttonDiv.appendChild(sendInviteButton);
    buttonDiv.appendChild(cancelButton);

// Adicione a propriedade align-self: flex-end para que o botão fique sempre no final da buttonDiv
    buttonDiv.style.alignSelf = 'flex-end';

    rightColumn.appendChild(buttonDiv);

    invitePopup.appendChild(rightColumn);
    // Botão de envio de convite


    // Adiciona a coluna da direita ao pop-up
    invitePopup.appendChild(rightColumn);


    // Adiciona o pop-up ao corpo do documento
    document.body.appendChild(invitePopup);

    // Adiciona um evento para fechar o pop-up ao clicar fora dele
    const closePopupOnClickOutside = (event: MouseEvent) => {
      if (!invitePopup.contains(event.target as Node)) {
        // Se o clique foi fora do pop-up, remove o pop-up
        document.body.removeChild(invitePopup);
        // Remove o ouvinte de eventos após fechar o pop-up
        document.removeEventListener('click', closePopupOnClickOutside);
      }
    };

    // Registra o evento de clique fora do pop-up
    document.addEventListener('click', closePopupOnClickOutside);

    // Registra o evento de entrada (input) para a busca de usuários
    searchInput.addEventListener('input', (event) => {
      this.searchSubject.next((event.target as HTMLInputElement).value);
      // Atualiza a exibição dos usuários selecionados
      this.displaySelectedUsers(selectedUserslist);
    });

    // Inicia a escuta do evento de busca apenas quando o pop-up é exibido
    this.setupSearchListener(userListContainer, selectedUserslist);

    // Exibe inicialmente os usuários selecionados
    this.displaySelectedUsers(selectedUserslist);

    selectedUsersContainer.addEventListener('click', (event) => {
      // Impede que o clique se propague para o documento e feche o popup
      event.stopPropagation();
    });
  }

  private setupSearchListener(
    userListContainer: HTMLElement,
    selectedUsersContainer: HTMLElement
  ): void {
    this.searchSubject.subscribe((term) => {
      const filteredUsers = this.filterUsers(term);
      this.displayFilteredUsers(filteredUsers, userListContainer, selectedUsersContainer);
    });
  }

  private filterUsers(term: string): any[] {
    const usersArray = Array.isArray(this.allUsers) ? this.allUsers : [];
    const filteredUsers = usersArray.filter((user) => user.email.includes(term));
    return filteredUsers;
  }

  private displayFilteredUsers(
    filteredUsers: any[],
    userListContainer: HTMLElement,
    selectedUsersContainer: HTMLElement
  ): void {
    // Limpar a lista existente de usuários
    while (userListContainer.firstChild) {
      userListContainer.removeChild(userListContainer.firstChild);
    }

    // Limpar a lista existente de usuários selecionados
    while (selectedUsersContainer.firstChild) {
      selectedUsersContainer.removeChild(selectedUsersContainer.firstChild);
    }

    // Verificar se há algum termo de pesquisa não vazio
    const nonEmptySearchTerm = this.searchSubject.value.trim() || '';
    if (filteredUsers.length === 0 || nonEmptySearchTerm === '') {
      // Não há resultados para exibir ou o termo de pesquisa está vazio
      return;
    }

    // Ordenar os usuários com base na correspondência do início do e-mail
    filteredUsers.sort((a, b) => {
      const termLower = nonEmptySearchTerm.toLowerCase();
      const emailA = a.email.toLowerCase();
      const emailB = b.email.toLowerCase();

      const startsWithTermA = emailA.startsWith(termLower);
      const startsWithTermB = emailB.startsWith(termLower);

      // Ordenar de acordo com a correspondência do início do e-mail
      if (startsWithTermA && !startsWithTermB) {
        return -1;
      } else if (!startsWithTermA && startsWithTermB) {
        return 1;
      } else {
        // Se ambos começarem ou não começarem com o termo, manter a ordem original
        return 0;
      }
    });

    // Criar uma lista de usuários filtrados
    const userList = document.createElement('ul');
    userList.className = 'user-list';

    filteredUsers.forEach((user, index) => {
      const userItem = document.createElement('li');
      userItem.textContent = user.email; // ou qualquer outra propriedade que você deseja exibir

      // Adicionar um evento de clique ao item da lista de resultados
      userItem.addEventListener('click', () => {
        // Verificar se o usuário já está na lista de selecionados
        const userAlreadySelected = this.selectedUsers.some(selectedUser => selectedUser.email === user.email);

        // Adicionar o usuário à lista de selecionados apenas se ainda não estiver lá
        if (!userAlreadySelected) {
          this.selectedUsers.push(user);
          // Atualizar a exibição dos usuários selecionados
          this.displaySelectedUsers(selectedUsersContainer);
        }
      });

      userItem.classList.add('result-item');
      userItem.addEventListener('mouseenter', () => {
        userItem.classList.add('hovered');
      });
      userItem.addEventListener('mouseleave', () => {
        userItem.classList.remove('hovered');
      });

      userList.appendChild(userItem);

      userList.appendChild(userItem);

      // Adicionar uma linha divisória horizontal após cada li, exceto no último
      if (index < filteredUsers.length - 1) {
        const hr = document.createElement('hr');
        hr.style.backgroundColor = '#f16f3e';
        userList.appendChild(hr);
      }
    });

    // Adicionar a lista de usuários abaixo da barra de pesquisa
    userListContainer.appendChild(userList);

    // Exibir os usuários selecionados
    this.displaySelectedUsers(selectedUsersContainer);
  }

  private displaySelectedUsers(selectedUsersContainer: HTMLElement): void {
    // Limpar a lista existente de usuários selecionados
    while (selectedUsersContainer.firstChild) {
      selectedUsersContainer.removeChild(selectedUsersContainer.firstChild);
    }

    // Verificar se a lista de usuários selecionados não está vazia
    if (this.selectedUsers.length > 0) {
      // Criar uma lista de usuários selecionados
      const selectedUsersList = document.createElement('ul');
      selectedUsersList.className = 'selected-users-list';

      this.selectedUsers.forEach((user, index) => {
        const selectedUserItem = document.createElement('li');
        selectedUserItem.textContent = user.email;
        selectedUserItem.addEventListener('click', () => {
          // Remove o usuário da lista de selecionados
          this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.email !== user.email);
          // Atualiza a exibição dos usuários selecionados
          this.displaySelectedUsers(selectedUsersContainer);
        });

        selectedUserItem.classList.add('selected-item');
        selectedUserItem.addEventListener('mouseenter', () => {
          selectedUserItem.classList.add('hovered');
        });
        selectedUserItem.addEventListener('mouseleave', () => {
          selectedUserItem.classList.remove('hovered');
        });
        // ou qualquer outra propriedade que você deseja exibir

        selectedUsersList.appendChild(selectedUserItem);

        // Adicionar uma linha divisória horizontal após cada li, exceto no último
        if (index < this.selectedUsers.length - 1) {
          const hr = document.createElement('hr');
          hr.style.backgroundColor = '#f16f3e';
          selectedUsersList.appendChild(hr);
        }
      });

      // Adicionar a lista de usuários selecionados
      selectedUsersContainer.appendChild(selectedUsersList);

      selectedUsersList.style.backgroundColor = 'rgba(225,185,168,0.2)';
    }
  }

  private checkInviteStatus(userId: string, phaseId: string): Observable<string> {
    const convertToInviteUrl = `http://localhost:8090/api/vote_invite/isInvited/${userId}/${phaseId}`;
    return this.http.patch<string>(convertToInviteUrl, {});
  }

  private FindInvite(userId: string, phaseId: string): Observable<string> {
    const convertToInviteUrl = `http://localhost:8090/api/vote_invite/existsByUserAndPhase/${userId}/${phaseId}`;
    return this.http.get<string>(convertToInviteUrl, {});
  }

  private sendInvite(userEmail: string, userId: string, phaseId: string): void {
    const postInviteUrl = 'http://localhost:8090/api/vote_invite';

    // Formata a data para uma string ISO (2024-01-29T12:34:56.789Z)
    const invite_date = new Date().toISOString();

    const inviteData = {
      message: null,
      response: null as any, // Defina um tipo adequado ou remova se não for necessário
      isInvited: true,
      comment: null as any, // Defina um tipo adequado ou remova se não for necessário
      vote_date: null as any, // Defina um tipo adequado ou remova se não for necessário
      phase: phaseId,
      user: userId,
    };

    this.http.post(postInviteUrl, inviteData)
      .subscribe(
        (response: any) => { // Defina um tipo adequado para 'response'
          console.log(`Convite enviado para ${userEmail}`);
        },
        (error: any) => { // Defina um tipo adequado para 'error'
          console.error('Erro ao enviar convite:', error);
        }
      );
  }



  private sendInvitesToSelectedUsers(phaseId: string): void {
    this.selectedUsers.forEach((selectedUser) => {
      const userId = this.findUserIdByEmail(selectedUser.email);

      if (userId) {
        // Primeiro, verifique se existe um convite com userId e phaseId
        this.FindInvite(userId, phaseId).subscribe(
          (inviteStatus) => {
            if (inviteStatus) {
              // Se existe, verifique o status do convite
              this.checkInviteStatus(userId, phaseId).subscribe(
                (isInvited) => {
                  if (isInvited) {
                    console.log(`Usuário ${selectedUser.email} já foi convidado.`);
                  } else {
                    console.log(`Usuário ${selectedUser.email} já tem um convite, mas não foi convidado. Enviando convite...`);
                    this.sendInvite(selectedUser.email, userId, phaseId);
                  }
                },
                (error) => {
                  console.error('Erro ao verificar o status do convite:', error);
                }
              );
            } else {
              // Se não existe, envie o convite
              console.log(`Usuário ${selectedUser.email} ainda não foi convidado. Enviando convite...`);
              this.sendInvite(selectedUser.email, userId, phaseId);
            }
          },
          (error) => {
            console.error('Erro ao verificar a existência do convite:', error);
          }
        );
      } else {
        console.error(`ID do usuário não encontrado para o e-mail ${selectedUser.email}`);
      }
    });
  }


  private findUserIdByEmail(email: string): string | undefined {
    const user = this.allUsers.find((user) => user.email === email);
    return user ? user.id : undefined;
  }



}
