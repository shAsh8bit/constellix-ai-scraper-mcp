#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { chromium } from "playwright";
import { ToolsDescription } from "./description/index.js";
import { setup, wrapper } from "@constellix/ai-scraper";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

let browser;
const GET_DATA_TOOL = "get-data-by-query";
const GET_CSS_SELECTOR_TOOL = "get-css-selector";
const GET_XPATH_TOOL = "get-xpath";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

// Create an MCP server with only tools capability.
const server = new Server(
  {
    name: "ai-scraper-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize the browser when the server starts
async function initBrowser() {
  browser = await chromium.launch({ headless: true });
  console.log("Browser initialized");
}

async function getDataByQuery(url, query) {
  try {
    if (!browser) {
      await initBrowser();
    }
    setup(GEMINI_API_KEY);
    const context = await browser.newContext();
    const page = await wrapper(await context.newPage());
    await page.goto(url);
    const result = await page.getDataByQuery(query);

    await page.close();
    return result;
  } catch (error) {
    console.error(`Error opening page: ${error.message}`);
  }
}
async function getCssPathByQuery(url, query) {
  try {
    if (!browser) {
      await initBrowser();
    }
    setup(GEMINI_API_KEY);
    const context = await browser.newContext();
    const page = await wrapper(await context.newPage());
    await page.goto(url);
    const result = await page.getCssPathByQuery(query);

    await page.close();
    return result;
  } catch (error) {
    console.error(`Error opening page: ${error.message}`);
  }
}
async function getXPathByQuery(url, query) {
  try {
    if (!browser) {
      await initBrowser();
    }
    setup(GEMINI_API_KEY);
    const context = await browser.newContext();
    const page = await wrapper(await context.newPage());
    await page.goto(url);
    const result = await page.getXPathByQuery(query);
    await page.close();
    return result;
  } catch (error) {
    console.error(`Error opening page: ${error.message}`);
  }
}

// Handler that lists available tools.
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: GET_DATA_TOOL,
        description:
          "Gets json/structured data from a public webpage using natural language or structured query language",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The page url to get the data from",
            },
            query: {
              type: "string",
              description: ToolsDescription.dataQuery(),
            },
          },
          required: ["url", "query"],
        },
      },
      {
        name: GET_CSS_SELECTOR_TOOL,
        description:
          "Gets json/structured response of HTML/playwright/puppeteer CSS path from a public webpage using natural language or structured query language",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The page url to get the data from",
            },
            query: {
              type: "string",
              description: ToolsDescription.elementQuery((cssSelector = true)),
            },
          },
          required: ["url", "query"],
        },
      },
      {
        name: GET_XPATH_TOOL,
        description:
          "Gets json/structured response of HTML/playwright/puppeteer xPath from a public webpage using natural language or structured query language",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The page url to get the data from",
            },
            query: {
              type: "string",
              description: ToolsDescription.elementQuery(),
            },
          },
          required: ["url", "query"],
        },
      },
    ],
  };
});

// Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case GET_DATA_TOOL: {
      const url = String(request.params.arguments?.url);
      const query = String(request.params.arguments?.query);
      const result = await getDataByQuery(url, query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
    case GET_CSS_SELECTOR_TOOL: {
      const url = String(request.params.arguments?.url);
      const query = String(request.params.arguments?.query);
      const result = await getCssPathByQuery(url, query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
    case GET_XPATH_TOOL: {
      const url = String(request.params.arguments?.url);
      const query = String(request.params.arguments?.query);
      const result = await getXPathByQuery(url, query);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
    default:
      throw new Error(`Unknown tool: '${request.params.name}'`);
  }
});

// Start the server using stdio transport.
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
