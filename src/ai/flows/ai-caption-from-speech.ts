'use server';
/**
 * @fileOverview A Genkit flow for converting spoken words from an audio input into a text caption.
 *
 * - aiCaptionFromSpeech - A function that handles the speech-to-text conversion process.
 * - SpeechToTextCaptionInput - The input type for the aiCaptionFromSpeech function.
 * - SpeechToTextCaptionOutput - The return type for the aiCaptionFromSpeech function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpeechToTextCaptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio of spoken words, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type SpeechToTextCaptionInput = z.infer<typeof SpeechToTextCaptionInputSchema>;

const SpeechToTextCaptionOutputSchema = z.object({
  caption: z.string().describe('The transcribed text of the spoken words.'),
});
export type SpeechToTextCaptionOutput = z.infer<typeof SpeechToTextCaptionOutputSchema>;

export async function aiCaptionFromSpeech(
  input: SpeechToTextCaptionInput
): Promise<SpeechToTextCaptionOutput> {
  return aiCaptionFromSpeechFlow(input);
}

const speechToTextCaptionPrompt = ai.definePrompt({
  name: 'speechToTextCaptionPrompt',
  input: { schema: SpeechToTextCaptionInputSchema },
  output: { schema: SpeechToTextCaptionOutputSchema },
  prompt: `You are an expert transcriber. Transcribe the following audio into text. Provide only the transcribed text, without any additional commentary or formatting.
Audio: {{media url=audioDataUri}}`,
});

const aiCaptionFromSpeechFlow = ai.defineFlow(
  {
    name: 'aiCaptionFromSpeechFlow',
    inputSchema: SpeechToTextCaptionInputSchema,
    outputSchema: SpeechToTextCaptionOutputSchema,
  },
  async (input) => {
    const { output } = await speechToTextCaptionPrompt(input);
    return output!;
  }
);
