const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const MODEL_NAME = 'gemini-pro';
const API_KEY = 'AIzaSyDvB7PBnlSaeootaAoGwRBnwjuk5Ah80KY';
const chatHistory = [];
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 3000,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const handleUserInput = async (userInput) => {
  if (!userInput.trim()) {
    console.log('Maaf, pesan tidak boleh kosong.');
    getUserInput();
    return;
  }

  try {
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: chatHistory,
    });

    const result = await chat.sendMessage(userInput);
    const response = result.response;

    chatHistory.push({ role: 'user', parts: [{ text: userInput }] });
    chatHistory.push({ role: 'model', parts: [{ text: response.text() }] });

    console.log(`SharilBot: ${response.text()}\n`);
  } catch (error) {
    console.error('Terjadi kesalahan dalam mendapatkan respons dari model:', error.message);
  }

  getUserInput();
};

const getUserInput = () => {
  rl.question('Anda: ', (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
    } else {
      handleUserInput(userInput);
    }
  });
};

console.log('Selamat datang di SharilBot!\n');
getUserInput();