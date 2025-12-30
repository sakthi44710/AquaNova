const express = require('express');
const router = express.Router();

// @route   POST /api/nvidia/chat
// @desc    Proxy requests to Hugging Face API to avoid CORS
// @access  Public (or add auth middleware if needed)
router.post('/chat', async (req, res) => {
    try {
        const { messages, temperature, max_tokens } = req.body;

        // Extract the user message from the messages array
        const userMessage = messages.find(msg => msg.role === 'user')?.content || '';
        const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';

        // Combine system and user messages for the prompt
        const prompt = systemMessage
            ? `${systemMessage}\n\nUser: ${userMessage}\nAssistant:`
            : `User: ${userMessage}\nAssistant:`;

        const response = await fetch('https://api-inference.huggingface.co/models/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    temperature: temperature || 0.7,
                    max_new_tokens: max_tokens || 512,
                    return_full_text: false,
                    do_sample: true
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Hugging Face API error:', response.status, errorData);
            return res.status(response.status).json({
                error: 'Hugging Face API error',
                details: errorData
            });
        }

        const data = await response.json();

        // Transform Hugging Face response to match OpenAI format
        const transformedResponse = {
            choices: [{
                index: 0,
                message: {
                    role: 'assistant',
                    content: data[0]?.generated_text || 'I apologize, but I could not generate a response.'
                }
            }]
        };

        res.json(transformedResponse);
    } catch (error) {
        console.error('Hugging Face proxy error:', error);
        res.status(500).json({ error: 'Failed to connect to Hugging Face API' });
    }
});

module.exports = router;
