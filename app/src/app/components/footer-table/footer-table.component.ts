import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { PaginatorModule } from 'primeng/paginator';
import {
  defaultPaginatedMeta,
  PaginatedMeta,
} from '../../class/paginated-meta';

@Component({
  selector: 'app-footer-table',
  imports: [FormsModule, SelectButton, PaginatorModule],
  templateUrl: './footer-table.component.html',
  styleUrl: './footer-table.component.css',
})
export class FooterTableComponent {
  public selectedSize: any = undefined;

  @Output() sizeChange = new EventEmitter<any>();

  public sizes: any[] = [
    { name: 'Small', value: 'small' },
    { name: 'Normal', value: undefined },
    { name: 'Large', value: 'large' },
  ];

  onSizeChange(event: any) {
    this.sizeChange.emit(event.value);
  }

  public first: number = 0;

  @Input() meta: PaginatedMeta = defaultPaginatedMeta;
  @Input() hasSize: boolean = false;
  @Output() pageChange = new EventEmitter<PaginatedMeta>();

  public options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 },
  ];

  onPageChange(event: any) {
    if(event.rows < this.meta.itemCount) {
      return;
    }
    this.meta.page = event.page + 1;
    this.meta.limit = event.rows;
    this.pageChange.emit(this.meta);
  }
}
