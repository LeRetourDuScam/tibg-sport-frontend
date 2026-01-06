import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { SportRecommendation } from '../models/SportRecommendation.model';
import { UserProfile } from '../models/UserProfile.model';
import { TrainingPlan } from '../models/TrainingPlan.model';
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

      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
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

    recommendation.alternatives.forEach((alt, index) => {
      if (yPos > 260) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFillColor(248, 250, 252);
      const tempY = yPos;
      const reasonLines = pdf.splitTextToSize(alt.reason, contentWidth - 16);
      const boxHeight = 12 + (reasonLines.length * 4);
      pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 2, 2, 'F');

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`${index + 1}. ${alt.sport}`, margin + 3, yPos + 6);

      pdf.setFontSize(8);
      pdf.setTextColor(59, 130, 246);
      pdf.text(`${alt.score}%`, margin + contentWidth - 20, yPos + 6);

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);
      pdf.text(reasonLines, margin + 6, yPos + 11);

      yPos += boxHeight + 3;
    });

    return yPos + 5;
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

  async exportTrainingPlanPDF(
    trainingPlan: TrainingPlan,
    sportName: string,
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

      this.addTrainingPlanHeader(pdf, pageWidth, margin, sportName);

      yPos = 55;
      yPos = this.addTrainingPlanMetadata(pdf, margin, yPos, userProfile, trainingPlan);

      yPos = this.addTrainingPlanGoal(pdf, margin, contentWidth, yPos, trainingPlan);

      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }
      yPos = this.addEquipmentSection(pdf, margin, contentWidth, yPos, trainingPlan);

      for (let week of trainingPlan.weeks) {
        if (yPos > 200) {
          pdf.addPage();
          yPos = 20;
        }
        yPos = this.addWeekSection(pdf, margin, contentWidth, yPos, week);
      }

      if (yPos > 220) {
        pdf.addPage();
        yPos = 20;
      }
      yPos = this.addProgressionTips(pdf, margin, contentWidth, yPos, trainingPlan);

      this.addFooter(pdf, pageWidth, pageHeight, margin);

      const fileName = `${this.BRAND_NAME}_Training_Plan_${sportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Training plan PDF generation error:', error);
      throw new Error(this.translate.instant('PDF.ERROR_GENERATE'));
    }
  }

  private addTrainingPlanHeader(pdf: jsPDF, pageWidth: number, margin: number, sportName: string) {
    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, 0, pageWidth, 40, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    const title = `${sportName} ${this.translate.instant('PDF.TRAINING_PLAN')}`;
    const titleLines = pdf.splitTextToSize(title, pageWidth - (2 * margin));
    pdf.text(titleLines, margin, 16);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(this.translate.instant('PDF.PERSONALIZED_PLAN'), margin, 28);

    pdf.setFontSize(7);
    pdf.text(this.translate.instant('PDF.CONFIDENTIAL'), margin, 35);
  }

  private addTrainingPlanMetadata(
    pdf: jsPDF,
    margin: number,
    yPos: number,
    userProfile: UserProfile,
    trainingPlan: TrainingPlan
  ): number {
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');

    const date = new Date().toLocaleDateString(this.translate.currentLang || 'en', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    pdf.text(`${this.translate.instant('PDF.GENERATED_ON')}: ${date}`, margin, yPos);
    yPos += 5;
    pdf.text(`${this.translate.instant('PDF.DURATION')}: ${trainingPlan.durationWeeks} ${this.translate.instant('PDF.WEEKS')}`, margin, yPos);
    yPos += 5;
    pdf.text(`${this.translate.instant('PDF.PROFILE')}: ${userProfile.gender}, ${userProfile.age} ${this.translate.instant('PDF.YEARS')}`, margin, yPos);
    yPos += 10;

    return yPos;
  }

  private addTrainingPlanGoal(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    trainingPlan: TrainingPlan
  ): number {
    // Goal box
    pdf.setFillColor(243, 244, 246);
    const goalLines = pdf.splitTextToSize(trainingPlan.goal, contentWidth - 10);
    const boxHeight = Math.max(20, goalLines.length * 6 + 10);
    pdf.roundedRect(margin, yPos, contentWidth, boxHeight, 3, 3, 'F');

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(this.translate.instant('PDF.YOUR_GOAL'), margin + 5, yPos + 8);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(goalLines, margin + 5, yPos + 15);

    yPos += boxHeight + 10;
    return yPos;
  }

  private addEquipmentSection(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    trainingPlan: TrainingPlan
  ): number {
    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.REQUIRED_EQUIPMENT'));
    yPos += 7;

    // Compact equipment list with background
    pdf.setFillColor(243, 244, 246);
    const equipmentHeight = Math.max(trainingPlan.equipment.length * 4 + 4, 10);
    pdf.roundedRect(margin, yPos, contentWidth, equipmentHeight, 2, 2, 'F');

    pdf.setFontSize(8);
    pdf.setTextColor(60, 60, 60);
    pdf.setFont('helvetica', 'normal');

    trainingPlan.equipment.forEach((item, index) => {
      const itemLines = pdf.splitTextToSize(`• ${item}`, contentWidth - 8);
      pdf.text(itemLines, margin + 4, yPos + 4 + (index * 4));
    });

    yPos += equipmentHeight + 6;
    return yPos;
  }

  private addWeekSection(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    week: any
  ): number {
    pdf.setFillColor(59, 130, 246);
    pdf.roundedRect(margin, yPos, contentWidth, 9, 2, 2, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const weekTitle = `${this.translate.instant('PDF.WEEK')} ${week.weekNumber}: ${week.focus}`;
    const weekTitleLines = pdf.splitTextToSize(weekTitle, contentWidth - 6);
    pdf.text(weekTitleLines, margin + 3, yPos + 6);

    yPos += 12;

    week.sessions.forEach((session: any, index: number) => {
      if (yPos > 245) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, yPos, contentWidth, 7, 1, 1, 'F');

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${session.day} - ${session.type}`, margin + 2, yPos + 5);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(`${session.duration}min | ${session.intensity}`, margin + contentWidth - 35, yPos + 5);

      yPos += 9;

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(60, 60, 60);

      session.exercises.forEach((exercise: string) => {
        const exerciseLines = pdf.splitTextToSize(`• ${exercise}`, contentWidth - 8);
        pdf.text(exerciseLines, margin + 4, yPos);
        yPos += exerciseLines.length * 4;
      });

      if (session.notes) {
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(7);
        const notesLines = pdf.splitTextToSize(`${session.notes}`, contentWidth - 8);
        pdf.text(notesLines, margin + 4, yPos);
        yPos += notesLines.length * 3.5;
      }

      yPos += 4;
    });

    yPos += 3;
    return yPos;
  }

  private addProgressionTips(
    pdf: jsPDF,
    margin: number,
    contentWidth: number,
    yPos: number,
    trainingPlan: TrainingPlan
  ): number {
    this.addSectionTitle(pdf, margin, yPos, this.translate.instant('PDF.PROGRESSION_TIPS'));
    yPos += 7;

    pdf.setFillColor(254, 243, 199);

    let currentY = yPos + 4;
    pdf.setFontSize(8);
    trainingPlan.progressionTips.forEach((tip) => {
      const tipLines = pdf.splitTextToSize(`${tip}`, contentWidth - 12);
      currentY += tipLines.length * 4 + 2;
    });
    const tipsHeight = currentY - yPos + 4;

    pdf.roundedRect(margin, yPos, contentWidth, tipsHeight, 2, 2, 'F');

    pdf.setTextColor(146, 64, 14);
    pdf.setFont('helvetica', 'normal');

    let tipY = yPos + 5;
    trainingPlan.progressionTips.forEach((tip, index) => {
      const tipLines = pdf.splitTextToSize(`💡 ${tip}`, contentWidth - 12);
      pdf.text(tipLines, margin + 6, tipY);
      tipY += tipLines.length * 4 + 2;
    });

    yPos += tipsHeight + 6;
    return yPos;
  }
}
