import { Injectable, signal } from '@angular/core';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  canInstall = signal(false);
  isInstalled = signal(false);

  constructor() {
    this.initPwaListeners();
    this.checkIfInstalled();
  }

  private initPwaListeners(): void {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.canInstall.set(true);
      console.log('PWA: Install prompt captured');
    });

    window.addEventListener('appinstalled', () => {
      this.canInstall.set(false);
      this.isInstalled.set(true);
      this.deferredPrompt = null;
      console.log('PWA: App installed');
    });
  }

  private checkIfInstalled(): void {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled.set(true);
    }
    // iOS Safari check
    if ((window.navigator as any).standalone === true) {
      this.isInstalled.set(true);
    }
  }

  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA: User accepted install');
        this.canInstall.set(false);
        return true;
      } else {
        console.log('PWA: User dismissed install');
        return false;
      }
    } catch (error) {
      console.error('PWA: Install prompt error', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  // Check if the user has dismissed the install banner recently
  shouldShowInstallBanner(): boolean {
    if (this.isInstalled()) return false;
    if (!this.canInstall()) return false;

    const dismissedAt = localStorage.getItem('pwa_install_dismissed');
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) return false;
    }

    return true;
  }

  dismissInstallBanner(): void {
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
  }
}
