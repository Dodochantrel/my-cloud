import { Component, OnInit } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { PictureService } from '../../services/picture.service';
import { PictureCategory } from '../../class/picture-category';
import { NotificationService } from '../../services/notification.service';
import { BrowserService } from '../../services/browser.service';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { AddOrEditPictureCategoryComponent } from '../../components/gallery/add-or-edit-picture-category/add-or-edit-picture-category.component';
import { MenuItem, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-gallery',
  imports: [TreeModule, SplitterModule, ButtonModule, AddOrEditPictureCategoryComponent, MenuModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
})
export class GalleryComponent implements OnInit {
  constructor(
    private readonly pictureService: PictureService,
    private readonly notificationService: NotificationService,
        private readonly browserService: BrowserService,
  ) {}

  public categories: PictureCategory[] = [];
  public treeCategories: any[] = [];
  public isLoadingDate: boolean = true;
  public isAddingOrEditingCategory: boolean = false;
  public isEditingCategory: boolean = false;

  public menuItems: MenuItem[] = [
    {
      label: 'Ajouter sous-catégorie',
      icon: 'pi pi-folder-plus',
      command: () => this.onAdd(),
    },
    {
      label: 'Modifier',
      icon: 'pi pi-pencil',
      command: () => this.onEdit(),
    },
    {
      label: 'Supprimer',
      icon: 'pi pi-trash',
      command: () => this.onDelete(),
      style: { color: 'red' },
    },
  ];
  public currentNode: TreeNode | null = null;


  ngOnInit(): void {
    if (this.browserService.isBrowser) {
      this.getCategories();
    }
  }

  getCategories() {
    this.isLoadingDate = true;
    this.pictureService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.treeCategories = this.mapForTree(categories);
      },
      error: (error) => {
        this.notificationService.showError('Erreur récupération des catégories', error);
      },
      complete: () => {
        this.isLoadingDate = false;
      },
    });
  }

  mapForTree(categories: PictureCategory[]): TreeNode[] {
    return categories.map((category) => ({
      label: category.name,
      data: category,
      children: this.mapForTree(category.childrens),
    }));
  }

  onAdd() {
    this.isEditingCategory = false;
    this.isAddingOrEditingCategory = true;
  }

  onEdit() {
    this.isAddingOrEditingCategory = true;
    this.isEditingCategory = true;
  }

  onDelete() {
    console.log('Supprimer', this.currentNode);
  }

  openMenu(event: MouseEvent, menu: any, node: TreeNode) {
    this.currentNode = node;
    menu.toggle(event);
  }

  addNew(pictureCategory: PictureCategory) {
    this.categories.push(pictureCategory);
    this.treeCategories.push(this.mapForTree([pictureCategory])[0]);
  }

  editOne(pictureCategory: PictureCategory) {
    const index = this.categories.findIndex(cat => cat.id === pictureCategory.id);
    if (index !== -1) {
      this.categories[index] = pictureCategory;
      this.treeCategories[index] = this.mapForTree([pictureCategory])[0];
    }
  }
}
