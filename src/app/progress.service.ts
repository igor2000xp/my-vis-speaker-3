import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface ProgressEntry {
  userId: string;
  timestamp: Timestamp;
  sessionDuration?: number;
  errors?: { type: string; count: number }[];
  // Add other relevant progress metrics
  // Add other relevant progress metrics
}

interface ProgressStatistics {
  totalSessions: number;
  totalErrors: number;
  errorTypeBreakdown: { type: string; count: number }[];
  // Add other aggregated statistics
  // Add other aggregated statistics
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);

  private get progressCollection() {
    return collection(this.firestore, 'progress');
  }

  recordPracticeSession(sessionDuration: number, errors: { type: string; count: number }[] = [], additionalMetrics: any = {}): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return from(Promise.reject('User not authenticated'));
    }

    // Merge additional metrics into the progress entry
    const progressEntry: ProgressEntry = {
      userId: user.uid,
      timestamp: Timestamp.now(),
      sessionDuration: sessionDuration,
      errors: errors,
      ...additionalMetrics // Include any additional metrics provided

    };

    return from(addDoc(this.progressCollection, progressEntry)).pipe(
      map(() => void 0) // Map to void since addDoc doesn't return a specific value we need to expose
    );
  }

  getUserProgress(): Observable<ProgressStatistics> {
    const user = this.auth.currentUser;
    if (!user) {
      return from(Promise.reject('User not authenticated'));
    }

    const userProgressQuery = query(this.progressCollection, where('userId', '==', user.uid));

    return from(getDocs(userProgressQuery)).pipe(
      map(querySnapshot => {
        let totalSessions = 0;
        let totalDuration = 0;
        let totalErrors = 0;
        const errorTypeBreakdown: { [key: string]: number } = {};

        querySnapshot.forEach(doc => {

          const entry = doc.data() as ProgressEntry;
          totalSessions++;
          if (entry.errors) {
            entry.errors.forEach(error => {
              totalErrors += error.count;
              errorTypeBreakdown[error.type] = (errorTypeBreakdown[error.type] || 0) + error.count;
            });
          }
          if (entry.sessionDuration) {
            totalDuration += entry.sessionDuration;
          }
        });

        const errorTypeBreakdownArray = Object.keys(errorTypeBreakdown).map(key => ({
          type: key,
          count: errorTypeBreakdown[key]
        }));

        return {
          totalSessions: totalSessions,
          totalDuration: totalDuration,
          totalErrors: totalErrors,
          errorTypeBreakdown: errorTypeBreakdownArray
        };
      })
    );
  }

  // Add other methods as needed for more detailed tracking or filtering
}