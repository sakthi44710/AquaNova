import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Psychology,
  AutoAwesome,
  TrendingUp,
  Map as MapIcon,
  DataUsage,
  Thermostat,
  Pets,
  Warning,
  Help,
  Clear,
  Refresh
} from '@mui/icons-material';
import './AIChatbot.css';

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // NVIDIA API Configuration
  const NVIDIA_API_KEY = "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";
  const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

  const quickQuestions = [
    { icon: <Thermostat />, text: "What's the ocean temperature like?", category: "temperature" },
    { icon: <Pets />, text: "Tell me about Hilsa fish!", category: "species" },
    { icon: <Warning />, text: "Any ocean alerts I should know?", category: "alerts" },
    { icon: <DataUsage />, text: "What cool data do you have?", category: "datasets" },
    { icon: <TrendingUp />, text: "How's the temperature changing?", category: "temperature" },
    { icon: <MapIcon />, text: "How do fish migrate?", category: "migration" }
  ];

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "Hey there, ocean explorer! 🌊 I'm AquaNova AI, your friendly marine science buddy! I absolutely love talking about everything ocean-related - from cool fish species to ocean temperatures and marine alerts!\n\nI've got tons of data about the Indian Ocean, and I'm super excited to share it with you. What would you like to know about our amazing oceans today? 😊",
        timestamp: new Date(),
        suggestions: ["What's the ocean temp like?", "Tell me about cool fish!", "Any ocean alerts?", "What data do you have?"]
      }
    ]);

    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateAIResponse = async (userMessage) => {
    try {
      const systemPrompt = `You are AquaNova AI, a friendly and enthusiastic marine science buddy who loves the ocean! 🌊

Talk like a supportive friend who's passionate about marine life. Use casual, conversational language while still being informative. You can use emojis occasionally to keep things fun and engaging!

Your knowledge includes:
- Ocean temperatures (Arabian Sea: ~28.5°C, Bay of Bengal: ~31.2°C)
- Cool marine creatures (Hilsa, Tuna, Sea Turtles, and more!)
- Marine alerts (heatwaves, cyclones, etc.)
- Oceanographic datasets and trends

Guidelines for your friendly style:
- Be warm, approachable, and excited to help
- Use phrases like "Hey!", "That's awesome!", "Let me tell you about...", "You're gonna love this!"
- Share facts with enthusiasm, not like a textbook
- Use emojis naturally (🐟🌊🐢🦈) when appropriate
- If you don't know something, be honest but positive: "That's a great question! Let me tell you what I do know..."
- Keep responses conversational but still informative
- Encourage curiosity about the ocean

Remember: You're a knowledgeable friend, not a formal assistant. Make learning about the ocean fun and engaging!`;

      // Call NVIDIA API
      const response = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: "nvidia/llama-3.1-nemotron-70b-instruct",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.8,
          max_tokens: 1024,
          top_p: 0.9,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`NVIDIA API error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = data.choices[0].message.content;

      return {
        content: aiMessage,
        suggestions: ["Current sea temperature", "Active alerts", "Available datasets", "Species information"]
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      // Return error message to user
      return {
        content: "Hey there! 😅 I'm having a little trouble connecting to my AI brain right now. This could be due to network issues or API limits.\n\nPlease try again in a moment, or feel free to ask me something else about our amazing oceans! 🌊",
        suggestions: ["Try again", "Current temperature", "Marine species", "Ocean alerts"]
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Call Google AI
    try {
      const aiResponse = await generateAIResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question.text);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "🌊 Chat cleared! No worries though - I'm still here and ready to chat about all things ocean! What's on your mind? 😊",
        timestamp: new Date(),
        suggestions: ["Ocean temperatures?", "Cool marine species!", "Any alerts?", "Show me data!"]
      }
    ]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-info">
          <div className="ai-avatar">
            <Psychology className="ai-icon" />
          </div>
          <div className="ai-details">
            <h2>AquaNova AI - Your Ocean Buddy 🌊</h2>
            <p className="ai-status">🟢 Online & Ready to Chat!</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={clearChat} title="Clear Chat">
            <Clear />
          </button>
          <button className="header-btn" onClick={() => window.location.reload()} title="Refresh">
            <Refresh />
          </button>
        </div>
      </div>

      <div className="chatbot-body">
        {/* Quick Questions */}
        <div className="quick-questions">
          <h3>Quick Questions:</h3>
          <div className="questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question.icon}
                <span>{question.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <div className="message-avatar">
                {message.type === 'bot' ? (
                  <AutoAwesome className="bot-icon" />
                ) : (
                  <div className="user-avatar">U</div>
                )}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="message-text">
                    {message.content.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line.startsWith('**') && line.endsWith('**') ? (
                          <strong>{line.slice(2, -2)}</strong>
                        ) : line.startsWith('• ') ? (
                          <div className="bullet-point">{line}</div>
                        ) : (
                          line
                        )}
                        {index < message.content.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="message-suggestions">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="suggestion-btn"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message bot">
              <div className="message-avatar">
                <AutoAwesome className="bot-icon" />
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="chatbot-input">
        <div className="input-container">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about sea temperatures, marine species, alerts, datasets..."
            className="message-input"
            rows="1"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="send-button"
          >
            <Send />
          </button>
        </div>
        <div className="input-help">
          <Help className="help-icon" />
          <span>Ask me anything about the ocean! I'm here to help and have fun chatting! 🐟</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;