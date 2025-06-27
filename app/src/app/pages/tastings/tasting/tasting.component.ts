import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { TastingService } from '../../../services/tasting.service';
import { BrowserService } from '../../../services/browser.service';
import { Paginated } from '../../../class/paginated';
import { defaultPaginatedMeta, PaginatedMeta } from '../../../class/paginated-meta';
import { Tasting } from '../../../class/tasting';

@Component({
  selector: 'app-tasting',
  imports: [],
  templateUrl: './tasting.component.html',
  styleUrl: './tasting.component.css'
})
export class TastingComponent implements OnInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly tastingService: TastingService,
    private readonly browserService: BrowserService
  ) {}

  public paginatedTasting: Paginated<Tasting> = new Paginated<Tasting>([], defaultPaginatedMeta);

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getAll();
    }
  }

  getAll() {
    this.tastingService.getRecipes().subscribe({
      next: (paginatedTasting: Paginated<Tasting>) => {
        this.paginatedTasting = paginatedTasting;
      },
      error: (error) => {
        this.notificationService.showError('Erreur', 'Erreur lors de la récupération des dégustations');
      }
    });
  }
}
