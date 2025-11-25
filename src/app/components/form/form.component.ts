import { Component } from '@angular/core';
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
export class FormComponent {
  userForm: FormGroup;
  isSubmitting = false;

  // Expose enums to template
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
  ) {
    this.userForm = this.fb.group({
      // Basic data
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(300)]],
      legLength: ['', Validators.required],
      armLength: ['', Validators.required],
      waistSize: ['', Validators.required],

      // Health and fitness
      fitnessLevel: ['', Validators.required],
      activityLevel: [''],
      exerciseFrequency: ['', Validators.required],
      healthConditions: [[]],
      jointProblems: [false],
      kneeProblems: [false],
      backProblems: [false],
      heartProblems: [false],
      otherHealthIssues: [''],
      injuries: [''],
      allergies: [''],

      // Goals and motivations
      mainGoal: ['', Validators.required],
      specificGoals: [[]],
      motivations: [[]],
      fears: [[]],

      // Lifestyle and availability
      availableTime: ['', Validators.required],
      preferredTime: [''],
      availableDays: [''],
      workType: [''],
      sleepQuality: [''],
      stressLevel: [''],

      // Training preferences
      exercisePreferences: [[]],
      exerciseAversions: [[]],
      locationPreference: ['', Validators.required],
      equipmentAvailable: [[]],
      musicPreference: [''],
      socialPreference: [''],
      teamPreference: [''],

      // History and experience
      practisedSports: [[]],
      favoriteActivity: [''],
      pastExperienceWithFitness: [''],
      successFactors: [[]],

      // Personal context
      primaryChallenges: [[]],
      lifestyle: [''],
      supportSystem: [''],

      // Communication preferences
      preferredTone: [''],
      learningStyle: ['']
    }); 
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.isSubmitting = true;
      const formData = {
        ...this.userForm.value,
        language: this.languageService.getCurrentLanguage()
      };

      this.aiService.analyzeProfile(formData).subscribe({
        next: (result) => {
          this.router.navigate(['/resultats'], { state: { data: result } });
        },
        error: (error) => {
          console.error('Error during analysis:', error);
          alert('An error occurred. Please try again.');
          this.isSubmitting = false;
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
