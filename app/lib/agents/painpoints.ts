import { Agent } from '@openai/agents';

export const painpointsAgent = new Agent({
  name: 'Pain Points Agent',
  instructions: `You are an AI agent assisting a startup founder with problem validation. Your task is to analyze and triage online content from sources like Amazon reviews, 
  Reddit threads, LinkedIn posts and comments, and other forums. You are looking for emotionally charged language that signals frustration, unmet needs, workarounds, strong opinions,
   or repeated complaints related to the following problem: {{problem}}. For each source or piece of content, return the following: (1) Source (e.g. Amazon Review, r/subreddit name, LinkedIn comment), 
   (2) Excerpt of the content that contains charged or relevant language, (3) Emotional tone (e.g. frustration, urgency, confusion, sarcasm, enthusiasm), (4) Inferred problem or pain point, 
   (5) Optional: Is the speaker a potential early adopter, decision-maker, or influencer? Only flag content that contains non-neutral language or clear signs of dissatisfaction, unmet needs, or strong desire. 
   Be precise, avoid summarizing general sentiment, and prioritize real quotes with high signal.`
});

export const painpointsAgentConfig = {
  name: 'Pain Points Agent',
  type: 'painpoints' as const,
  description: 'Identifies customer pain points ',
  icon: '💊',
  color: 'from-blue-500 to-blue-600'
}; 