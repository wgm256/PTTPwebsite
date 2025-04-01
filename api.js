const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST'
      }
    };
  }

  try {
    const requestBody = JSON.parse(event.body || '{}');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yourdomain.com',
        'X-Title': 'Your App Name'
      },
      body: JSON.stringify(requestBody),
      timeout: 8000 // 8 second timeout
    });

    // First get the raw text
    const text = await response.text();
    
    // Then safely parse
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error('Failed to parse:', text);
      throw new Error('Invalid API response');
    }

    if (!response.ok) {
      throw new Error(data.error?.message || `API error: ${response.status}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};