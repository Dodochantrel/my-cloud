import { Form, FormGroup } from "@angular/forms";

export function updateFailedInputs(form: FormGroup): FormGroup {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
      control?.markAsDirty({ onlySelf: true });
    });
    return form;
  }