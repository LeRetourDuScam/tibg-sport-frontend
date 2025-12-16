import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AiService } from '../../services/ai.service';
import { LanguageService } from '../../services/language.service';
import {
  Gender,
  FitnessLevel,
  ActivityLevel,
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
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnDestroy {
  userForm!: FormGroup;
  userAndHealthForm!: FormGroup;
  goalAndMotivationForm!: FormGroup;
  lifestyleAvailabilityForm!: FormGroup;
  trainingPreferencesForm!: FormGroup;
  communicationPreferencesForm!: FormGroup;
  isSubmitting = false;
  currentStep = 0;
  totalSteps = 5;
  snackbarVisible = false;
  snackbarMessage = '';
  
  // New properties for UX improvements
  autoSaveInterval: any;
  lastSaved: Date | null = null;
  showTooltip: string | null = null;
  estimatedTimePerStep = [4, 2, 3, 3, 1]; // minutes per step

  Gender = Gender;
  FitnessLevel = FitnessLevel;
  ActivityLevel = ActivityLevel;
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
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.initForms();
    this.loadSavedProgress();
    this.startAutoSave();
  }

  ngOnDestroy() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
  }

  // Auto-save functionality
  startAutoSave() {
    this.autoSaveInterval = setInterval(() => {
      this.saveProgress();
    }, 30000); // Save every 30 seconds
  }

  saveProgress() {
    const formData = {
      step: this.currentStep,
      userAndHealth: this.userAndHealthForm.value,
      goalAndMotivation: this.goalAndMotivationForm.value,
      lifestyleAvailability: this.lifestyleAvailabilityForm.value,
      trainingPreferences: this.trainingPreferencesForm.value,
      communicationPreferences: this.communicationPreferencesForm.value
    };
    localStorage.setItem('fytai_form_progress', JSON.stringify(formData));
    this.lastSaved = new Date();
  }

  loadSavedProgress() {
    const saved = localStorage.getItem('fytai_form_progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.currentStep = data.step || 0;
        if (data.userAndHealth) this.userAndHealthForm.patchValue(data.userAndHealth);
        if (data.goalAndMotivation) this.goalAndMotivationForm.patchValue(data.goalAndMotivation);
        if (data.lifestyleAvailability) this.lifestyleAvailabilityForm.patchValue(data.lifestyleAvailability);
        if (data.trainingPreferences) this.trainingPreferencesForm.patchValue(data.trainingPreferences);
        if (data.communicationPreferences) this.communicationPreferencesForm.patchValue(data.communicationPreferences);
      } catch (e) {
        console.error('Error loading saved progress', e);
      }
    }
  }

  clearSavedProgress() {
    localStorage.removeItem('fytai_form_progress');
  }

  // Tooltip functionality
  toggleTooltip(field: string) {
    this.showTooltip = this.showTooltip === field ? null : field;
  }

  // Time estimation
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
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(300)]],
      legLength: ['', [Validators.required]],
      armLength: ['', [Validators.required]],
      waistSize: ['', [Validators.required]],
      fitnessLevel: ['', Validators.required],
      exerciseFrequency: ['', Validators.required],
      jointProblems: [false],
      kneeProblems: [false],
      backProblems: [false],
      heartProblems: [false],
      otherHealthIssues: [''],
      injuries: [''],
      allergies: ['']
    });

    this.goalAndMotivationForm = this.fb.group({
      mainGoal: ['', Validators.required],
      specificGoals: [''],
      motivations: [''],
      fears: ['']
    });

    this.lifestyleAvailabilityForm = this.fb.group({
      availableTime: ['', Validators.required],
      preferredTime: ['', Validators.required],
      availableDays: [0],
      workType: ['', Validators.required],
      sleepQuality: ['', Validators.required],
      stressLevel: ['', Validators.required],
      lifestyle: ['']
    });

    this.trainingPreferencesForm = this.fb.group({
      locationPreference: ['', Validators.required],
      musicPreference: ['', Validators.required],
      socialPreference: ['', Validators.required],
      exercisePreferences: [''],
      exerciseAversions: [''],
      equipmentAvailable: [''],
      pastExperienceWithFitness: ['', Validators.required],
      practisedSports: [''],
      favoriteActivity: [''],
      successFactors: [''],
      primaryChallenges: [''],
      supportSystem: ['']
    });

    this.communicationPreferencesForm = this.fb.group({
      preferredTone: ['', Validators.required],
      learningStyle: ['', Validators.required]
    });

    this.userForm = this.fb.group({
      step1: this.userAndHealthForm,
      step2: this.goalAndMotivationForm,
      step3: this.lifestyleAvailabilityForm,
      step4: this.trainingPreferencesForm,
      step5: this.communicationPreferencesForm
    });
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
      case 3:
        return this.trainingPreferencesForm;
      case 4:
        return this.communicationPreferencesForm;
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
      ...this.lifestyleAvailabilityForm.value,
      ...this.trainingPreferencesForm.value,
      ...this.communicationPreferencesForm.value,
      language: this.languageService.getCurrentLanguage()
    };


    this.aiService.analyzeProfile(formData).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.clearSavedProgress(); // Clear saved progress on successful submission
        this.router.navigate(['/resultats'], { state: { data: result } });
      },
      error: (error) => {
        this.showSnackbar('An error occurred. Please try again.');
        this.isSubmitting = false;
      }
    });
  }
}
