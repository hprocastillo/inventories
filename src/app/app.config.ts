import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "farmaciawebapp", appId: "1:46972420929:web:b8c64a51d55ad95d47d7c0", storageBucket: "farmaciawebapp.firebasestorage.app", apiKey: "AIzaSyC7FFe5b6zLQ5jxAScLtVJBaKY6RugQ9rY", authDomain: "farmaciawebapp.firebaseapp.com", messagingSenderId: "46972420929", measurementId: "G-HW3LKF7P0Y" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
