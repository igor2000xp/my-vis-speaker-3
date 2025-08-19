import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { GoalService } from './goal.service';
import { ConversationService } from './conversation.service';
import { ProgressService } from './progress.service';
import { SpeechRecognitionService } from './speech-recognition.service';
import { TextToSpeechService } from './text-to-speech.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    AuthService,
    GoalService,
    ConversationService,
    ProgressService,
    SpeechRecognitionService,
    TextToSpeechService,
  ],
})
export class CoreModule {}
