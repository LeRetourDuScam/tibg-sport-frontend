import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SportRecommendation } from '../models/SportRecommendation.model';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {

  constructor() { }

  /**
   * Exporte les résultats en PDF professionnel
   */
  async exportResultsToPDF(
    elementId: string,
    recommendation: SportRecommendation,
    userName?: string
  ): Promise<void> {
    try {
      // Utiliser directement la version simplifiée pour éviter les problèmes avec oklch
      // html2canvas ne supporte pas les couleurs oklch de Tailwind CSS 4.x
      await this.exportSimplePDF(recommendation, userName);
      return;

      /* Version avec html2canvas désactivée temporairement
      const element = document.getElementById(elementId);

      if (!element) {
        throw new Error('Élément à exporter introuvable');
      }

      // Masquer temporairement les éléments non nécessaires dans le PDF
      const chatbot = document.querySelector('app-chatbot');
      const buttons = element.querySelectorAll('button');
      const originalDisplay: string[] = [];

      // Sauvegarder et masquer
      if (chatbot) {
        originalDisplay.push((chatbot as HTMLElement).style.display);
        (chatbot as HTMLElement).style.display = 'none';
      }
      buttons.forEach(btn => {
        originalDisplay.push((btn as HTMLElement).style.display);
        (btn as HTMLElement).style.display = 'none';
      });

      // Capturer l'élément en image
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafafa'
      });
      */

      /* Version avec canvas désactivée - code commenté
      // Restaurer l'affichage
      if (chatbot) {
        (chatbot as HTMLElement).style.display = originalDisplay.shift() || '';
      }
      buttons.forEach(btn => {
        (btn as HTMLElement).style.display = originalDisplay.shift() || '';
      });

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Dimensions A4 en mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 15;
      const contentWidth = pdfWidth - (2 * margin);

      // En-tête personnalisé
      pdf.setFillColor(59, 130, 246); // Bleu
      pdf.rect(0, 0, pdfWidth, 40, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('FytAI', margin, 20);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Votre recommandation sportive personnalisée', margin, 28);

      if (userName) {
        pdf.setFontSize(10);
        pdf.text(`Pour: ${userName}`, margin, 35);
      }

      // Date
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      const dateStr = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      pdf.text(dateStr, pdfWidth - margin, 35, { align: 'right' });

      // Section principale - Badge du sport
      pdf.setTextColor(0, 0, 0);
      pdf.setFillColor(243, 244, 246);
      pdf.roundedRect(margin, 50, contentWidth, 25, 3, 3, 'F');

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(recommendation.sport, pdfWidth / 2, 62, { align: 'center' });

      pdf.setFontSize(14);
      pdf.setTextColor(59, 130, 246);
      pdf.text(`${recommendation.score}% de compatibilité`, pdfWidth / 2, 70, { align: 'center' });

      // Calcul de la hauteur de l'image
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Vérifier si on doit ajouter une nouvelle page
      let yPosition = 85;

      if (yPosition + imgHeight > pdfHeight - margin) {
        // Image trop grande, la redimensionner
        const maxHeight = pdfHeight - yPosition - margin - 10;
        const scaledHeight = Math.min(imgHeight, maxHeight);
        const scaledWidth = (canvas.width * scaledHeight) / canvas.height;

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, yPosition, scaledWidth, scaledHeight);

        yPosition += scaledHeight + 10;

        // Ajouter des pages supplémentaires si nécessaire
        if (imgHeight > maxHeight) {
          pdf.addPage();
          yPosition = margin;

          // Continuer à ajouter l'image sur les pages suivantes
          const remainingHeight = imgHeight - scaledHeight;
          const remainingCanvas = document.createElement('canvas');
          remainingCanvas.width = canvas.width;
          remainingCanvas.height = (remainingHeight * canvas.width) / scaledWidth;

          const ctx = remainingCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, -scaledHeight * (canvas.width / scaledWidth), canvas.width, canvas.height);
            const remainingImgData = remainingCanvas.toDataURL('image/png');
            pdf.addImage(remainingImgData, 'PNG', margin, yPosition, contentWidth, remainingHeight);
          }
        }
      } else {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight;
      }

      // Pied de page sur toutes les pages
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);

        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, pdfHeight - 15, pdfWidth - margin, pdfHeight - 15);

        pdf.text('FytAI - Intelligence Artificielle pour votre santé', margin, pdfHeight - 10);
        pdf.text(`Page ${i} / ${pageCount}`, pdfWidth - margin, pdfHeight - 10, { align: 'right' });
        pdf.text('www.fytai.com', pdfWidth / 2, pdfHeight - 10, { align: 'center' });
      }

      // Télécharger le PDF
      const fileName = `FytAI_Recommandation_${recommendation.sport.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      */

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw new Error('Impossible de générer le PDF. Veuillez réessayer.');
    }
  }

  /**
   * Exporte une version simplifiée en PDF (plus rapide)
   */
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
      recommendation.benefits.forEach(benefit => {
        const lines = pdf.splitTextToSize(`• ${benefit}`, pageWidth - 2 * margin - 5);
        pdf.text(lines, margin + 5, yPos);
        yPos += lines.length * 5 + 2;
      });

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
      recommendation.precautions.forEach(precaution => {
        const lines = pdf.splitTextToSize(`• ${precaution}`, pageWidth - 2 * margin - 5);
        pdf.text(lines, margin + 5, yPos);
        yPos += lines.length * 5 + 2;
      });

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
