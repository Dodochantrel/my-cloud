import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';
import { TastingService } from '../../../services/tasting.service';
import { BrowserService } from '../../../services/browser.service';
import { Paginated } from '../../../class/paginated';
import { defaultPaginatedMeta } from '../../../class/paginated-meta';
import { Tasting } from '../../../class/tasting';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TastingCategory } from '../../../class/tasting-category';
import { TreeSelectModule } from 'primeng/treeselect';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { AddOrEditTastingComponent } from '../../../components/tastings/add-or-edit-tasting/add-or-edit-tasting.component';

@Component({
  selector: 'app-tasting',
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    CommonModule,
    FormsModule,
    TreeSelectModule,
    ButtonModule,
    AddOrEditTastingComponent,
  ],
  templateUrl: './tasting.component.html',
  styleUrl: './tasting.component.css',
})
export class TastingComponent implements OnInit {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly tastingService: TastingService,
    private readonly browserService: BrowserService
  ) {}

  public search: string = '';
  public categoryId: number = 0;
  public TastingCategoryTree: TreeNode<TastingCategory>[] = [];
  public isAddingOrEditing: boolean = false;
  public paginatedTasting: Paginated<Tasting> = new Paginated<Tasting>(
    [],
    defaultPaginatedMeta
  );

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getCategories();
      this.getAll();
    }
  }

  getAll() {
    this.tastingService.getRecipes(null, '', 1, 10).subscribe({
      next: (paginatedTasting: Paginated<Tasting>) => {
        this.paginatedTasting = paginatedTasting;
        this.addFile(paginatedTasting.data);
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          'Erreur lors de la récupération des dégustations'
        );
      },
    });
  }

  getCategories() {
    this.tastingService.getCategories().subscribe({
      next: (categories: TastingCategory[]) => {
        this.TastingCategoryTree = mapFromCategoriesToTreeNode(categories);
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          'Erreur lors de la récupération des catégories de dégustation'
        );
      },
    });
  }

  addTasting(tasting: Tasting) {
    this.paginatedTasting.data.unshift(tasting);
    this.isAddingOrEditing = false;
  }

  addFile(tastings: Tasting[]) {
    tastings.forEach((tasting) => {
      this.getFile(tasting);
    });
  }

  getFile(tasting: Tasting) {
    this.tastingService.getFile(tasting.id, 'small').subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const index = this.paginatedTasting.data.findIndex(
          (r) => r.id === tasting.id
        );
        if (index !== -1) {
          this.paginatedTasting.data[index].fileBlobUrl = url;
        }
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur',
          'Erreur lors du téléchargement du fichier'
        );
      },
    });
  }
}

export const mapFromCategoriesToTreeNode = (
  categories: TastingCategory[]
): TreeNode<TastingCategory>[] => {
  return categories.map((category) => {
    return {
      label: category.name,
      data: category,
      key: category.id.toString(),
      children: category.childrens
        ? mapFromCategoriesToTreeNode(category.childrens)
        : [],
    };
  });
};
