# Vibe LeadGen Agents (Local B2B Outreach)

Welcome to the Vibe LeadGen Agents project! This is my Full-Stack Capstone Project for the Kaggle 5-Day AI Agents Intensive Course with Google. We built a system to show how the Google Antigravity SDK, Model Context Protocol (MCP), and Multi-Agent Systems can solve a real-world business problem.

## The Problem

Local B2B service providers—like commercial cleaners, IT support teams, or catering companies—often struggle to find and connect with new local businesses. When they try to reach out, generic cold emails usually land straight in the spam folder. On the flip side, manually researching local leads and writing personalized emails one by one takes way too much time. It is a major bottleneck for growth.

## The Solution

We built a multi-agent system to handle the heavy lifting. Instead of manually scraping directories and writing emails, this app does it for you. 

Here is what the system does:
1. It uses a custom DuckDuckGo MCP Server to find independent local businesses that match your specific target audience.
2. It researches those businesses autonomously to understand what they do.
3. It drafts personalized, relevant outreach emails based on that research.
4. It presents everything in a bright, Playful Geometric React UI so a human can review and approve the drafts before anything actually gets sent. 

## Architecture

The project is split into a React frontend and a FastAPI backend. The backend uses the Google Antigravity SDK to manage the agent logic, which hooks into a local search tool via the Model Context Protocol (MCP).

```mermaid
graph TD
    UI[React / Vite Frontend] -->|API Request| API[FastAPI Backend]
    API --> Agent[Antigravity SDK Agent]
    Agent -->|Subagents enabled via config| Discovery[Lead Discovery]
    Agent -->|Subagents enabled via config| Research[Web Research]
    Agent -->|Subagents enabled via config| Outreach[Draft Writer]
    Agent <-->|Stdio Transport| MCP[DuckDuckGo MCP Server]
    MCP <--> Web[Public Internet]
```

*Note: The frontend includes a mock `/api/send-email` integration to demonstrate how the loop would be closed in a production environment.*

## Instructions for Setup

We built a quick start script to make running this easy.

### Prerequisites
Make sure you have the following installed:
- Python 3.10+
- Bun (for the frontend)

### Setup Steps

1. **Clone the repository:**
   Download or clone the code to your local machine.

2. **Add your API Key:**
   Navigate into the `backend/` directory and create a `.env` file. Add your Google Gemini API key like this:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

3. **Install backend dependencies:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

4. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   bun install
   ```

5. **Run the application:**
   From the root of the project, simply run the start script. It will boot up both servers concurrently.
   ```bash
   cd ..
   chmod +x start.sh
   ./start.sh
   ```

6. **Use the App:**
   Open your browser to the local URL provided by the script (usually `http://localhost:5173`). Fill out your business profile, click "Dispatch Agents," and watch the agents go to work!
