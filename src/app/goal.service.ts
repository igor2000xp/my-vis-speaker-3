import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Goal } from './goal.model';
import { Auth } from '@angular/fire/auth';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private firestore: Firestore = inject(Firestore);
  private auth: Auth = inject(Auth);
  private goalsCollection!: CollectionReference<DocumentData>;

  constructor() {
    // Initialize the collection only when the user is authenticated
    this.auth.authState.subscribe(user => {
      if (user) {
        this.goalsCollection = collection(this.firestore, `users/${user.uid}/goals`);
      }
    });
  }

  getGoals(): Observable<Goal[]> {
    // Only fetch goals if the user is authenticated and the collection is initialized
    if (this.goalsCollection) {
      return collectionData(this.goalsCollection, { idField: 'id' }) as Observable<Goal[]>;
    } else {
      return of([]); // Return an empty observable if not authenticated
    }
  }

  async addGoal(goal: Goal): Promise<DocumentReference<DocumentData>> {
    if (this.goalsCollection) {
      const goalToAdd: Omit<Goal, 'id'> = goal;
      return await addDoc(this.goalsCollection, goalToAdd);
    }
    throw new Error('User not authenticated');
  }

  async updateGoal(goal: Goal): Promise<void> {
    if (this.goalsCollection && goal.id) {
      const goalRef = doc(this.goalsCollection, goal.id);
      const goalToUpdate: Omit<Goal, 'id'> = goal;
      return await updateDoc(goalRef, goalToUpdate);
    }
    throw new Error('User not authenticated or goal ID is missing');
  }

  async deleteGoal(goalId: string): Promise<void> {
    if (this.goalsCollection && goalId) {
      const goalRef = doc(this.goalsCollection, goalId);
      return await deleteDoc(goalRef);
    }
    throw new Error('User not authenticated or goal ID is missing');
  }
}
