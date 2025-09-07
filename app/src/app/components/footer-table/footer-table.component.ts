import { Component, effect, input, model, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer-table',
  imports: [PaginatorModule, SelectButton, CommonModule, FormsModule],
  templateUrl: './footer-table.component.html',
  styleUrl: './footer-table.component.css'
})
export class FooterTableComponent implements OnInit {
  itemCount = model.required<number>();
  // SI null alors on affiche meme pas le selecteur de taille
  selectedSize = model.required<SizeType>();
  page = model.required<number>();
  limit = model.required<number>();

  public sizes = [
    { name: 'Petit', value: 'small' },
    { name: 'Moyen', value: undefined },
    { name: 'Grand', value: 'large' }
  ];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    effect(() => {
      const page = this.page();
      const limit = this.limit();
    
      const current = this.activatedRoute.snapshot.queryParams;
      const currentPage = +current['page'] || 1;
      const currentLimit = +current['limit'] || 20;
    
      if (page === currentPage && limit === currentLimit) return;
    
      this.router.navigate([], {
        queryParams: { page, limit },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });
  }

  ngOnInit() {
    this.getInUrlData();
  }

  getInUrlData() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const pageParam = params.get('page');
      const limitParam = params.get('limit');
    
      if (pageParam || limitParam) {
        const page = pageParam ? +pageParam : 1;
        const limit = limitParam ? +limitParam : 20;

        this.page.set(page);
        this.limit.set(limit);
      }
    });
  }

  onPaginationChange(event: any) {
    const newPage = Math.floor(event.first / event.rows) + 1;
    this.page.set(newPage);
    this.limit.set(event.rows);
  }
}

export type SizeType = "small" | "large" | undefined | null;