import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  private lifeTime: number = 8000;

  showSuccess(summary: string, detail: string) {
    this.show('success', summary, detail);
  }

  showError(summary: string, detail: string) {
    this.show('error', summary, detail);
  }

  showInfo(summary: string, detail: string) {
    this.show('info', summary, detail);
  }

  showWarn(summary: string, detail: string) {
    this.show('warn', summary, detail);
  }

  private show(severity: string, summary: string, detail: string) {
    this.messageService.add({
      severity,
      summary,
      detail,
      life: this.lifeTime,
      closable: true,
    });
  }

  confirm(
    event: Event,
    header: string,
    message: string,
    acceptCallback: () => void,
    rejectCallback?: () => void
  ) {
    return this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: message,
      header: header,
      icon: 'pi pi-info-circle',
      rejectLabel: 'Annulé',
      rejectButtonProps: {
        label: 'Annuler',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Supprimer',
        severity: 'danger',
      },
      accept: acceptCallback,
      reject: rejectCallback,
    });
  }
}
