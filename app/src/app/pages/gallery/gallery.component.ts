import { Component, OnInit } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { PictureService } from '../../services/picture.service';
import { PictureCategory } from '../../class/picture-category';
import { NotificationService } from '../../services/notification.service';
import { BrowserService } from '../../services/browser.service';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { AddOrEditPictureCategoryComponent } from '../../components/galleries/add-or-edit-picture-category/add-or-edit-picture-category.component';
import { MenuItem, TreeDragDropService, TreeNode } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PhotoComponent } from '../../components/galleries/photo/photo.component';

@Component({
  selector: 'app-gallery',
  imports: [
    TreeModule,
    SplitterModule,
    ButtonModule,
    AddOrEditPictureCategoryComponent,
    MenuModule,
    PhotoComponent,
  ],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css',
  providers: [TreeDragDropService],
})
export class GalleryComponent implements OnInit {
  constructor(
    private readonly pictureService: PictureService,
    private readonly notificationService: NotificationService,
    private readonly browserService: BrowserService
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
      command: (event) => this.onDelete(event.originalEvent!),
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
        this.notificationService.showError(
          'Erreur récupération des catégories',
          error
        );
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

  onDelete(event: Event) {
    this.notificationService.confirm(
      event,
      'Voulez-vous vraiment supprimer cet élément ?',
      'Cela supprimera également toutes les sous-catégories et les images associées.',
      () => {},
      () => {}
    );
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
    const index = this.categories.findIndex(
      (cat) => cat.id === pictureCategory.id
    );
    if (index !== -1) {
      this.categories[index] = pictureCategory;
      this.treeCategories[index] = this.mapForTree([pictureCategory])[0];
    }
  }

  onNodeDrop(event: any) {
    const newParent = event.originalEvent.target.classList?.contains('p-tree-node-droppoint') ? null : event.dropNode.data;
    const category = event.dragNode.data;
    this.pictureService.changeParent(category.id, newParent ? newParent.id : null).subscribe({
      next: (updatedCategory) => {
        const message =  newParent ? `Catégorie ${category.name} déplacée vers ${newParent.name}` : `Catégorie ${category.name} déplacée vers la racine`;
        this.notificationService.showSuccess(
          'Succès', message
        );
        const index = this.categories.findIndex(
          (cat) => cat.id === updatedCategory.id
        );
        if (index !== -1) {
          this.categories[index] = updatedCategory;
          this.treeCategories[index] = this.mapForTree([updatedCategory])[0];
        }
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors du déplacement de la catégorie',
          error
        ); 
      },
    });
  }
}
