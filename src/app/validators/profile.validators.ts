import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ProfileValidators {
  static validBMI(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control.parent as FormGroup;
      if (!form) return null;

      const height = form.get('height')?.value;
      const weight = form.get('weight')?.value;

      if (height && weight) {
        const bmi = weight / Math.pow(height / 100, 2);
        if (bmi < 10 || bmi > 60) {
          return { invalidBMI: { value: bmi } };
        }
      }
      return null;
    };
  }

  static realisticAge(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const age = control.value;
      if (age !== null && age !== undefined && (age < 13 || age > 100)) {
        return { unrealisticAge: { value: age } };
      }
      return null;
    };
  }

  static consistentMeasurements(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control.parent as FormGroup;
      if (!form) return null;

      const height = form.get('height')?.value;
      const legLength = form.get('legLength')?.value;

      if (legLength && height && legLength > height * 0.7) {
        return { inconsistentMeasurements: true };
      }
      return null;
    };
  }
}
