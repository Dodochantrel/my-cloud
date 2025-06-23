import { Component, OnInit } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { PictureService } from '../../services/picture.service';
import { PictureCategory } from '../../class/picture-category';
import { NotificationService } from '../../services/notification.service';
import { BrowserService } from '../../services/browser.service';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { AddOrEditPictureCategoryComponent } from '../../components/gallery/add-or-edit-picture-category/add-or-edit-picture-category.component';

@Component({
  selector: 'app-gallery',
  imports: [TreeModule, SplitterModule, ButtonModule, AddOrEditPictureCategoryComponent],
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
  public isAddingCategory: boolean = false;

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

  mapForTree(categories: PictureCategory[]): any[] {
    return categories.map((category) => ({
      label: category.name,
      data: category,
      children: this.mapForTree(category.childrens),
    }));
  }
}
