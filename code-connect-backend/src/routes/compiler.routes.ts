import { Router } from 'express';
import { compileCode, getSupportedLanguages } from '../controllers/compiler.controller.js';

const router = Router();

router.post('/compile', compileCode);
router.get('/languages', getSupportedLanguages);

export default router;
