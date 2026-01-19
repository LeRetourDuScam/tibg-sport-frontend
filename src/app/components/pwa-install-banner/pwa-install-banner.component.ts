import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LucideAngularModule, Download, X } from 'lucide-angular';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  imports: [CommonModule, TranslateModule, LucideAngularModule],
  template: `
    @if (showBanner) {
      <div class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm bg-white border border-neutral-200 rounded-lg shadow-lg p-4 z-50 animate-slide-up">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shrink-0">
            <lucide-angular [img]="DownloadIcon" class="w-5 h-5 text-white"></lucide-angular>
          </div>
          <div class="grow">
            <h4 class="text-sm font-semibold text-neutral-800 mb-1">{{ 'PWA.INSTALL_TITLE' | translate }}</h4>
            <p class="text-xs text-neutral-600 mb-3">{{ 'PWA.INSTALL_DESC' | translate }}</p>
            <div class="flex gap-2">
              <button
                (click)="install()"
                class="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                {{ 'PWA.INSTALL_BUTTON' | translate }}
              </button>
              <button
                (click)="dismiss()"
                class="px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer">
                {{ 'PWA.LATER' | translate }}
              </button>
            </div>
          </div>
          <button
            (click)="dismiss()"
            class="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer">
            <lucide-angular [img]="CloseIcon" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slide-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slide-up {
      animation: slide-up 0.3s ease-out;
    }
  `]
})
export class PwaInstallBannerComponent {
  readonly DownloadIcon = Download;
  readonly CloseIcon = X;

  private pwaService = inject(PwaService);

  get showBanner(): boolean {
    return this.pwaService.shouldShowInstallBanner();
  }

  async install(): Promise<void> {
    await this.pwaService.promptInstall();
  }

  dismiss(): void {
    this.pwaService.dismissInstallBanner();
  }
}
