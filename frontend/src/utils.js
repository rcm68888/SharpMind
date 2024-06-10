import axios from 'axios';

// Function to extract text from YouTube video
export async function extractTextFromYoutube(videoUrl) {
  try {
    const response = await axios.post('http://localhost:5001/api/extract-youtube', { videoUrl });
    return response.data.text;
  } catch (error) {
    console.error('Error extracting text from YouTube:', error);
    throw error;
  }
}

// Function to extract text from Google Doc
export async function extractTextFromGDoc(googleDocUrl) {
  try {
    const googleDocId = getGoogleDocId(googleDocUrl);
    const response = await axios.post('http://localhost:5001/api/extract-gdoc', { googleDocId });
    return response.data.text;
  } catch (error) {
    console.error('Error extracting text from Google Doc:', error);
    throw error;
  }
}

// Helper function to extract Google Doc ID from URL
export function getGoogleDocId(url) {
  const match = url.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

// Function to generate quiz using ChatGPT
export async function generateQuizWithChatGPT(text) {
  try {
    const response = await axios.post('http://localhost:5001/api/generate-quiz', { text });
    return response.data;
  } catch (error) {
    console.error('Error generating quiz with ChatGPT:', error);
    throw error;
  }
}
