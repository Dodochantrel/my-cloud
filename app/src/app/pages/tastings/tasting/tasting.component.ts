import { Component, effect, OnInit } from '@angular/core';
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
import { RatingModule } from 'primeng/rating';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { FooterTableComponent } from '../../../components/footer-table/footer-table.component';
import { TastingCategoryService } from '../../../services/tasting-category.service';

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
    RatingModule,
    LoaderComponent,
    SpeedDialModule,
    FooterTableComponent,
  ],
  templateUrl: './tasting.component.html',
  styleUrl: './tasting.component.css',
})
export class TastingComponent implements OnInit {
  constructor(
    private readonly notificationService: NotificationService,
    protected readonly tastingService: TastingService,
    protected readonly tastingCategoryService: TastingCategoryService,
    private readonly browserService: BrowserService
  ) {
    effect(() => {
      // A chaque changement de this.tastings on regarde ceux qui n'ont pas de fileBlobUrl et on les charge
      this.addFile(this.tastingService.tastings().filter((t) => !t.fileBlobUrl));
      if(this.tastingCategoryService.categories()) {
        this.TastingCategoryTree = mapFromCategoriesToTreeNode(this.tastingCategoryService.categories()!);
      }
    });
  }

  public TastingCategoryTree: TreeNode<TastingCategory>[] = [];
  public isLoadingFileMap: Record<number, boolean> = {};

  getButtonsEdit(tasting: Tasting) {
    return [
      {
        icon: 'pi pi-pencil',
        command: () => {
          this.tastingService.isDisplayedCreateOrEdit = true;
          this.tastingService.tastingToEdit.set(tasting);
        },
      },
      {
        icon: 'pi pi-trash',
        command: () => {
          console.log('Delete tasting:', tasting);
        }
      }
    ];
  }

  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.tastingService.search.set('');
    }
  }

  addFile(tastings: Tasting[]) {
    tastings.forEach((tasting) => {
      this.getFile(tasting);
    });
  }

  getFile(tasting: Tasting) {
    this.isLoadingFileMap[tasting.id] = true;
  
    this.tastingService.getFile(tasting.id, 'small').subscribe({
      next: (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const index = this.tastingService.tastings().findIndex((r) => r.id === tasting.id);
        if (index !== -1) {
          this.tastingService.tastings()[index].fileBlobUrl = url;
        }
      },
      error: (error) => {
        this.notificationService.showError('Erreur', 'Erreur lors du téléchargement du fichier');
      },
      complete: () => {
        this.isLoadingFileMap[tasting.id] = false;
      }
    });
  }
  
  prepareDelete(tasting: Tasting, event: any) {
    this.notificationService.confirm(
      event,
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette dégustation ?',
      () => this.tastingService.delete(tasting.id),
      () => {}
    );
  }
}

export const mapFromCategoriesToTreeNode = (
  categories: TastingCategory[]
): TreeNode<TastingCategory>[] => {
  return categories.map((category) => {
    return {
      label: category.name,
      data: category,
      key: category.id,
      children: category.childrens
        ? mapFromCategoriesToTreeNode(category.childrens)
        : [],
    };
  });
};
