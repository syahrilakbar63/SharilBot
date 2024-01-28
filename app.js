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
  temperature: 0.5,
  topK: 20,
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
    console.log('\x1b[31mMaaf, pesan tidak boleh kosong.\x1b[0m');
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

    console.log('\x1b[36mSharilBot:\x1b[0m', response.text());
    console.log();
  } catch (error) {
    console.error('\x1b[31mTerjadi kesalahan dalam mendapatkan respons dari model:\x1b[0m', error.message);
  }

  getUserInput();
};

const getUserInput = () => {
  rl.question('\x1b[33mAnda:\x1b[0m ', (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      rl.close();
    } else {
      handleUserInput(userInput);
    }
  });
};

console.log('\x1b[32mSelamat datang di SharilBot!\x1b[0m\n');
getUserInput();
