import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CategoryValidators {
  static nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return { required: true };
      }

      if (value.length > 100) {
        return { maxLength: true };
      }

      return null;
    };
  }

  static descriptionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value && value.length > 255) {
        return { maxLength: true };
      }

      return null;
    };
  }
}
