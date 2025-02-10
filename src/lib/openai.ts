export async function analyzeEmotion(imageBase64: string) {
  const apiKey = localStorage.getItem("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OpenAI API key not found");
  }

  // Validate API key format
  if (!apiKey.startsWith('sk-')) {
    throw new Error("Invalid API key format. Key should start with 'sk-'");
  }

  try {
    // Remove the data URL prefix if present
    const base64Image = imageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an emotion analysis expert. Always respond with valid JSON following the exact structure requested. The confidenceScore should reflect how clear and distinct the emotion is in the image, ranging from 0 to 1. Low confidence (0.1-0.3) for unclear expressions, medium (0.4-0.7) for somewhat clear expressions, and high (0.8-1.0) for very clear expressions."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze the facial expression in this image. Consider factors like face visibility, expression clarity, and lighting when determining the confidenceScore. Respond ONLY with a JSON object using this exact structure, no other text: { \"dominantEmotion\": string, \"emotions\": { \"happy\": number, \"sad\": number, \"angry\": number, \"surprised\": number, \"fearful\": number, \"disgusted\": number, \"neutral\": number }, \"confidenceScore\": number }. All emotion values must be percentages that sum to 100. The confidenceScore should be between 0 and 1."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`Failed to analyze emotion: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    try {
      // Remove any markdown formatting that might be in the response
      const cleanedContent = data.choices[0].message.content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      console.log('Raw response:', cleanedContent);
      const result = JSON.parse(cleanedContent);
      console.log('Parsed emotion result:', result);
      return result;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', data.choices[0].message.content);
      throw parseError;
    }
  } catch (error) {
    console.error('Error analyzing emotion:', error);
    return null;
  }
} 