import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './conversation/conversation.component';
import { ProgressComponent } from './progress/progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    
  ],
  imports: [
    ConversationComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressComponent
  ],
  exports: [
    ConversationComponent, ProgressComponent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AiModule { }
