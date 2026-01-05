import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SportRecommendation } from '../models/SportRecommendation.model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  async exportSimplePDF(recommendation: SportRecommendation, userName?: string): Promise<void> {
    try {
      const pdf = new jsPDF();
      const margin = 15;
      const pageWidth = 210;
      let yPos = 20;

      // En-tête
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FytAI', margin, yPos);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Recommandation sportive personnalisée', margin, yPos + 8);

      // Date
      pdf.setFontSize(9);
      const dateStr = new Date().toLocaleDateString('fr-FR');
      pdf.text(dateStr, pageWidth - margin, yPos + 15, { align: 'right' });

      yPos = 55;

      // Sport recommandé
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(recommendation.sport, margin, yPos);
      yPos += 10;

      pdf.setFontSize(14);
      pdf.setTextColor(59, 130, 246);
      pdf.text(`${recommendation.score}% de compatibilité`, margin, yPos);
      yPos += 15;

      // Raison
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const reasonLines = pdf.splitTextToSize(recommendation.reason, pageWidth - 2 * margin);
      pdf.text(reasonLines, margin, yPos);
      yPos += reasonLines.length * 6 + 10;

      // Bénéfices
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Bénéfices', margin, yPos);
      yPos += 7;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPos += 5;

      // Précautions
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Précautions', margin, yPos);
      yPos += 7;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      // Pied de page
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('FytAI - Intelligence Artificielle pour votre santé', margin, 287);

      const fileName = `FytAI_${recommendation.sport.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Impossible de générer le PDF.');
    }
  }
}
