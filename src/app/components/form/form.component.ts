import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AiService } from '../../services/ai.service';
import { LanguageService } from '../../services/language.service';
import {
  Gender,
  ActivityLevel,
  ExerciseFrequency,
  MainGoal,
  LocationPreference,
  TeamPreference,
  AvailableTime
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
  ActivityLevel = ActivityLevel;
  ExerciseFrequency = ExerciseFrequency;
  MainGoal = MainGoal;
  LocationPreference = LocationPreference;
  TeamPreference = TeamPreference;
  AvailableTime = AvailableTime;

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.userForm = this.fb.group({
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],

      height: ['', [Validators.required, Validators.min(50), Validators.max(250)]],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(300)]],
      legLength: ['', Validators.required],
      armLength: ['', Validators.required],
      waistSize: ['', Validators.required],

      activityLevel: ['', Validators.required],
      exerciseFrequency: ['', Validators.required],

      jointProblems: [false],
      kneeProblems: [false],
      backProblems: [false],
      heartProblems: [false],
      otherHealthIssues: [''],

      mainGoal: ['', Validators.required],
      practisedSports: [''],

      locationPreference: ['', Validators.required],
      teamPreference: ['', Validators.required],
      availableTime: ['', Validators.required]
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
