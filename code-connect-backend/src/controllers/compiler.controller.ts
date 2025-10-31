import { Request, Response } from 'express';
import axios from 'axios';
import { ERRORS } from '../utils/error.js';
import { CompileRequest, CompileResult, SupportedLanguage } from '../types/api.types.js';
import { JUDGE0_API_KEY, CODE_EXECUTION_TIMEOUT, MAX_CODE_LENGTH } from '../config/env.js';

// Judge0 API configuration (free tier)
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';

// Language ID mapping for Judge0
const LANGUAGE_IDS: { [key: string]: number } = {
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

interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
}

interface Judge0Response {
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

/**
 * Compile and execute code
 */
export const compileCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, code, input }: CompileRequest = req.body;

    // Validate input
    if (!language || !code) {
      res.status(ERRORS.INVALID_PARAMS.statusCode).json({
        success: false,
        error: ERRORS.INVALID_PARAMS
      });
      return;
    }

    if (code.length > MAX_CODE_LENGTH) {
      res.status(ERRORS.CODE_TOO_LARGE.statusCode).json({
        success: false,
        error: ERRORS.CODE_TOO_LARGE
      });
      return;
    }

    const languageId = LANGUAGE_IDS[language.toLowerCase()];
    if (!languageId) {
      res.status(ERRORS.INVALID_LANGUAGE.statusCode).json({
        success: false,
        error: ERRORS.INVALID_LANGUAGE
      });
      return;
    }

    // Prepare submission
    const submission: Judge0Submission = {
      source_code: Buffer.from(code).toString('base64'),
      language_id: languageId,
      stdin: input ? Buffer.from(input).toString('base64') : undefined,
    };

    // Submit to Judge0
    const submitResponse = await axios.post(
      `${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`,
      submission,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        timeout: CODE_EXECUTION_TIMEOUT
      }
    );

    const result: Judge0Response = submitResponse.data;

    // Decode output
    const stdout = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
    const stderr = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
    const compile_output = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';

    const compileResult: CompileResult = {
      success: true,
      data: {
        output: stdout,
        error: stderr || compile_output || result.message || undefined,
        status: result.status.description,
        time: result.time,
        memory: result.memory
      }
    };

    res.json(compileResult);
  } catch (error: any) {
    console.error('Compilation error:', error);

    if (error.code === 'ECONNABORTED') {
      res.status(ERRORS.CODE_TIMEOUT.statusCode).json({
        success: false,
        error: ERRORS.CODE_TIMEOUT
      });
      return;
    }

    if (error.response?.status === 429) {
      res.status(ERRORS.AI_RATE_LIMIT_EXCEEDED.statusCode).json({
        success: false,
        error: ERRORS.AI_RATE_LIMIT_EXCEEDED
      });
      return;
    }

    if (error.response?.status >= 500) {
      res.status(ERRORS.COMPILER_SERVICE_UNAVAILABLE.statusCode).json({
        success: false,
        error: ERRORS.COMPILER_SERVICE_UNAVAILABLE
      });
      return;
    }

    res.status(ERRORS.COMPILER_API_ERROR.statusCode).json({
      success: false,
      error: ERRORS.COMPILER_API_ERROR
    });
  }
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = async (_req: Request, res: Response): Promise<void> => {
  const languages: SupportedLanguage[] = Object.keys(LANGUAGE_IDS).map(lang => ({
    name: lang,
    id: LANGUAGE_IDS[lang],
    displayName: lang.charAt(0).toUpperCase() + lang.slice(1)
  }));

  res.json({
    success: true,
    data: {
      languages
    }
  });
};
