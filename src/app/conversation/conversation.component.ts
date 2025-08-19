import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechRecognitionService } from '../speech-recognition.service';
import { ConversationService } from '../conversation.service';
import { TextToSpeechService } from '../text-to-speech.service';
import { ProgressService } from '../progress.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.scss'
})
export class ConversationComponent implements OnInit, OnDestroy {
  recognizedText: string = '';
  conversationHistory: { type: 'user' | 'ai', text: string, feedback?: any }[] = [];
  isListening: boolean = false;
  private speechSubscription: Subscription | undefined;

  constructor(
    private speechRecognitionService: SpeechRecognitionService,
    private conversationService: ConversationService,
    private textToSpeechService: TextToSpeechService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    this.speechSubscription = this.speechRecognitionService.recognizedText$.subscribe(text => {
      this.recognizedText = text;
      if (text) {
        this.addToConversation('user', text);
        this.sendToConversationService(text);
      }
    });
  }

  ngOnDestroy(): void {
    this.speechSubscription?.unsubscribe();
  }

  toggleListening(): void {
    this.isListening = !this.isListening;
    if (this.isListening) {
      this.speechRecognitionService.startListening();
    } else {
      this.speechRecognitionService.stopListening();
    }
  }

  addToConversation(type: 'user' | 'ai', text: string, feedback?: any): void {
    this.conversationHistory.push({ type, text, feedback });
  }

  sendToConversationService(text: string): void {
    // Record the start of a practice session
    this.progressService.recordPracticeSession();

    this.conversationService.sendMessage(text).subscribe(response => {
      this.addToConversation('ai', response.reply, response.feedback);
      this.textToSpeechService.speak(response.reply);

      // Track errors based on the feedback (mock implementation for now)
      if (response.feedback?.errors) {
        this.progressService.trackErrors(response.feedback.errors);
      }
    });
  }

}
