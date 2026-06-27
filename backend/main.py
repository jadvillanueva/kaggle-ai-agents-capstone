from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.antigravity import Agent, LocalAgentConfig, types
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="B2B Lead Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateLeadsRequest(BaseModel):
    business_name: str
    service_offering: str
    target_audience: str
    city: str
    num_leads: int = 3

class SendEmailRequest(BaseModel):
    to_email: str
    subject: str
    body: str

class DraftEmail(BaseModel):
    lead_name: str
    lead_website: str
    draft_subject: str
    draft_body: str
    research_summary: str

class GenerateLeadsResponse(BaseModel):
    drafts: list[DraftEmail]

# Configure MCP Server
mcp_servers = [
    types.McpStdioServer(
        name="local_search_mcp",
        command="python3",
        args=["mcp_server.py"],
    )
]

config = LocalAgentConfig(
    mcp_servers=mcp_servers,
    response_schema=GenerateLeadsResponse,
    capabilities=types.CapabilitiesConfig(
        enable_subagents=True,
    ),
    model="gemini-2.5-flash-lite"
)

@app.post("/api/generate", response_model=GenerateLeadsResponse)
async def generate_leads(request: GenerateLeadsRequest):
    prompt = f"""
    You are an expert B2B sales development representative for '{request.business_name}'.
    We offer: {request.service_offering}.
    Our target audience is: {request.target_audience} in {request.city}.
    
    Task:
    1. Use your search tools to find {request.num_leads} local businesses that match our target audience in {request.city}. Focus on independent businesses that look like they need our services, not directories or large chains.
    2. For each business, research their website or recent news to find a specific angle for our pitch.
    3. Draft a highly personalized, non-spammy cold email for each business. Do NOT hallucinate contact information, just address it generally to the owner or relevant role.
    
    Return the results matching the required structured output schema.
    """
    
    try:
        async with Agent(config) as agent:
            response = await agent.chat(prompt)
            data = await response.structured_output()
            if data:
                return data
            else:
                raise HTTPException(status_code=500, detail="Agent failed to produce structured output.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/send-email")
async def send_email(request: SendEmailRequest):
    # Mock functionality for Capstone demo
    # In a production app, integrate SendGrid, Mailgun, or SMTP here
    print(f"Mock sending email to {request.to_email} with subject: {request.subject}")
    return {"status": "success", "message": "Email queued for sending (mock)"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
