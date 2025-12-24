import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService, SnackbarConfig } from '../../services/snackbar.service';
import { Subscription } from 'rxjs';
import { LucideAngularModule, CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-angular';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="visible"
         [class]="getSnackbarClasses()"
         class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-md animate-slide-up">
      <lucide-icon [img]="getIcon()" [size]="20" [class]="getIconClass()"></lucide-icon>
      <span class="flex-1 text-sm font-medium">{{ config?.message }}</span>
      <button (click)="close()" class="hover:opacity-70 transition-opacity">
        <lucide-icon [img]="XIcon" [size]="16"></lucide-icon>
      </button>
    </div>
  `,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class SnackbarComponent implements OnInit, OnDestroy {
  visible = false;
  config: SnackbarConfig | null = null;
  private subscription?: Subscription;
  private timeoutId?: number;

  readonly CheckCircleIcon = CheckCircle;
  readonly XCircleIcon = XCircle;
  readonly InfoIcon = Info;
  readonly AlertTriangleIcon = AlertTriangle;
  readonly XIcon = X;

  constructor(private snackbarService: SnackbarService) {}

  ngOnInit() {
    this.subscription = this.snackbarService.snackbar$.subscribe(config => {
      this.show(config);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  show(config: SnackbarConfig) {
    this.config = config;
    this.visible = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      this.close();
    }, config.duration || 4000);
  }

  close() {
    this.visible = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getIcon() {
    switch (this.config?.type) {
      case 'success': return this.CheckCircleIcon;
      case 'error': return this.XCircleIcon;
      case 'warning': return this.AlertTriangleIcon;
      default: return this.InfoIcon;
    }
  }

  getIconClass() {
    switch (this.config?.type) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      default: return 'text-blue-600';
    }
  }

  getSnackbarClasses() {
    const baseClasses = 'border';
    switch (this.config?.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-900`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-900`;
      case 'warning':
        return `${baseClasses} bg-amber-50 border-amber-200 text-amber-900`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-900`;
    }
  }
}
