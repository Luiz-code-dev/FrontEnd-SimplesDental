import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class UserValidators {
  static name(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return { required: true };
      }

      if (value.length > 100) {
        return { maxlength: { requiredLength: 100, actualLength: value.length } };
      }

      return null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return { required: true };
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return { email: true };
      }

      if (value.length > 100) {
        return { maxlength: { requiredLength: 100, actualLength: value.length } };
      }

      return null;
    };
  }

  static password(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return { required: true };
      }

      if (value.length < 6) {
        return { minlength: { requiredLength: 6, actualLength: value.length } };
      }

      if (value.length > 50) {
        return { maxlength: { requiredLength: 50, actualLength: value.length } };
      }

      return null;
    };
  }

  static role(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return { required: true };
      }

      if (!['admin', 'user'].includes(value)) {
        return { invalidRole: true };
      }

      return null;
    };
  }
}
