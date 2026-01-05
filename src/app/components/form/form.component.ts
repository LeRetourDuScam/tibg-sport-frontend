import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { AiService } from '../../services/ai.service';
import { LanguageService } from '../../services/language.service';
import { StateService } from '../../services/state.service';
import { ProfileValidators } from '../../validators/profile.validators';
import { LucideAngularModule } from 'lucide-angular';
import {
  Gender,
  FitnessLevel,
  ExerciseFrequency,
  MainGoal,
  LocationPreference,
  TeamPreference,
  AvailableTime,
  PreferredTime,
  WorkType,
  SleepQuality,
  StressLevel,
  MusicPreference,
  ExperienceLevel,
  PreferredTone,
  LearningStyle
} from '../../enums/user-profile.enums';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, RouterLink, LucideAngularModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  userAndHealthForm!: FormGroup;
  goalAndMotivationForm!: FormGroup;
  lifestyleAvailabilityForm!: FormGroup;

  isSubmitting = false;
  currentStep = 0;
  totalSteps!: number;
  snackbarVisible = false;
  snackbarMessage = '';

  private destroy$ = new Subject<void>();

  lastSaved: Date | null = null;
  showTooltip: string | null = null;
  estimatedTimePerStep!: number[];

  Gender = Gender;
  FitnessLevel = FitnessLevel;
  ExerciseFrequency = ExerciseFrequency;
  MainGoal = MainGoal;
  LocationPreference = LocationPreference;
  TeamPreference = TeamPreference;
  AvailableTime = AvailableTime;
  PreferredTime = PreferredTime;
  WorkType = WorkType;
  SleepQuality = SleepQuality;
  StressLevel = StressLevel;
  MusicPreference = MusicPreference;
  ExperienceLevel = ExperienceLevel;
  PreferredTone = PreferredTone;
  LearningStyle = LearningStyle;

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private router: Router,
    private languageService: LanguageService,
    private stateService: StateService
  ) { }

  ngOnInit() {
    this.initForms();
    this.loadSavedProgress();
    this.setupAutoSave();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupAutoSave() {
    this.userForm.valueChanges
      .pipe(
        debounceTime(2000),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.saveProgress();
      });
  }

  saveProgress() {
    const formData = {
      step: this.currentStep,
      userAndHealth: this.userAndHealthForm.value,
      goalAndMotivation: this.goalAndMotivationForm.value,
      lifestyleAvailability: this.lifestyleAvailabilityForm.value
    };
    this.stateService.setFormProgress(formData);
    this.lastSaved = new Date();
  }

  loadSavedProgress() {
    const saved = this.stateService.getFormProgress();
    if (saved) {
      try {
        this.currentStep = saved.step || 0;
        if (saved.userAndHealth) this.userAndHealthForm.patchValue(saved.userAndHealth);
        if (saved.goalAndMotivation) this.goalAndMotivationForm.patchValue(saved.goalAndMotivation);
        if (saved.lifestyleAvailability) this.lifestyleAvailabilityForm.patchValue(saved.lifestyleAvailability);
      } catch (e) {
        console.error('Error loading saved progress', e);
      }
    }
  }

  clearSavedProgress() {
    this.stateService.clearFormProgress();
  }

  toggleTooltip(field: string) {
    this.showTooltip = this.showTooltip === field ? null : field;
  }

  get remainingTime(): number {
    let time = 0;
    for (let i = this.currentStep; i < this.totalSteps; i++) {
      time += this.estimatedTimePerStep[i];
    }
    return time;
  }

  get completionPercentage(): number {
    return Math.round((this.currentStep / this.totalSteps) * 100);
  }

  initForms() {
    this.userAndHealthForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(100), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      fitnessLevel: ['', Validators.required],
      exerciseFrequency: ['', Validators.required],
      healthConditions: [''],
      injuries: ['']
    });

    this.goalAndMotivationForm = this.fb.group({
      mainGoal: ['', [Validators.required, Validators.maxLength(200)]],
      availableTime: ['', Validators.required],
      availableDays: ['', [Validators.required, Validators.min(1), Validators.max(7)]]
    });

    this.lifestyleAvailabilityForm = this.fb.group({
      locationPreference: ['', Validators.required],
      teamPreference: ['', Validators.required],
      practisedSports: [''],
      language: [this.languageService.getCurrentLanguage(), Validators.required]
    });

    this.userForm = this.fb.group({
      step1: this.userAndHealthForm,
      step2: this.goalAndMotivationForm,
      step3: this.lifestyleAvailabilityForm
    });

    this.totalSteps = 3;
    this.estimatedTimePerStep = [3, 2, 2];
  }
  nextStep() {
    const currentForm = this.getCurrentStepForm();

    if (currentForm && currentForm.valid) {
      this.currentStep++;
    } else {
      if (currentForm) {
        currentForm.markAllAsTouched();
      }
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step < this.currentStep) {
      this.currentStep = step;
    }
  }

  getCurrentStepForm(): FormGroup | null {
    switch (this.currentStep) {
      case 0:
        return this.userAndHealthForm;
      case 1:
        return this.goalAndMotivationForm;
      case 2:
        return this.lifestyleAvailabilityForm;
      default:
        return null;
    }
  }

  isStepValid(): boolean {
    const currentForm = this.getCurrentStepForm();
    return currentForm ? currentForm.valid : false;
  }

  showSnackbar(message: string) {
    this.snackbarMessage = message;
    this.snackbarVisible = true;
    setTimeout(() => {
      this.snackbarVisible = false;
    }, 2000);
  }

  onSubmit() {
    this.isSubmitting = true;

    const formData = {
      ...this.userAndHealthForm.value,
      ...this.goalAndMotivationForm.value,
      ...this.lifestyleAvailabilityForm.value
    };

    this.aiService.analyzeProfile(formData).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.clearSavedProgress();

        this.stateService.setRecommendation(result, formData);

        this.router.navigate(['/results']);
      },
      error: (error) => {
        this.showSnackbar('An error occurred. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
