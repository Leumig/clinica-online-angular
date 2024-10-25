import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

// Animations
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()), //withViewTransitions para las transiciones de ruteo
    provideHttpClient(),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp({
      "projectId": "clinica-online-f6245",
      "appId": "1:181972658582:web:c840cf4af0c2eba5a555b7",
      "storageBucket": "clinica-online-f6245.appspot.com",
      "apiKey": "AIzaSyB5iO3aZMw2N-dyUE0TFnZBpCoUUeC2cIQ",
      "authDomain": "clinica-online-f6245.firebaseapp.com",
      "messagingSenderId": "181972658582"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
  ]
};
