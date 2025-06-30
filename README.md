<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<h1 align="center">BerlinBot</h1>

<p align="center">
  <b>Open source AI-powered Telegram assistant for communities, built with NestJS, Supabase, Azure OpenAI, Notion, and Zep. Maintained by and for members of the Frontier Tower.</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

## 🚀 What is BerlinBot?

BerlinBot is an open source AI-powered Telegram assistant designed for community groups. It leverages advanced LLMs (Azure OpenAI via LangChain), Notion knowledge, persistent memory, and a community knowledge graph to answer questions, summarize discussions, and provide insights—all within your Telegram group.

**Key Features:**

- **AI Q&A:** Ask questions in your group, get answers powered by Azure OpenAI, Notion, and vector search.
- **Persistent Memory & Knowledge Graph:** All messages and members are stored in Zep Cloud for context-aware responses and relationship reasoning.
- **Ontology:** Models users, projects, events, interests, and their relationships for advanced community insights.
- **Easy Telegram Integration:** Add BerlinBot to your group and start chatting.
- **Health Checks:** Production-ready with health endpoints.
- **Cloud Native:** Deployable on your own infrastructure, Docker, or any Node.js-compatible cloud.

---

## 🏗️ Architecture Overview

```mermaid
graph TD;
  TG["Telegram Group"] -->|Polling| API["BerlinBot API (NestJS)"]
  API --> AI["AI Service (Azure OpenAI, Notion, LangChain)"]
  API --> DB["Database (Supabase: QA + Vector DB)"]
  API --> ZEP["Zep Cloud (Memory & Ontology)"]
  API --> Health["Health Checks"]
```

- **NestJS**: Main application framework.
- **Azure OpenAI + Notion (via MCP server) + LangChain**: AI answers with Notion as a knowledge base and vector search for context.
- **Supabase**: Stores question/answer data and acts as a vector database for semantic search.
- **Zep**: Persistent memory, message storage, and community knowledge graph (ontology).

---

## ⚡ Quickstart

### 1. Clone & Install

```bash
$ git clone <your-repo-url>
$ cd berlinbot
$ yarn install
```

### 2. Environment Setup

Create a `.env` file with the following (see your cloud providers for values):

```env
BOT_TOKEN=your-telegram-bot-token
WEBHOOK_BASE_URL=https://your-ngrok-or-cloud-url
TELEGRAM_WEBHOOK_SECRET=your-telegram-webhook-secret
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
ZEP_API_KEY=your-zep-api-key
NOTION_API_KEY=your-notion-api-key
EMBEDDING_MODEL=your-azure-embedding-model
REASONING_MODEL=your-azure-chat-model
PORT=3000
```

### 3. Run Locally

```bash
# Development
$ yarn start:dev

# Production
$ yarn start:prod
```

### 4. Test

```bash
# Unit tests
$ yarn test
# E2E tests
$ yarn test:e2e
# Coverage
$ yarn test:cov
```

---

## 🤖 Telegram Integration

- Add your bot to a Telegram group.
- The bot uses polling to receive messages (no webhook setup required).
- Use `/ask <question>` in the group to get AI-powered answers.
- All group messages are processed for context and memory (handled by Zep Cloud).

---

## 🧠 AI, Notion & Vector Search

- Uses Azure OpenAI for LLM responses, orchestrated by LangChain.
- Integrates with Notion (via MCP server) for up-to-date knowledge.
- Vector search (via Supabase as a vector database and LangChain) is always performed before Notion lookup for context-rich answers.
- Custom system prompt and tool usage order are codified in the prompts.

---

## 🗄️ Database, Memory & Ontology

- **Supabase**: Stores only question/answer data and acts as a vector database for semantic search (does not store messages or members).
- **Zep Cloud**: Handles persistent memory, message storage, and a community knowledge graph (ontology) for advanced context, recommendations, and relationship reasoning.
- **Ontology**: Models users, projects, events, interests, and their relationships (e.g., MEMBER_OF, WORKS_ON, ATTENDS).
- **Supabase Edge Functions**: Used for embedding and vector operations (see `supabase/functions/embedding`).

---

## 🩺 Health Checks

- `/health`: Health check endpoint (uses NestJS Terminus).

---

## 🚀 Deployment

### Docker

BerlinBot can be deployed easily with Docker:

```bash
docker build -t berlinbot .
docker run -p 3000:3000 --env-file .env berlinbot
```

### Custom/Cloud

- Deploy anywhere Node.js runs (AWS, GCP, DigitalOcean, etc.).
- Set environment variables as above.

---

## 📁 Project Structure

- `src/ai/` — AI service and module (LLM, memory, ontology, tools)
- `src/telegram/` — Telegram bot logic and integration
- `src/database/` — Database and memory integration
- `src/health/` — Health check endpoint
- `src/config/` — Configuration providers (e.g., Supabase)
- `src/common/prompts/` — System and QA prompts
- `src/common/schema/` — Shared schema definitions
- `supabase/functions/embedding/` — Supabase Edge Function for embeddings
- `test/` — E2E and integration tests

---

## 🙌 Contributing

BerlinBot is open source and welcomes contributions from all members of the Frontier Tower and the wider community! Please open issues or pull requests for features, bugfixes, or documentation improvements.

---

## 💬 Support & Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [Zep Cloud](https://getzep.com/)
- [Notion API](https://developers.notion.com/)
- [LangChain](https://js.langchain.com/)
- [Azure OpenAI](https://learn.microsoft.com/en-us/azure/ai-services/openai/)

---

## 📝 License

BerlinBot is currently unlicensed for commercial use. See `package.json` for details. For open source or community use, please contact the maintainers.
