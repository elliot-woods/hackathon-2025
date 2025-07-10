# Startup Agent

A NextJS webapp with AI agent chat interface featuring intelligent triage and handoff capabilities.

## Features

- **Smart Triage**: Automatically routes user queries to specialized agents
- **Multiple Agents**: Specialized agents for startup development and validation
- **Modern UI**: Clean, responsive chat interface with Tailwind CSS
- **Real-time Chat**: Instant responses from AI agents
- **Agent Indicators**: Visual feedback showing which agent is responding

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

The chat interface automatically routes your queries to the appropriate specialist:

- **Startup idea development** → Flesh It Out Agent
- **Market validation** → Does It Exist Agent
- **Pain point analysis** → Pain Points Agent
- **General questions** → Triage Agent

## Architecture

- **Frontend**: Next.js 15 with React and Tailwind CSS
- **Backend**: Next.js API routes
- **AI**: OpenAI Agents SDK with handoff capabilities
- **Agents**: Specialized agents for startup development and validation

## Project Structure

```
├── app/
│   ├── api/chat/          # API route for chat handling
│   ├── components/        # React components
│   ├── lib/              # Agent configurations
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── package.json
├── tailwind.config.js
└── README.md
```

## Technologies Used

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- OpenAI Agents SDK 