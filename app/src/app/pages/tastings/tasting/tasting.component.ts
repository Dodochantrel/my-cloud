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

  public tets: Paginated<Tasting> = new Paginated<Tasting>([], defaultPaginatedMeta);

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getAll();
    }
  }

  getAll() {

  }
}
