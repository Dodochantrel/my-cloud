import { Component, effect, OnInit } from '@angular/core';
import { TastingCategoryService } from '../../../../services/tasting-category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TreeTableModule } from 'primeng/treetable';
import { FooterTableComponent, SizeType } from '../../../../components/footer-table/footer-table.component';
import { TreeNode } from 'primeng/api';
import { TastingCategory } from '../../../../class/tasting-category';
import { AddOrEditTastingCategoryComponent } from '../../../../components/admin/tasting-categories/add-or-edit-tasting-category/add-or-edit-tasting-category.component';
import { AddOrEditEventCategoryComponent } from "../../../../components/admin/event-categories/add-or-edit-event-category/add-or-edit-event-category.component";
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-tasting-category',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TreeTableModule,
    ButtonModule,
    FooterTableComponent,
    FormsModule,
    AddOrEditTastingCategoryComponent,
],
  templateUrl: './tasting-category.component.html',
  styleUrl: './tasting-category.component.css'
})
export class TastingCategoryComponent implements OnInit {
  constructor(
    protected readonly tastingCategoryService: TastingCategoryService,
    private readonly notificationService: NotificationService,
  ) {
    effect(() => {
      this.treeTable = this.toTreeTable(this.tastingCategoryService.categories());
    });
  }

  ngOnInit(): void {
    this.tastingCategoryService.refresh();
  }

  private toTreeTable(categories: TastingCategory[]): TreeNode[] {
    return categories.map(category => ({
      data: category,
      icon: 'pi pi-fw pi-inbox',
      children: this.toTreeTable(category.childrens || []),
    }));
  }

  treeTable!: TreeNode[];

  public selectedSize: SizeType = undefined;

  mapSizeToClass(size: SizeType): string {
    switch (size) {
      case "small":
        return 'p-treetable-sm';
      case "large":
        return 'p-treetable-lg';
      default:
        return '';
    }
  }

  prepareCreate(id: string | null = null) {
    this.tastingCategoryService.isCreatingOrUpdating.set(true);
    this.tastingCategoryService.isCreatingParentId.set(id);
    this.tastingCategoryService.tastingCategoryEditing.set(null);
  }

  prepareEdit(category: TastingCategory) {
    this.tastingCategoryService.isCreatingOrUpdating.set(true);
    this.tastingCategoryService.isCreatingParentId.set(null);
    this.tastingCategoryService.tastingCategoryEditing.set(category);
  }

  prepareDelete(tastingCategory: TastingCategory, event: Event) {
      this.notificationService.confirm(
        event,
        'Confirmation',
        `Êtes-vous sûr de vouloir supprimer la catégorie de dégustation ${tastingCategory.name} ?`,
        () => {
          this.tastingCategoryService.delete(tastingCategory);
        },
        () => {
          this.notificationService.showInfo(
            'Suppression annulée',
            `La catégorie d'évennement n'a pas été supprimée`
          );
        }
      );                                                                                                                                                                                                                                                                               

    }
}
