import { Component, effect, OnInit } from '@angular/core';
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
export class GalleryComponent {
  constructor(
    private readonly pictureService: PictureService,
    private readonly notificationService: NotificationService,
  ) {
    effect(() => {
      this.treeCategories = this.mapForTree(this.pictureService.categories());
    });
  }

  public treeCategories: any[] = [];
  public isLoadingDate: boolean = true;

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

  mapForTree(categories: PictureCategory[]): TreeNode[] {
    return categories.map((category) => ({
      label: category.name,
      data: category,
      children: this.mapForTree(category.childrens),
    }));
  }

  onAdd() {
    this.pictureService.isAddingOrEditingCategory.set(true);
  }

  onEdit() {
    this.pictureService.isAddingOrEditingCategory.set(true);
    this.pictureService.selectedCategory.set(this.currentNode?.data ?? null);
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

  prepareAdd() {
    this.pictureService.isAddingOrEditingCategory.set(true);
    this.pictureService.selectedCategory.set(null);
  }

  openMenu(event: MouseEvent, menu: any, node: TreeNode) {
    this.currentNode = node;
    menu.toggle(event);
  }

  addNew(pictureCategory: PictureCategory) {
    this.pictureService.categories().push(pictureCategory);
    this.treeCategories.push(this.mapForTree([pictureCategory])[0]);
  }

  onNodeDrop(event: any) {
    const newParent = event.originalEvent.target.classList?.contains('p-tree-node-droppoint') ? null : event.dropNode.data;
    const category = event.dragNode.data;
    this.pictureService.changeParentPictureCategory(category.id, newParent ? newParent.id : null).subscribe({
      next: (updatedCategory) => {
        const message =  newParent ? `Catégorie ${category.name} déplacée vers ${newParent.name}` : `Catégorie ${category.name} déplacée vers la racine`;
        this.notificationService.showSuccess(
          'Succès', message
        );
        const index = this.pictureService.categories().findIndex(
          (cat) => cat.id === updatedCategory.id
        );
        if (index !== -1) {
          this.pictureService.categories()[index] = updatedCategory;
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
