import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from 'src/app/conversation/conversation.component';
import { ProgressComponent } from 'src/app/progress/progress.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ConversationComponent, ProgressComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ConversationComponent, ProgressComponent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AiModule { }
