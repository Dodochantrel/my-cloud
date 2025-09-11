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
  ],
  templateUrl: './tasting-category.component.html',
  styleUrl: './tasting-category.component.css'
})
export class TastingCategoryComponent implements OnInit {
  constructor(
    protected readonly tastingCategoryService: TastingCategoryService
  ) {
    effect(() => {
      this.treeTable = this.toTreeTable(this.tastingCategoryService.categories());
    });
  }

  private toTreeTable(categories: TastingCategory[]): TreeNode[] {
    return categories.map(category => ({
      data: {
        id: category.id,
        name: category.name,
        color: category.color,
        icon: category.icon,
      },
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
  
  ngOnInit(): void {
    this.tastingCategoryService.refresh();
  }

}
