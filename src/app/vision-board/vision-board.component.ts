import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalService } from '../goal.service';
import { Goal } from '../goal.model';
import { Subscription } from 'rxjs';
import { GoalFormComponent } from '../goal-form/goal-form.component';
import { SpeechRecognitionService } from '../speech-recognition.service';
import { ConversationComponent } from '../conversation/conversation.component';

import { ProgressComponent } from '../progress/progress.component';
@Component({
  selector: 'app-vision-board',
  standalone: true,
  imports: [CommonModule, GoalFormComponent],
  templateUrl: './vision-board.component.html',
  styleUrl: './vision-board.component.scss'
})
export class VisionBoardComponent implements OnInit, OnDestroy {
  goals: Goal[] = [];
  private goalsSubscription: Subscription | undefined;
  filteredGoals: Goal[] = [];
  searchQuery: string = '';
  filterCriteria: any; // You can define a more specific type for filter criteria
  sortCriteria: string = '';
  showGoalForm = false;
  selectedGoal: Goal | null = null;
  availableCategories: string[] = ['Vocabulary', 'Fluency', 'Grammar', 'Pronunciation', 'Listening', 'Speaking', 'Writing', 'Reading', 'Other']; // Example categories
  selectedCategory: string | null = null;
 showConversation = false;

  showProgress = false;
 private speechSubscription: Subscription | undefined;
 isListening = false;

  constructor(private goalService: GoalService, private speechRecognitionService: SpeechRecognitionService) {}

  /**
 * Initializes the component and subscribes to the goals data.
 */
  ngOnInit(): void {
    this.goalsSubscription = this.goalService.getGoals().subscribe(goals => {
      this.goals = goals; // Assign fetched goals
 this.applyFiltersAndSorting(); // Apply initial filter and sorting
    });

 this.speechSubscription = this.speechRecognitionService.recognizedText.subscribe(text => console.log('Recognized text:', text));
  }

  /**
 * Unsubscribes from the goals data on component destruction.
 */
  ngOnDestroy(): void {
    this.goalsSubscription?.unsubscribe();
 this.speechSubscription?.unsubscribe();
  }

  /**
 * Opens the form for adding a new goal.
 */
  openAddGoalForm(): void {
    this.selectedGoal = null;
    this.showGoalForm = true;
  }

  /**
 * Opens the form for editing an existing goal.
 */
  openEditGoalForm(goal: Goal): void {
    this.selectedGoal = goal;
    this.showGoalForm = true;
  }

  onGoalSaved(goal: Goal): void {
    if (goal.id) {
      this.goalService.updateGoal(goal);
    } else {
      this.goalService.addGoal(goal);
    }
    this.showGoalForm = false;
  }

  /**
 * Cancels the goal form.
 */
  cancelGoalForm(): void {
    this.selectedGoal = null;
    this.showGoalForm = false;
  }

  /**
 * Deletes a goal.
 * @param goalId The ID of the goal to delete.
 */
  deleteGoal(goalId?: string): void {
    if (goalId) {
      this.goalService.deleteGoal(goalId);
    }
  }

  /**
 * Toggles the completed status of a goal.
 * @param goal The goal to toggle the status of.
 */
  toggleGoalCompleted(goal: Goal): void {
    const updatedGoal = { ...goal, completed: !goal.completed };
    this.goalService.updateGoal(updatedGoal);
  }

  /**
 * Sets the selected category for filtering goals.
 * @param category The category to filter by.
 */
  filterByCategory(category: string | null): void {
    this.selectedCategory = category;
    this.filteredGoals = this.selectedCategory ? this.goals.filter(goal => goal.category === this.selectedCategory) : this.goals;
  }

  /**
 * Opens the AI conversation view.
 */
  openConversation(): void {
    this.showConversation = true;
  }

  /**
 * Closes the AI conversation view.
 */
  closeConversation(): void {
    this.showConversation = false;
  }

  /**
 * Opens the progress view.
 */
  openProgress(): void {
    this.showProgress = true;
  }

  /**
 * Closes the progress view.
 */
  closeProgress(): void {
    this.showProgress = false;
  }

  /**
 * Toggles speech recognition on and off.
 */
  toggleSpeechRecognition(): void {
    if (this.isListening) {
      this.speechRecognitionService.stopListening();
    } else {
      this.speechRecognitionService.startListening();
    }
    this.isListening = !this.isListening;
  }
}
