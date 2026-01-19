import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LucideAngularModule, AlertTriangle, X } from 'lucide-angular';
import { ConfirmationModalService, ConfirmationModalConfig } from '../../services/confirmation-modal.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        (click)="cancel()">
      </div>

      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transform transition-all animate-modal-in">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3">
            <div [class]="getIconContainerClass()">
              <lucide-icon [img]="AlertTriangleIcon" [size]="20" class="text-current"></lucide-icon>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ config?.title }}
            </h3>
          </div>
          <button
            (click)="cancel()"
            class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <lucide-icon [img]="XIcon" [size]="20" class="text-gray-500"></lucide-icon>
          </button>
        </div>

        <div class="p-4">
          <p class="text-gray-600 dark:text-gray-300">
            {{ config?.message }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            (click)="cancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
            {{ config?.cancelText || 'Annuler' }}
          </button>
          <button
            (click)="confirm()"
            [class]="getConfirmButtonClass()">
            {{ config?.confirmText || 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes modal-in {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .animate-modal-in {
      animation: modal-in 0.2s ease-out;
    }
  `]
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  visible = false;
  config: ConfirmationModalConfig | null = null;
  private subscription?: Subscription;

  readonly AlertTriangleIcon = AlertTriangle;
  readonly XIcon = X;

  constructor(private confirmationModalService: ConfirmationModalService) {}

  ngOnInit() {
    this.subscription = this.confirmationModalService.modal$.subscribe(config => {
      this.config = config;
      this.visible = true;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  confirm() {
    this.visible = false;
    this.confirmationModalService.respond(true);
  }

  cancel() {
    this.visible = false;
    this.confirmationModalService.respond(false);
  }

  getIconContainerClass(): string {
    const baseClass = 'p-2 rounded-lg';
    switch (this.config?.confirmButtonClass) {
      case 'danger':
        return `${baseClass} bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400`;
      case 'warning':
        return `${baseClass} bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400`;
      default:
        return `${baseClass} bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400`;
    }
  }

  getConfirmButtonClass(): string {
    const baseClass = 'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors';
    switch (this.config?.confirmButtonClass) {
      case 'danger':
        return `${baseClass} bg-red-600 hover:bg-red-700`;
      case 'warning':
        return `${baseClass} bg-amber-600 hover:bg-amber-700`;
      default:
        return `${baseClass} bg-blue-600 hover:bg-blue-700`;
    }
  }
}
