# Agents

This directory contains specialized AI agents for different startup and business tasks.

## Available Agents

### 1. Flesh It Out Agent (`fleshit`)
- **Purpose**: Develop startup ideas into concrete concepts
- **Features**: Problem space analysis, market analysis, ICP definition, competitive landscape
- **Icon**: 💡

### 2. Market Research Agent (`market-research`)
- **Purpose**: Idea validation and competitive analysis
- **Features**: Competitor research, market gap analysis, strategic insights
- **Icon**: 🔍

### 3. Pain Points Agent (`painpoints`)
- **Purpose**: Analyze customer pain points and problem validation
- **Features**: Customer problem analysis, validation strategies
- **Icon**: 🎯

### 4. EyePop Vision Agent (`eyepop`)
- **Purpose**: AI-powered image analysis using EyePop's computer vision API
- **Features**: Object detection, face analysis, text recognition, scene understanding
- **Icon**: 👁️

## EyePop Agent Setup

The EyePop agent requires additional environment variables:

```env
EYEPOP_SECRET_KEY=your_secret_key_here
EYEPOP_POP_ID=your_pop_id_here
```

### Getting EyePop Credentials

1. Sign up at [EyePop.ai](https://eyepop.ai)
2. Create a new Pop (endpoint) in your dashboard
3. Copy the Pop ID from the settings
4. Generate an API key from your profile section

### Usage Example

```javascript
import { analyzeImageWithEyePop } from './eyepop';

// Analyze an image file
const result = await analyzeImageWithEyePop('/path/to/image.jpg');

// Analyze an image from URL
const result = await analyzeImageWithEyePop(undefined, 'https://example.com/image.jpg');

console.log(result);
// {
//   success: true,
//   results: [...detection results...],
//   summary: {
//     total_detections: 5,
//     processed_at: "2023-...",
//     image_source: "..."
//   }
// }
```

## Agent Architecture

Each agent follows the same pattern:
1. **Agent Configuration**: Uses `@openai/agents` for AI capabilities
2. **Instructions**: Detailed prompt for the agent's role and behavior
3. **Export Configuration**: UI metadata (name, description, icon, color)
4. **Integration**: Registered in `index.ts` and `agents.ts`

## Adding New Agents

1. Create a new file in this directory
2. Export both the agent and its configuration
3. Add imports to `index.ts`
4. Update the triage agent in `agents.ts`
5. Add handoff logic for routing 