import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { NotificationService } from '../../../services/notification.service';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { setImageUrl } from '../../../tools/set-image-url';
import { Options } from '../../../tools/option.interface';
import { Recipe } from '../../../class/recipe';
import { RecipeService } from '../../../services/recipe.service';
import { updateFailedInputs } from '../../../tools/update-failed-inputs';
import { GroupService } from '../../../services/group.service';
import { Group } from '../../../class/group';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { BrowserService } from '../../../services/browser.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'create-or-update-recipe.component',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SelectButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    EditorModule,
    FileUploadModule,
    MultiSelectModule,
    SelectModule,
  ],
  templateUrl: './create-or-update-recipe.component.html',
  styleUrl: './create-or-update-recipe.component.css',
})
export class CreateOrUpdateRecipeComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly recipeService: RecipeService,
    private readonly groupService: GroupService,
    private readonly browserService: BrowserService,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    if (this.browserService.isBrowser) {
      this.getMyGroups();
      this.getRecipe(this.getUrlRecipeId());
    }
  }

  getUrlRecipeId(): number {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if(id !== 0){
      this.id = id;
    }
    return id;
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
    image: [null as File | null],
    groups: [[] as number[]],
  });

  public typeList: Options[] = Recipe.options;
  public previewUrl: string | null = null;
  public isLoading: boolean = false;
  public myGroups: Group[] = [];
  public isCreate: boolean = false;
  public id: number | null = null;

  onFileSelect(event: any): void {
    const file: File = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.form.get('image')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  setImageUrl(url: string | null | undefined): string {
    return setImageUrl(url);
  }

  cancelAdd(): void {}

  save() {
    if (this.form.valid) {
      this.add();
    } else {
      updateFailedInputs(this.form);
      this.notificationService.showError(
        'Erreur de validation',
        'Veuillez vérifier les champs du formulaire.'
      );
    }
  }

  add() {
    this.isLoading = true;
    this.recipeService
      .create(
        this.form.get('type')?.value!,
        this.form.get('name')?.value!,
        this.form.get('description')?.value!,
        this.form.get('groups')?.value!
      )
      .subscribe({
        next: (recipe) => {
          if (this.form.get('image')?.value) {
            this.uploadFile(recipe.id);
          }
          this.notificationService.showSuccess(
            'Recette ajoutée',
            `La recette ${recipe.name} a été ajoutée avec succès.`
          );
        },
        error: (error) => {
          this.notificationService.showError(
            "Erreur lors de l'ajout",
            "Une erreur est survenue lors de l'ajout de la recette."
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  getMyGroups() {
    this.groupService.getAllMinimal().subscribe({
      next: (groups) => {
        this.myGroups = groups;
      },
      error: (error) => {
        this.notificationService.showError(
          'Erreur lors de la récupération des groupes',
          'Une erreur est survenue lors de la récupération des groupes.'
        );
      },
    });
  }

  uploadFile(id: number) {
    const file = this.form.get('image')?.value;
    if (file) {
      this.recipeService.uploadFile(id, file).subscribe({
        next: () => {
          this.notificationService.showSuccess(
            'Image enregistrée',
            'L\'image a été enregistré avec succès.'
          );
        },
        error: (error) => {
          console.error(error);
          this.notificationService.showError(
            'Erreur lors de l\'enregistremement de l\'image',
            'Une erreur est survenue lors de l\'enregistremement de l\'image.'
          );
        },
      });
    }
  }

  getRecipe(id: number) {
    if(id !== 0) {
      this.recipeService.getById(id).subscribe({
        next: (recipe) => {
          this.form.patchValue({
            name: recipe.name,
            description: recipe.description,
            type: recipe.type,
            groups: recipe.groups.map((group) => group.id),
          });
          this.getFile(recipe);
        },
        error: (error) => {
          this.notificationService.showError(
            'Erreur lors de la récupération de la recette',
            'Une erreur est survenue lors de la récupération de la recette.'
          );
        },
      });
    } else {
      this.isCreate = true;
    }
  }

  getFile(recipe: Recipe) {
    this.recipeService.getFile(recipe.id).subscribe({
      next: (blob: Blob) => {
        const file = new File([blob], 'image.jpg', { type: blob.type, lastModified: Date.now() });
        const url = URL.createObjectURL(file);
        this.previewUrl = url;
        this.form.patchValue({
          image: file,
        });
      },      
      error: (error: any) => {
        this.notificationService.showError('Failed to load file', error.message);
      }
    });
  }

  update() {
    this.isLoading = true;
    this.recipeService
      .patch(
        this.getUrlRecipeId(),
        this.form.get('type')?.value!,
        this.form.get('name')?.value!,
        this.form.get('description')?.value!,
        this.form.get('groups')?.value!
      )
      .subscribe({
        next: () => {
          if (this.form.get('image')?.value) {
            this.uploadFile(this.getUrlRecipeId());
          }
          this.notificationService.showSuccess(
            'Recette modifiée',
            `La recette a été modifiée avec succès.`
          );
        },
        error: (error) => {
          this.notificationService.showError(
            "Erreur lors de la modification",
            "Une erreur est survenue lors de la modification de la recette."
          );
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
