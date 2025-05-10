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
    }
  }

  form = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    type: ['', Validators.required],
    image: [null as File | null],
    groups: [[]],
  });

  public typeList: Options[] = Recipe.options;
  public previewUrl: string | null = null;
  public isLoading: boolean = false;
  public myGroups: Group[] = [];

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
}
