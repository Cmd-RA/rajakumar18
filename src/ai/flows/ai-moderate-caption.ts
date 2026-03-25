'use server';
/**
 * @fileOverview An AI agent for moderating post captions based on platform content policies.
 *
 * - aiModerateCaption - A function that handles the caption moderation process.
 * - CaptionModerationInput - The input type for the aiModerateCaption function.
 * - CaptionModerationOutput - The return type for the aiModerateCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CaptionModerationInputSchema = z.object({
  caption: z
    .string()
    .describe('The text caption submitted by the user for moderation.'),
});
export type CaptionModerationInput = z.infer<typeof CaptionModerationInputSchema>;

const CaptionModerationOutputSchema = z.object({
  isAppropriate: z
    .boolean()
    .describe('True if the caption adheres to content policies, false otherwise.'),
  reason: z
    .string()
    .optional()
    .describe('If not appropriate, a concise reason for flagging the caption.'),
});
export type CaptionModerationOutput = z.infer<typeof CaptionModerationOutputSchema>;

export async function aiModerateCaption(
  input: CaptionModerationInput
): Promise<CaptionModerationOutput> {
  return aiModerateCaptionFlow(input);
}

const captionModerationPrompt = ai.definePrompt({
  name: 'captionModerationPrompt',
  input: {schema: CaptionModerationInputSchema},
  output: {schema: CaptionModerationOutputSchema},
  prompt: `You are an AI content moderator for ChannelVista, a photo social platform.
Your task is to review user-submitted captions and determine if they violate the platform's content policies.

**Platform Content Policies:**
- **Allowed Content:** Captions should describe original photos taken by the user.
- **Not Allowed Content:**
    - Captions related to downloaded photos.
    - Captions related to copyrighted material.
    - Spam or promotional content unrelated to a photo.
    - Sexually explicit or adult content.
    - Harassment, hate speech, or dangerous content.
    - Content violating civic integrity.

Review the following caption:
{{{caption}}}

Based on the policies, is this caption appropriate? If not, provide a concise reason.`,
});

const aiModerateCaptionFlow = ai.defineFlow(
  {
    name: 'aiModerateCaptionFlow',
    inputSchema: CaptionModerationInputSchema,
    outputSchema: CaptionModerationOutputSchema,
  },
  async (input) => {
    const {output} = await captionModerationPrompt(input);
    return output!;
  }
);
