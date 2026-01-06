import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {
  private swRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.registerServiceWorker();
  }

  private async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator && environment.production) {
      try {
        this.swRegistration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered successfully:', this.swRegistration);

        setInterval(() => {
          this.swRegistration?.update();
        }, 60000);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async unregisterServiceWorker(): Promise<void> {
    if (this.swRegistration) {
      await this.swRegistration.unregister();
      console.log('Service Worker unregistered');
    }
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  onConnectivityChange(callback: (isOnline: boolean) => void): void {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}
