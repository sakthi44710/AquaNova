const express = require('express');
const router = express.Router();

// @route   POST /api/nvidia/chat
// @desc    Proxy requests to NVIDIA API to avoid CORS
// @access  Public (or add auth middleware if needed)
router.post('/chat', async (req, res) => {
    try {
        const { messages, temperature, max_tokens, top_p } = req.body;

        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: "nvidia/nemotron-nano-12b-v2-vl",
                messages,
                temperature: temperature || 0.8,
                max_tokens: max_tokens || 1024,
                top_p: top_p || 0.9,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('NVIDIA API error:', response.status, errorData);
            return res.status(response.status).json({ 
                error: 'NVIDIA API error', 
                details: errorData 
            });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('NVIDIA proxy error:', error);
        res.status(500).json({ error: 'Failed to connect to NVIDIA API' });
    }
});

module.exports = router;
