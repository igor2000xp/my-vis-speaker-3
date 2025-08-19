import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TextToSpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string): void {
    if (this.synth.speaking) {
      console.log('SpeechSynthesis is already speaking.');
      return;
    }

    if (text !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      this.synth.speak(utterance);
    }
  }

  stopSpeaking(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }
}
