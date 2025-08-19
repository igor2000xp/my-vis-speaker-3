/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { onCall } from "firebase-functions/v2/https";

import { SpeechClient } from '@google-cloud/speech';
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as a project secret
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  logger.error("GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

const speechClient = new SpeechClient();

export const analyzeText = onCall(async (request) => {
  const audioData: string | undefined = request.data.audioData;
  const message: string | undefined = request.data.message;

  let transcribedText = message;
  let pronunciationFeedback = "No audio provided for pronunciation analysis.";

  if (audioData) {
    try {
      const [response] = await speechClient.recognize({
        audio: {
          content: audioData, // Assuming audioData is base64 encoded
        },
        config: {
          encoding: 'WEBM_OPUS', // Adjust encoding based on your audio format
          sampleRateHertz: 48000, // Adjust sample rate based on your audio
          languageCode: 'en-US', // Adjust language code as needed
          enableWordConfidence: true,
        },
      });

      transcribedText = response.results?.[0]?.alternatives?.[0]?.transcript || "";

      // Basic pronunciation feedback based on confidence scores
      const words = response.results?.[0]?.alternatives?.[0]?.words;
      if (words && words.length > 0) {
        pronunciationFeedback = "Pronunciation feedback (based on word confidence):\n";
        words.forEach(wordInfo => {
          pronunciationFeedback += `- "${wordInfo.word}": Confidence ${wordInfo.confidence?.toFixed(2)}\n`;
        });
      } else {
        pronunciationFeedback = "Could not get word confidence for pronunciation feedback.";
      }

    } catch (error) {
      logger.error("Speech-to-Text error:", error);
      transcribedText = message || "Could not process audio."; // Fallback to message if audio fails
      pronunciationFeedback = "Error processing audio for pronunciation analysis.";
    }
  }

  // Use Google AI for NLP analysis on the transcribed text
  // Replace with actual AI model interaction and feedback generation
  const aiResponse = `You said: "${transcribedText}". This is a mock AI response based on the transcription.`;
  const grammarFeedback = "Mock grammar feedback based on transcription.";

  return { reply: aiResponse, grammarFeedback: grammarFeedback, pronunciationFeedback: pronunciationFeedback };
});
