const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is missing in .env');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // Try different model names to see what works
    const models = [
      'gemini-pro',
      'gemini-pro-vision',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro'
    ];

    for (const modelName of models) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName} works: ${response.text().substring(0, 50)}...`);
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
