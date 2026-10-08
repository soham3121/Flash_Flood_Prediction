import { Router } from 'express';
import { floodController } from '../controllers/floodController.js';

const router = Router();

// Healthcheck
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'FlashFloodPrediction-API', timestamp: new Date().toISOString() });
});

// Flash flood routes
router.get('/flood/status', floodController.getStatus);
router.post('/flood/simulate', floodController.simulateScenario);
router.post('/flood/alerts/broadcast', floodController.broadcastAlert);

export default router;
