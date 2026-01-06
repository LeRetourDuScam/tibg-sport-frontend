import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, HttpClient, withInterceptors } from '@angular/common/http';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from './services/custom-translate-loader';
import { errorInterceptor } from './interceptors/error.interceptor';
import { httpErrorInterceptor } from './interceptors/http-error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import {
  LucideAngularModule,
  Laptop,
  Code2,
  CircleDot,
  Bot,
  Sparkles,
  Shield,
  Target,
  MessageSquare,
  Gift,
  Check,
  X,
  Lightbulb,
  Microscope,
  UserRound,
  HeartPulse,
  Clock,
  Settings,
  Brain,
  Waves,
  Activity,
  Bike,
  Leaf,
  Zap,
  Dumbbell,
  Trophy,
  Music,
  Mountain,
  Flag,
  Ruler,
  Hospital,
  BookOpen,
  LayoutGrid,
  BarChart3,
  Database,
  Languages,
  CircleHelp,
  Info,
  User
} from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([authInterceptor, httpErrorInterceptor, errorInterceptor])
    ),
    provideTranslateService({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new CustomTranslateLoader(http),
        deps: [HttpClient],
      },
    }),
    importProvidersFrom(
      LucideAngularModule.pick({
        Laptop,
        Code2,
        CircleDot,
        Bot,
        Sparkles,
        Shield,
        Target,
        MessageSquare,
        Gift,
        Check,
        X,
        Lightbulb,
        Microscope,
        UserRound,
        HeartPulse,
        Clock,
        Settings,
        Brain,
        Waves,
        Activity,
        Bike,
        Leaf,
        Zap,
        Dumbbell,
        Trophy,
        Music,
        Mountain,
        Flag,
        Ruler,
        Hospital,
        BookOpen,
        LayoutGrid,
        BarChart3,
        Database,
        Languages,
        CircleHelp,
        Info,
        User
      })
    )
  ]
};
