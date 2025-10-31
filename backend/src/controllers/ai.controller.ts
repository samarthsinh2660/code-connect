import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ERRORS } from '../utils/error.js';
import {
  ChatRequest,
  AIResponse,
  ExplainCodeRequest,
  CodeSuggestionsRequest,
  FixCodeRequest,
  ExplainCodeResponse,
  CodeSuggestionsResponse,
  FixCodeResponse
} from '../types/api.types.js';
import { GEMINI_API_KEY, MAX_CODE_LENGTH } from '../config/env.js';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

/**
 * Chat with AI about code
 */
export const chatWithAI = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, context, history }: ChatRequest = req.body;

    if (!message) {
      res.status(ERRORS.INVALID_PARAMS.statusCode).json({
        success: false,
        error: ERRORS.INVALID_PARAMS
      });
      return;
    }

    if (message.length > 10000) {
      res.status(ERRORS.AI_REQUEST_TOO_LARGE.statusCode).json({
        success: false,
        error: ERRORS.AI_REQUEST_TOO_LARGE
      });
      return;
    }

    // Build context-aware prompt
    let fullPrompt = '';

    // Add code context if available
    if (context?.code) {
      fullPrompt += `Current code context:\n`;
      fullPrompt += `Language: ${context.language || 'Unknown'}\n`;
      if (context.filename) {
        fullPrompt += `File: ${context.filename}\n`;
      }
      fullPrompt += `\`\`\`${context.language || ''}\n${context.code}\n\`\`\`\n\n`;
    }

    fullPrompt += `User question: ${message}`;

    // Convert history to Gemini format
    const chatHistory = history ? history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) : [];

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    const aiMessage = response.text();

    const aiResponse: AIResponse = {
      success: true,
      data: {
        message: aiMessage,
        context: context || undefined
      }
    };

    res.json(aiResponse);
  } catch (error: any) {
    console.error('AI chat error:', error);

    if (error.response?.status === 429) {
      res.status(ERRORS.AI_RATE_LIMIT_EXCEEDED.statusCode).json({
        success: false,
        error: ERRORS.AI_RATE_LIMIT_EXCEEDED
      });
      return;
    }

    if (error.response?.status >= 500) {
      res.status(ERRORS.AI_SERVICE_UNAVAILABLE.statusCode).json({
        success: false,
        error: ERRORS.AI_SERVICE_UNAVAILABLE
      });
      return;
    }

    res.status(ERRORS.AI_API_ERROR.statusCode).json({
      success: false,
      error: ERRORS.AI_API_ERROR
    });
  }
};

/**
 * Explain code with AI
 */
export const explainCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, language }: ExplainCodeRequest = req.body;

    if (!code) {
      res.status(ERRORS.INVALID_PARAMS.statusCode).json({
        success: false,
        error: ERRORS.INVALID_PARAMS
      });
      return;
    }

    if (code.length > MAX_CODE_LENGTH) {
      res.status(ERRORS.AI_REQUEST_TOO_LARGE.statusCode).json({
        success: false,
        error: ERRORS.AI_REQUEST_TOO_LARGE
      });
      return;
    }

    const prompt = `Explain the following ${language || ''} code in detail:\n\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\nProvide a clear explanation of what this code does, including:
1. Main functionality
2. Key concepts used
3. Potential issues or improvements`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const explanation = response.text();

    const aiResponse: ExplainCodeResponse = {
      success: true,
      data: {
        explanation
      }
    };

    res.json(aiResponse);
  } catch (error: any) {
    console.error('Code explanation error:', error);

    if (error.response?.status === 429) {
      res.status(ERRORS.AI_RATE_LIMIT_EXCEEDED.statusCode).json({
        success: false,
        error: ERRORS.AI_RATE_LIMIT_EXCEEDED
      });
      return;
    }

    if (error.response?.status >= 500) {
      res.status(ERRORS.AI_SERVICE_UNAVAILABLE.statusCode).json({
        success: false,
        error: ERRORS.AI_SERVICE_UNAVAILABLE
      });
      return;
    }

    res.status(ERRORS.AI_API_ERROR.statusCode).json({
      success: false,
      error: ERRORS.AI_API_ERROR
    });
  }
};

/**
 * Get code suggestions from AI
 */
export const getCodeSuggestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, language, issue }: CodeSuggestionsRequest = req.body;

    if (!code) {
      res.status(ERRORS.INVALID_PARAMS.statusCode).json({
        success: false,
        error: ERRORS.INVALID_PARAMS
      });
      return;
    }

    if (code.length > MAX_CODE_LENGTH) {
      res.status(ERRORS.AI_REQUEST_TOO_LARGE.statusCode).json({
        success: false,
        error: ERRORS.AI_REQUEST_TOO_LARGE
      });
      return;
    }

    let prompt = `Review and suggest improvements for this ${language || ''} code:\n\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\n`;

    if (issue) {
      prompt += `Focus on: ${issue}\n\n`;
    }

    prompt += `Provide:
1. Potential bugs or issues
2. Performance improvements
3. Best practices recommendations
4. Code refactoring suggestions`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const suggestions = response.text();

    const aiResponse: CodeSuggestionsResponse = {
      success: true,
      data: {
        suggestions
      }
    };

    res.json(aiResponse);
  } catch (error: any) {
    console.error('Code suggestions error:', error);

    if (error.response?.status === 429) {
      res.status(ERRORS.AI_RATE_LIMIT_EXCEEDED.statusCode).json({
        success: false,
        error: ERRORS.AI_RATE_LIMIT_EXCEEDED
      });
      return;
    }

    if (error.response?.status >= 500) {
      res.status(ERRORS.AI_SERVICE_UNAVAILABLE.statusCode).json({
        success: false,
        error: ERRORS.AI_SERVICE_UNAVAILABLE
      });
      return;
    }

    res.status(ERRORS.AI_API_ERROR.statusCode).json({
      success: false,
      error: ERRORS.AI_API_ERROR
    });
  }
};

/**
 * Fix code errors with AI
 */
export const fixCodeError = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, language, error: errorMessage }: FixCodeRequest = req.body;

    if (!code || !errorMessage) {
      res.status(ERRORS.INVALID_PARAMS.statusCode).json({
        success: false,
        error: ERRORS.INVALID_PARAMS
      });
      return;
    }

    if (code.length > MAX_CODE_LENGTH) {
      res.status(ERRORS.AI_REQUEST_TOO_LARGE.statusCode).json({
        success: false,
        error: ERRORS.AI_REQUEST_TOO_LARGE
      });
      return;
    }

    const prompt = `Fix this ${language || ''} code error:\n\nCode:\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\nError:\n${errorMessage}\n\nProvide:
1. The fixed code
2. Explanation of the error
3. What was changed and why`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const fix = response.text();

    const aiResponse: FixCodeResponse = {
      success: true,
      data: {
        fix
      }
    };

    res.json(aiResponse);
  } catch (error: any) {
    console.error('Code fix error:', error);

    if (error.response?.status === 429) {
      res.status(ERRORS.AI_RATE_LIMIT_EXCEEDED.statusCode).json({
        success: false,
        error: ERRORS.AI_RATE_LIMIT_EXCEEDED
      });
      return;
    }

    if (error.response?.status >= 500) {
      res.status(ERRORS.AI_SERVICE_UNAVAILABLE.statusCode).json({
        success: false,
        error: ERRORS.AI_SERVICE_UNAVAILABLE
      });
      return;
    }

    res.status(ERRORS.AI_API_ERROR.statusCode).json({
      success: false,
      error: ERRORS.AI_API_ERROR
    });
  }
};
