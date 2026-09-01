export {};

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: any) => Promise<unknown>;
}

interface ModelContext {
  registerTool: (tool: ModelContextTool) => void;
}

declare global {
  interface Document {
    modelContext: ModelContext;
  }
}