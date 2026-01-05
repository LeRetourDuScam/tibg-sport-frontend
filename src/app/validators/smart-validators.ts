import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
export class SmartValidators {


  static validateBMI(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const height = formGroup.get('height')?.value;
      const weight = formGroup.get('weight')?.value;

      if (!height || !weight) {
        return null;
      }

      const bmi = weight / Math.pow(height / 100, 2);

      if (bmi < 13 || bmi > 50) {
        return {
          invalidBMI: {
            value: bmi.toFixed(1),
            translationKey: 'VALIDATION.INVALID_BMI',
            translationParams: { bmi: bmi.toFixed(1) }
          }
        };
      }

      return null;
    };
  }

  static ageConsistentWithGoals(control: AbstractControl): ValidationErrors | null {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) {
      return null;
    }

    const age = formGroup.get('age')?.value;
    const mainGoal = formGroup.get('mainGoal')?.value;

    if (age && age < 18 && mainGoal?.toLowerCase().includes('competition')) {
      return {
        ageGoalMismatch: {
          translationKey: 'VALIDATION.AGE_GOAL_MISMATCH_MINOR'
        }
      };
    }

    if (age && age > 65 && mainGoal?.toLowerCase().includes('competition')) {
      return {
        ageGoalWarning: {
          translationKey: 'VALIDATION.AGE_GOAL_WARNING_SENIOR'
        }
      };
    }

    return null;
  }


  static realisticAge(control: AbstractControl): ValidationErrors | null {
    const age = control.value;

    if (!age) {
      return null;
    }

    if (age < 18 || age > 100) {
      return {
        unrealisticAge: {
          translationKey: 'VALIDATION.UNREALISTIC_AGE'
        }
      };
    }

    return null;
  }


  static frequencyConsistentWithTime(control: AbstractControl): ValidationErrors | null {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) {
      return null;
    }

    const frequency = formGroup.get('exerciseFrequency')?.value;
    const availableDays = formGroup.get('availableDays')?.value;

    if (!frequency || !availableDays) {
      return null;
    }

    const frequencyToDays: { [key: string]: number } = {
      'Never': 0,
      'OneToTwo': 2,
      'ThreeToFour': 4,
      'FivePlus': 5
    };

    const expectedDays = frequencyToDays[frequency];

    if (expectedDays && availableDays < expectedDays - 1) {
      return {
        frequencyTimeMismatch: {
          translationKey: 'VALIDATION.FREQUENCY_TIME_MISMATCH'
        }
      };
    }

    return null;
  }

  static timeRealisticForGoal(control: AbstractControl): ValidationErrors | null {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) {
      return null;
    }

    const availableTime = formGroup.get('availableTime')?.value;
    const mainGoal = formGroup.get('mainGoal')?.value;

    if (!availableTime || !mainGoal) {
      return null;
    }

    if (mainGoal.toLowerCase().includes('competition') && availableTime === 'FifteenMin') {
      return {
        timeGoalMismatch: {
          translationKey: 'VALIDATION.TIME_GOAL_MISMATCH'
        }
      };
    }

    return null;
  }


  static fitnessConsistentWithFrequency(control: AbstractControl): ValidationErrors | null {
    const formGroup = control.parent as FormGroup;
    if (!formGroup) {
      return null;
    }

    const fitnessLevel = formGroup.get('fitnessLevel')?.value;
    const frequency = formGroup.get('exerciseFrequency')?.value;

    if (!fitnessLevel || !frequency) {
      return null;
    }

    if (fitnessLevel === 'Sedentary' && (frequency === 'ThreeToFour' || frequency === 'FivePlus')) {
      return {
        fitnessFrequencyMismatch: {
          translationKey: 'VALIDATION.FITNESS_FREQUENCY_MISMATCH'
        }
      };
    }

    if (fitnessLevel === 'Intense' && frequency === 'Never') {
      return {
        fitnessFrequencyImpossible: {
          translationKey: 'VALIDATION.FITNESS_FREQUENCY_IMPOSSIBLE'
        }
      };
    }

    return null;
  }
}
