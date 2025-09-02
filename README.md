# NestJS Chat Service 🤖

A simple **NestJS wrapper for Large Language Models (LLMs)** with Swagger documentation.  
This project provides a REST API to send prompts to an LLM (like GPT-4o) and receive responses.



## ✨ Features
- Built with [NestJS](https://nestjs.com/)  
- LLM API integration (chat completion endpoint)  
- Global validation with `ValidationPipe`  
- Swagger UI for API testing (`/api`)  
- Configurable via environment variables  



## 📦 Installation

Clone the repo:

```bash
git clone https://github.com/HemanthMarisetti0/nestjs-chat-service.git
cd nestjs-chat-service
````

Install dependencies (using [pnpm](https://pnpm.io/)):

```bash
pnpm install
```



## ⚙️ Environment Variables

Create a `.env` file in the root folder:

```env
LLM_API_KEY=your_api_key_here
MODEL=openai/gpt-4o
PORT=3000
```

You can check `.env.example` for reference.



## 🚀 Running the App

### Development

```bash
pnpm start:dev
```

### Production

```bash
pnpm build
pnpm start:prod
```



## 📖 API Documentation

Once running, visit:

* API: [http://localhost:3000](http://localhost:3000)
* Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)



## 🛠️ Example Usage

Request:

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What is the meaning of life?"}'
```

Response:

```json
{
  "answer": "The meaning of life is subjective, but many say it is about purpose, growth, and connection."
}
```

```


