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

// Language ID mapping for Judge0
export const LANGUAGE_IDS: { [key: string]: number } = {
  javascript: 63,    // Node.js
  python: 71,        // Python 3
  java: 62,          // Java
  c: 50,             // C (GCC 9.2.0)
  cpp: 54,           // C++ (GCC 9.2.0)
  typescript: 74,    // TypeScript
  csharp: 51,        // C#
  go: 60,            // Go
  rust: 73,          // Rust
  ruby: 72,          // Ruby
  php: 68,           // PHP
  swift: 83,         // Swift
  kotlin: 78,        // Kotlin
};

// Judge0 API configuration
export const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

export interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

export interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
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
