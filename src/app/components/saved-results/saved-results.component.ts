import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Archive, Trash2, Download, FileText, Home, ArrowLeft } from 'lucide-angular';
import { ResultsStorageService, SavedResult } from '../../services/results-storage.service';
import { PdfExportService } from '../../services/pdf-export-enhanced.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-saved-results',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, LucideAngularModule],
  templateUrl: './saved-results.component.html',
  styleUrls: ['./saved-results.component.css']
})
export class SavedResultsComponent implements OnInit {
  savedResults: SavedResult[] = [];

  readonly ArchiveIcon = Archive;
  readonly Trash2Icon = Trash2;
  readonly DownloadIcon = Download;
  readonly FileTextIcon = FileText;
  readonly HomeIcon = Home;
  readonly ArrowLeftIcon = ArrowLeft;

  constructor(
    private resultsStorageService: ResultsStorageService,
    private pdfExportService: PdfExportService,
    private snackbar: SnackbarService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSavedResults();
  }

  loadSavedResults() {
    this.savedResults = this.resultsStorageService.getSavedResults();
  }

  viewResult(result: SavedResult) {
    this.router.navigate(['/results'], {
      state: {
        data: result.recommendation,
        userProfile: result.userProfile
      }
    });
  }

  exportResult(result: SavedResult, event: Event) {
    event.stopPropagation();
    try {
      this.pdfExportService.exportEnhancedPDF(result.recommendation, result.userProfile);
      this.snackbar.success('PDF exporté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      this.snackbar.error('Erreur lors de la génération du PDF');
    }
  }

  deleteResult(id: string, event: Event) {
    event.stopPropagation();
    this.snackbar.info('Supprimer ce résultat ?');
    const success = this.resultsStorageService.deleteResult(id);
    if (success) {
      this.loadSavedResults();
      this.snackbar.success('Résultat supprimé');
    }
  }

  clearAll() {
    this.snackbar.warning('Supprimer tous les résultats ?');
    this.resultsStorageService.clearAllResults();
    this.loadSavedResults();
    this.snackbar.success('Tous les résultats ont été supprimés');
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTimeSince(timestamp: string): string {
    const now = new Date().getTime();
    const past = new Date(timestamp).getTime();
    const diff = now - past;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (hours < 24) {
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (days < 7) {
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return this.formatDate(timestamp);
    }
  }
}
