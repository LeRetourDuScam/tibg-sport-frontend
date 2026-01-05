import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environment/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  expiresAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }


  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const user = this.currentUserSubject.value;
    if (user && user.expiresAt) {
      return new Date(user.expiresAt) > new Date();
    }

    return false;
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`);
  }

  get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  private handleAuthResponse(response: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.TOKEN_KEY, response.token);
    storage.setItem(this.USER_KEY, JSON.stringify(response));
    this.currentUserSubject.next(response);
  }

  private getUserFromStorage(): AuthResponse | null {
    const sessionUser = sessionStorage.getItem(this.USER_KEY);
    const localUser = localStorage.getItem(this.USER_KEY);

    const userJson = sessionUser || localUser;
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }
}
