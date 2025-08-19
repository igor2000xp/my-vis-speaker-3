import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private recognition: any;
  private textSubject = new Subject<string>();
  private audioBlobSubject = new Subject<Blob>();
  audioBlob$: Observable<Blob> = this.audioBlobSubject.asObservable();
  text$: Observable<string> = this.textSubject.asObservable();

  constructor(private ngZone: NgZone) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US'; // Default language

      this.recognition.onresult = (event: any) => {
        let recognizedText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
 recognizedText += event.results[i][0].transcript;
        }
        this.ngZone.run(() => {
          this.textSubject.next(recognizedText);
        });
      };

      // Using MediaRecorder to capture audio
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          let audioChunks: Blob[] = [];
          mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
          };
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            this.audioBlobSubject.next(audioBlob);
            audioChunks = []; // Clear chunks for the next recording
          };

          // Integrate MediaRecorder with SpeechRecognition start/stop
          const originalStart = this.recognition.start.bind(this.recognition);
          this.recognition.start = () => {
            audioChunks = []; // Clear chunks before starting
            mediaRecorder.start();
            originalStart();
          };

          const originalStop = this.recognition.stop.bind(this.recognition);
          this.recognition.stop = () => {
            mediaRecorder.stop();
            originalStop();
          };
        })
        .catch(err => {
          console.error('Error accessing microphone:', err);
        });
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended.');
      };

    } else {
      console.warn('Speech Recognition API is not supported in this browser.');
    }
  }
  
  startListening(): void {
    if (this.recognition) {
      try {
        this.recognition.start();
        console.log('Speech recognition started...');
      } catch (error) {console.error('Error starting speech recognition:', error);}
    }
  }
  
  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
      console.log('Speech recognition stopped.');
    }
  }

  // Method to set language if needed later  
  setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}