import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  serverTimestamp,
  DocumentReference,
  DocumentData,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { generateUID } from '../utils/uuid';

@Injectable({
  providedIn: 'root',
})
export class ErrorReportService {
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);

  constructor() {}

  public async sendReport(mail: string, content: string): Promise<DocumentReference<DocumentData>> {
    const errorReport = {
      reportId: generateUID(),
      mail,
      content,
      url: this.router.url, // URL actuelle
      timestamp: serverTimestamp(), // Horodatage Firestore
      userAgent: navigator.userAgent, // User-Agent du navigateur
      language: navigator.language, // Langue préférée
    };
    return addDoc(collection(this.firestore, 'errorReports'), errorReport);
  }
}
