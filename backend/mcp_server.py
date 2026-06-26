from mcp.server.fastmcp import FastMCP
from duckduckgo_search import DDGS

mcp = FastMCP("SearchServer")

@mcp.tool()
def search_web(query: str, max_results: int = 5) -> str:
    """Searches the web using DuckDuckGo and returns a summary of the top results. Use this to find local businesses or research specific companies."""
    try:
        results = DDGS().text(query, max_results=max_results)
        if not results:
            return "No results found."
        
        output = []
        for r in results:
            output.append(f"Title: {r.get('title')}\nLink: {r.get('href')}\nSnippet: {r.get('body')}\n")
        return "\n".join(output)
    except Exception as e:
        return f"Search failed: {str(e)}"

if __name__ == "__main__":
    mcp.run()
