export interface Goal {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  completed: boolean;
  imageUrl?: string;
  dueDate?: string; // Using string for simplicity with form input
  archived?: boolean;
}