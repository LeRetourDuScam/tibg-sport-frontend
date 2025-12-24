import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { SportRecommendation } from '../models/SportRecommendation.model';
import { UserProfile } from '../models/UserProfile.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private readonly APP_VERSION = '1.0.0';
  private readonly BRAND_NAME = 'FytAI';
  private readonly WEBSITE = 'www.fytai.com';

  constructor(private translate: TranslateService) {}

  async exportEnhancedPDF(
    recommendation: SportRecommendation,
    userProfile: UserProfile
  ): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (2 * margin);
      let yPos = 20;

      this.addHeader(pdf, pageWidth, margin);

      yPos = 55;
      yPos = this.addMetadata(pdf, margin, yPos, userProfile);

      yPos = this.addSportRecommendation(pdf, margin, contentWidth, yPos, recommendation);

      yPos = this.addUserProfileSummary(pdf, margin, contentWidth, yPos, userProfile);

      if (yPos > 240) {
        pdf.addPage();
        yPos = 20;
      }

      yPos = this.addBenefitsAndPrecautions(pdf, margin, contentWidth, yPos, recommendation);

      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }

      yPos = this.addExercises(pdf, margin, contentWidth, yPos, recommendation);

      if (recommendation.trainingPlan && yPos > 200) {
        pdf.addPage();
        yPos = 20;
      }

      if (recommendation.trainingPlan) {
        yPos = this.addTrainingPlan(pdf, margin, contentWidth, yPos, recommendation);
      }

      if (recommendation.alternatives && recommendation.alternatives.length > 0 && yPos > 200) {
        pdf.addPage();
        yPos = 20;
      }

      if (recommendation.alternatives && recommendation.alternatives.length > 0) {
        yPos = this.addAlternatives(pdf, margin, contentWidth, yPos, recommendation);
      }

      this.addFooter(pdf, pageWidth, pageHeight, margin);

      const fileName = `${this.BRAND_NAME}_${recommendation.sport.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error(this.translate.instant('PDF.ERROR_GENERATE'));
    }
  }

  private addHeader(pdf: jsPDF, pageWidth: number, margin: number) {
    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(this.BRAND_NAME, margin, 18);

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(this.translate.instant('PDF.SUBTITLE'), margin, 28);

    pdf.setFontSize(8);
    pdf.text(this.translate.instant('PDF.CONFIDENTIAL'), margin, 35);
  }

  private addMetadata(pdf: jsPDF, margin: number, yPos: number, userProfile: UserProfile): number {
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');

    const date = new Date().toLocaleDateString(this.translate.currentLang || 'fr', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    pdf.text(`${this.translate.instant('PDF.GENERATED_ON')}: ${date}`, margin, yPos);
    yPos += 5;
    pdf.text(`${this.translate.instant('PDF.VERSION')}: ${this.APP_VERSION}`, margin, yPos);
    yPos += 5;
    pdf.text(`${this.translate.instant('PDF.PROFILE')}: ${userProfile.gender}, ${userProfile.age} ${this.translate.instant('PDF.YEARS')}`, margin, yPos);
    yPos += 10;

    return yPos;
  }

  private addSportRecommendation(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    recommendation: SportRecommendation
  ): number {
    pdf.setFillColor(243, 244, 246);
    pdf.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    const sportY = yPos + 12;
    pdf.text(recommendation.sport, margin + contentWidth / 2, sportY, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    const scoreY = sportY + 10;
    pdf.text(
      `${recommendation.score}% ${this.translate.instant('PDF.COMPATIBILITY')}`,
      margin + contentWidth / 2,
      scoreY,
      { align: 'center' }
    );

    yPos += 35;

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'italic');
    const reasonLines = pdf.splitTextToSize(recommendation.reason, contentWidth);
    pdf.text(reasonLines, margin, yPos);
    yPos += reasonLines.length * 6 + 10;

    return yPos;
  }

  private addUserProfileSummary(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    userProfile: UserProfile
  ): number {
    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.YOUR_PROFILE'));
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');

    const profileData = [
      [`${this.translate.instant('PDF.AGE')}: ${userProfile.age} ${this.translate.instant('PDF.YEARS')}`, `${this.translate.instant('PDF.GENDER')}: ${userProfile.gender}`],
      [`${this.translate.instant('PDF.HEIGHT')}: ${userProfile.height} cm`, `${this.translate.instant('PDF.WEIGHT')}: ${userProfile.weight} kg`],
      [`${this.translate.instant('PDF.FITNESS_LEVEL')}: ${userProfile.fitnessLevel}`, `${this.translate.instant('PDF.EXERCISE_FREQ')}: ${userProfile.exerciseFrequency}`],
      [`${this.translate.instant('PDF.MAIN_GOAL')}: ${userProfile.mainGoal}`, `${this.translate.instant('PDF.AVAILABLE_DAYS')}: ${userProfile.availableDays}/7`]
    ];

    const colWidth = contentWidth / 2;
    profileData.forEach(row => {
      pdf.text(row[0], margin, yPos);
      pdf.text(row[1], margin + colWidth, yPos);
      yPos += 5;
    });

    yPos += 8;
    return yPos;
  }

  private addBenefitsAndPrecautions(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    recommendation: SportRecommendation
  ): number {
    const colWidth = (contentWidth - 5) / 2;

    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.BENEFITS'));
    let benefitsY = yPos + 8;

    pdf.setFontSize(9);
    pdf.setTextColor(34, 139, 34);
    pdf.setFont('helvetica', 'normal');

    recommendation.benefits.forEach(benefit => {
      const lines = pdf.splitTextToSize(`• ${benefit}`, colWidth - 5);
      pdf.text(lines, margin + 2, benefitsY);
      benefitsY += lines.length * 5;
    });

    this.addSectionTitle(pdf, margin + colWidth + 5, yPos, this.translate.instant('PDF.PRECAUTIONS'));
    let precautionsY = yPos + 8;

    pdf.setTextColor(180, 83, 9);
    recommendation.precautions.forEach(precaution => {
      const lines = pdf.splitTextToSize(`• ${precaution}`, colWidth - 5);
      pdf.text(lines, margin + colWidth + 7, precautionsY);
      precautionsY += lines.length * 5;
    });

    yPos = Math.max(benefitsY, precautionsY) + 8;
    return yPos;
  }

  private addExercises(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    recommendation: SportRecommendation
  ): number {
    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.EXERCISES'));
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    recommendation.exercises.forEach((exercise, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${exercise.name}`, margin, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      const descLines = pdf.splitTextToSize(exercise.description, contentWidth - 10);
      pdf.text(descLines, margin + 3, yPos);
      yPos += descLines.length * 5;

      if (exercise.duration || exercise.repetitions) {
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        let details = [];
        if (exercise.duration) details.push(`${this.translate.instant('PDF.DURATION')}: ${exercise.duration}`);
        if (exercise.repetitions) details.push(`${this.translate.instant('PDF.REPS')}: ${exercise.repetitions}`);
        pdf.text(details.join(' | '), margin + 3, yPos);
        yPos += 5;
        pdf.setFontSize(9);
      }

      pdf.setTextColor(0, 0, 0);
      yPos += 3;
    });

    yPos += 5;
    return yPos;
  }

  private addTrainingPlan(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    recommendation: SportRecommendation
  ): number {
    if (!recommendation.trainingPlan) return yPos;

    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.TRAINING_PLAN'));
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    const plan = recommendation.trainingPlan;

    if (plan.progressionTips && plan.progressionTips.length > 0) {
      plan.progressionTips.forEach((tip: string, index: number) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }

        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(60, 60, 60);
        const tipLines = pdf.splitTextToSize(`\u2022 ${tip}`, contentWidth);
        pdf.text(tipLines, margin, yPos);
        yPos += tipLines.length * 5 + 2;

        pdf.setTextColor(0, 0, 0);
        yPos += 3;
      });
    }

    yPos += 5;
    return yPos;
  }

  private addAlternatives(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    recommendation: SportRecommendation
  ): number {
    if (!recommendation.alternatives || recommendation.alternatives.length === 0) return yPos;

    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.ALTERNATIVES'));
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    recommendation.alternatives.forEach((alt, index) => {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFont('helvetica', 'bold');
      pdf.text(`${index + 1}. ${alt.sport} (${alt.score}%)`, margin, yPos);
      yPos += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      const reasonLines = pdf.splitTextToSize(alt.reason, contentWidth - 10);
      pdf.text(reasonLines, margin + 3, yPos);
      yPos += reasonLines.length * 5 + 5;

      pdf.setTextColor(0, 0, 0);
    });

    return yPos;
  }

  private addSectionTitle(pdf: jsPDF, x: number, y: number, title: string) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text(title, x, y);
    pdf.setDrawColor(59, 130, 246);
    pdf.setLineWidth(0.5);
    pdf.line(x, y + 1, x + 40, y + 1);
  }

  private addFooter(pdf: jsPDF, pageWidth: number, pageHeight: number, margin: number) {
    const pageCount = pdf.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);

      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

      pdf.text(`${this.BRAND_NAME} - ${this.translate.instant('PDF.TAGLINE')}`, margin, pageHeight - 10);
      pdf.text(`${this.translate.instant('PDF.PAGE')} ${i} / ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text(this.WEBSITE, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }
  }
}
