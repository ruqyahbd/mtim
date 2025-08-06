/**
 * Cloudflare Function to securely proxy requests to the Gemini API.
 *
 * How it works:
 * 1. Receives a POST request from the frontend with a "question".
 * 2. Retrieves the secret GEMINI_API_KEY from the environment variables.
 * 3. Constructs a prompt and sends the request to the real Gemini API.
 * 4. Returns the AI's answer back to the frontend as JSON.
 */
export async function onRequest(context) {
  // Only allow POST requests
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // Get the user's question from the request body
    const requestBody = await context.request.json();
    const userQuestion = requestBody.question;

    if (!userQuestion) {
      return new Response(JSON.stringify({ error: 'Question is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the secret API key from Cloudflare's environment variables
    const GEMINI_API_KEY = context.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
       return new Response(JSON.stringify({ error: 'API key is not configured on the server.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct the prompt for the Gemini API
    const systemPrompt = "You are an expert assistant knowledgeable in Islamic Ruqyah, Jinn, Magic, and the Evil Eye, based on the teachings of Muhammad Tim Humble, which are strictly from the Qur'an and Sunnah. Answer the following user's question clearly and concisely. Provide practical steps or advice where applicable. Do not give fatawa (religious rulings), but provide information based on authentic sources. Start the answer directly without introductory phrases like 'Here is the answer'.";
    const fullPrompt = `${systemPrompt}\n\nUser Question: "${userQuestion}"`;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    
    // Call the Gemini API
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiResult = await geminiResponse.json();
    
    const answer = geminiResult.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a valid response. Please try again.";

    // Send the answer back to the frontend
    return new Response(JSON.stringify({ answer: answer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Cloudflare function:', error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
