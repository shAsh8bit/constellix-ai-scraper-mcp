# @constellix/ai-scraper-mcp

A Model Context Protocol (MCP) server for data extraction using AI to extract structured data from web pages. This tool bridges the gap between LLM and web data extraction by providing an intelligent interface for scraping websites.

## Live
Try playground → https://constellix.vercel.app/

## Features

- **AI-Powered Data Extraction**: Extract structured data from web pages using natural language queries
- **CSS Selector Generation**: Generate CSS selectors for web elements based on natural language descriptions
- **XPath Generation**: Generate XPath expressions for web elements based on natural language descriptions
- **Supports Multiple Query Types**: Use either natural language or structured GraphQL-like queries

## Installation

```bash
# Install and run
npm i @constellix/ai-scraper-mcp

# Set your API key as an environment variable
GEMINI_API_KEY="your-api-key-here"
```

MCP configurations:
```json
{
    "mcpServers": {
        "ai-scraper":{
            "command": "npx",
            "args": [
                "-y",
                "@constellix/ai-scraper-mcp"
            ],
            "env": {
                "GEMINI_API_KEY" : "YOUR_API_KEY"
            }
        }
    }
}
```
Then in your MCP-compatible client (Claude, Cursor, etc.), you can use the ai-scraper tools to extract data from websites.


## Available Tools

### 1. get-data-by-query

Extracts structured data from a webpage using natural language or structured query language.

**Input Schema:**
```
{
  "url": "string", // The webpage URL to extract data from
  "query": "string" // Natural language query or structured query
}
```

### 2. get-css-selector

Generates CSS selectors for webpage elements using natural language or structured query language.

**Input Schema:**
```
{
  "url": "string", // The webpage URL to analyze
  "query": "string" // Natural language query or structured query
}
```

### 3. get-xpath

Generates XPath expressions for webpage elements using natural language or structured query language.

**Input Schema:**
```
{
  "url": "string", // The webpage URL to analyze
  "query": "string" // Natural language query or structured query
}
```

## Query Types

### Natural Language Queries

Examples:
- "List all the products on the page"
- "Find the main navigation menu"
- "Extract all blog post titles and their publication dates"

### Structured Queries (GraphQL-like)

```
{
  products_list[]{
    product_name,
    product_price,
    product_image
  }
}
```

You can also specify data types or add natural language descriptions:

```
{
  products_list[]{
    product_name (string),
    product_price (number),
    product_image (string)
  }
}
```

Or with descriptions:

```
{
  products_list (products made out of cotton)[]{
    product_name,
    product_price,
    product_image
  }
}
```

## Dependencies

This package relies on the `@constellix/ai-scraper` package, which provides capabilities for enhancing Playwright's functionality with AI capabilities.


