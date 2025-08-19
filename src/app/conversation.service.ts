import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpsCallable, Functions, httpsCallable } from '@angular/fire/functions';
import { Goal } from './goal.model';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  private functions: Functions = inject(Functions);
  constructor() { }

  /**
   * Sends a message to the AI and returns the AI's response.
   * @param message The user's message.
   * @returns An Observable of the AI's response string.
   * @param audioData Optional audio data as a Blob.
   */
  async sendMessage(message: string, audioData?: Blob): Promise<{ response: string, feedback?: any }> {
    const analyzeText: HttpsCallable = httpsCallable(this.functions, 'analyzeText');

    try {
      let audioBase64 = null;
      if (audioData) {
        audioBase64 = await this.blobToBase64(audioData);
      }

      const result = await analyzeText({ message: message, audio: audioBase64 });
      // Assuming the Cloud Function returns an object with 'response' and optional 'feedback' properties
      const data: any = result.data;
      if (data && data.response) {
        return { response: data.response, feedback: data.feedback };
      } else {
        return { response: 'Error: Could not get response from AI.' };
      }
    } catch (error) {
      console.error("Error calling analyzeText Cloud Function:", error);
      return { response: 'Error communicating with the AI.' };
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    }
  }
}