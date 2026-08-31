interface Document {
  modelContext: ModelContext;
}

interface ModelContext {
  registerTool(tool: {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: any) => Promise<any>;
  }): Promise<void>;

  unregisterTool?(name: string): Promise<void>;
}