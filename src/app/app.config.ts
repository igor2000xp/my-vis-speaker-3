import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getDataConnect, provideDataConnect } from '@angular/fire/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { CoreModule } from './core.module';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "firebase-studio-helper-vjtqr", appId: "1:681547959232:web:9f5d12623b6e4bb0405625", storageBucket: "firebase-studio-helper-vjtqr.firebasestorage.app", apiKey: "AIzaSyDCfvG9O3D7X0y3Lac-oRCWwHAusIONKq8", authDomain: "fir-studio-helper-vjtqr.firebaseapp.com", messagingSenderId: "681547959232" })), provideAuth(() => getAuth()), provideAppCheck(() => {
  // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
  const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
  return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
}), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideDataConnect(() => getDataConnect(connectorConfig)), provideTanStackQuery(new QueryClient()), provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig()), provideVertexAI(() => getVertexAI())]
providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "firebase-studio-helper-vjtqr", appId: "1:681547959232:web:9f5d12623b6e4bb0405625", storageBucket: "firebase-studio-helper-vjtqr.firebasestorage.app", apiKey: "AIzaSyDCfvG9O3D7X0y3Lac-oRCWwHAusIONKq8", authDomain: "fir-studio-helper-vjtqr.firebaseapp.com", messagingSenderId: "681547959232" })), provideAuth(() => getAuth()), provideAppCheck(() => {
  // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
  const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
  return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
}), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()), provideDataConnect(() => getDataConnect(connectorConfig)), provideTanStackQuery(new QueryClient()), provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), providePerformance(() => getPerformance()), provideStorage(() => getStorage()), provideRemoteConfig(() => getRemoteConfig()), provideVertexAI(() => getVertexAI()), CoreModule ]
};
