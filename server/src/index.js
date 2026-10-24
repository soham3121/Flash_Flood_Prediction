import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development
app.use(cors());
app.use(express.json());

// Main API routing
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Flash Flood Early Warning System API",
    status: "Active",
    docs: "/api/flood/status"
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🌊 FLASH FLOOD EARLY WARNING SYSTEM`);
    console.log(`  🚀 Server running on http://localhost:${PORT}`);
    console.log(`  📡 API endpoint: http://localhost:${PORT}/api/flood/status`);
    console.log(`====================================================`);
  });
}

export default app;
