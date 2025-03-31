require('dotenv').config();
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    if (event.httpMethod === 'POST') {
        try {
            const body = JSON.parse(event.body);
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            
            const data = await response.json();
            return {
                statusCode: 200,
                body: JSON.stringify(data),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to connect to API' }),
            };
        }
    }
};
