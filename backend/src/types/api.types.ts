// Compiler types
export interface CompileRequest {
  language: string;
  code: string;
  input?: string;
}

export interface CompileResult {
  success: boolean;
  data: {
    output: string;
    error?: string;
    status: string;
    time: string;
    memory: number;
  };
}

export interface SupportedLanguage {
  name: string;
  id: number;
  displayName: string;
}

// AI types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIContext {
  code?: string;
  language?: string;
  filename?: string;
}

export interface ChatRequest {
  message: string;
  context?: AIContext;
  history?: ChatMessage[];
}

export interface AIResponse {
  success: boolean;
  data: {
    message: string;
    context?: AIContext;
  };
}

export interface ExplainCodeResponse {
  success: boolean;
  data: {
    explanation: string;
  };
}

export interface CodeSuggestionsResponse {
  success: boolean;
  data: {
    suggestions: string;
  };
}

export interface FixCodeResponse {
  success: boolean;
  data: {
    fix: string;
  };
}

export interface ExplainCodeRequest {
  code: string;
  language: string;
}

export interface CodeSuggestionsRequest {
  code: string;
  language: string;
  issue?: string;
}

export interface FixCodeRequest {
  code: string;
  language: string;
  error: string;
}
