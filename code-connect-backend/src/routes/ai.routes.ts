import { Router } from 'express';
import { chatWithAI, explainCode, getCodeSuggestions, fixCodeError } from '../controllers/ai.controller.js';

const router = Router();

router.post('/chat', chatWithAI);
router.post('/explain', explainCode);
router.post('/suggestions', getCodeSuggestions);
router.post('/fix', fixCodeError);

export default router;
