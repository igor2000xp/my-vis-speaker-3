import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Goal } from '../goal.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './goal-form.component.html',
  styleUrl: './goal-form.component.scss',
})
export class GoalFormComponent implements OnChanges {
  @Input() goal: Goal | null = null;
  @Output() save = new EventEmitter<{ goal: Goal; imageFile: File | null }>();
  // @Output() save = new EventEmitter<Goal>();

  goalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: [''],
      category: [''],
      completed: [false],
      image: [null], // Form control for the file input
      dueDate: [null], // Form control for due date
      archived: [false], // Form control for archiving
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['goal'] && changes['goal'].currentValue) {
      this.goalForm.patchValue(changes['goal'].currentValue);
    }
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      const goalData = this.goalForm.value as Goal;
      const imageFile = this.goalForm.get('image')?.value;
      // Ensure dueDate is a Date object if needed, currently it will be a string from input type="date"
      // goalData.dueDate = goalData.dueDate ? new Date(goalData.dueDate) : null;
      this.save.emit({ goal: goalData, imageFile: imageFile }); // Emitting both goal data and the image file
    }
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.goalForm.patchValue({ image: file });
  }
}
