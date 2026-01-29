import app from './app.js';
import config from './config/index.js';
import { testConnection } from './config/database.js';
import './models/index.js'; // Load models and associations

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start server
    app.listen(config.port, () => {
      console.log('═══════════════════════════════════════════');
      console.log('   🐾 PatiKampus Backend Server');
      console.log('═══════════════════════════════════════════');
      console.log(`   🚀 Port: ${config.port}`);
      console.log(`   🌍 Environment: ${config.nodeEnv}`);
      console.log(`   📅 Started: ${new Date().toLocaleString('tr-TR')}`);
      console.log('═══════════════════════════════════════════');
      console.log('   API Endpoints:');
      console.log('   • GET  /api/health - API durumu');
      console.log('   • POST /api/auth/giris - Giriş');
      console.log('   • POST /api/auth/kayit - Kayıt');
      console.log('   • GET  /api/mama-kaplari - Mama kapları');
      console.log('   • GET  /api/skorlar/liderlik - Liderlik');
      console.log('═══════════════════════════════════════════');
    });
  } catch (error) {
    console.error('❌ Server başlatılamadı:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM signal received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT signal received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
