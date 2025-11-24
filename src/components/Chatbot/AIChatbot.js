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
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_KEY);
  // Use gemini-1.5-flash for faster, cost-effective responses
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const quickQuestions = [
    { icon: <Thermostat />, text: "What's the current sea temperature?", category: "temperature" },
    { icon: <Pets />, text: "Tell me about Hilsa fish migration", category: "species" },
    { icon: <Warning />, text: "Any active marine alerts?", category: "alerts" },
    { icon: <DataUsage />, text: "What datasets are available?", category: "datasets" },
    { icon: <TrendingUp />, text: "Show temperature trends", category: "temperature" },
    { icon: <MapIcon />, text: "Explain fish migration patterns", category: "migration" }
  ];

  // Marine data knowledge base for fallback responses
  const marineKnowledgeBase = {
    temperature: {
      current: "Current sea surface temperatures in the Indian Ocean range from 28.5°C in the Arabian Sea to 31.2°C in the Bay of Bengal.",
      trends: "Temperature has been rising by 0.3-0.5°C per decade in Indian Ocean waters due to climate change.",
      impacts: "Rising temperatures affect fish migration patterns, coral bleaching, and marine ecosystem health."
    },
    species: {
      hilsa: "Hilsa (Tenualosa ilisha) is an anadromous fish that migrates from sea to rivers for spawning during monsoon season. It's economically important but faces threats from overfishing and dam construction.",
      tuna: "Skipjack tuna (Katsuwonus pelamis) are highly migratory pelagic fish found throughout the Indian Ocean. They're crucial for commercial fisheries.",
      turtle: "Green sea turtles (Chelonia mydas) are endangered marine reptiles that nest on Indian coasts from November to March."
    },
    alerts: {
      current: "There are currently active marine heatwave alerts in the Arabian Sea and cyclone formation warnings in the Bay of Bengal.",
      heatwave: "Marine heatwaves occur when sea surface temperatures exceed the 90th percentile for more than 5 consecutive days.",
      cyclone: "Cyclones in the Indian Ocean typically form during pre-monsoon (April-June) and post-monsoon (October-December) periods."
    },
    datasets: {
      available: "We have 156 active datasets including temperature, currents, biodiversity, and eDNA data from ERDDAP and Copernicus Marine services.",
      formats: "Data is available in NetCDF, CSV, JSON, and GRIB2 formats for different applications.",
      sources: "Data sources include CMLRE, INCOIS, Copernicus Marine, NASA Ocean Color, and research vessel surveys."
    },
    migration: {
      patterns: "Fish migration in Indian waters is influenced by monsoons, temperature gradients, and food availability.",
      seasons: "Major migration periods are pre-monsoon (March-May), monsoon (June-September), and post-monsoon (October-December).",
      routes: "Common migration routes follow the continental shelf and upwelling zones along the Indian coast."
    }
  };

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: "🌊 Hello! I'm AquaNova AI, your marine data assistant. I have access to comprehensive oceanographic data, species information, temperature trends, and real-time alerts for the Indian Ocean region. How can I help you today?",
        timestamp: new Date(),
        suggestions: ["Current sea temperature", "Active alerts", "Species information", "Available datasets"]
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

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Temperature queries
    if (message.includes('temperature') || message.includes('temp') || message.includes('hot') || message.includes('warm')) {
      if (message.includes('current') || message.includes('now') || message.includes('today')) {
        return {
          content: `🌡️ **Current Sea Surface Temperatures (Offline Mode):**\n\n${marineKnowledgeBase.temperature.current}\n\nThe Arabian Sea is experiencing elevated temperatures, with a marine heatwave alert currently active. Bay of Bengal temperatures are also above normal seasonal averages.`,
          suggestions: ["Temperature trends", "Heatwave impacts", "View temperature map"]
        };
      } else if (message.includes('trend') || message.includes('change') || message.includes('rising')) {
        return {
          content: `📈 **Temperature Trends (Offline Mode):**\n\n${marineKnowledgeBase.temperature.trends}\n\n${marineKnowledgeBase.temperature.impacts}\n\nThis warming trend is particularly pronounced in the Arabian Sea and northern Bay of Bengal regions.`,
          suggestions: ["Current temperature", "Climate impacts", "View temperature charts"]
        };
      }
      return {
        content: `🌡️ **Temperature Information (Offline Mode):**\n\n${marineKnowledgeBase.temperature.current}\n\n**Long-term Trends:**\n${marineKnowledgeBase.temperature.trends}`,
        suggestions: ["View temperature map", "Heatwave alerts", "Climate impacts"]
      };
    }

    // Species queries
    if (message.includes('hilsa') || message.includes('ilish')) {
      return {
        content: `🐟 **Hilsa (Tenualosa ilisha):**\n\n${marineKnowledgeBase.species.hilsa}\n\n**Migration Pattern:** Anadromous - moves from sea to rivers\n**Season:** Monsoon (June-September)\n**Status:** Near Threatened\n**Economic Value:** Very High - Major commercial fishery`,
        suggestions: ["View migration map", "Other fish species", "eDNA data", "Conservation status"]
      };
    }

    if (message.includes('tuna')) {
      return {
        content: `🐟 **Skipjack Tuna (Katsuwonus pelamis):**\n\n${marineKnowledgeBase.species.tuna}\n\n**Migration:** Highly migratory, year-round movement\n**Habitat:** Open ocean (pelagic)\n**Status:** Least Concern\n**Economic Value:** Very High - Major tuna fishery`,
        suggestions: ["View migration routes", "Tuna fishing data", "Ocean currents", "Other tuna species"]
      };
    }

    if (message.includes('turtle') || message.includes('chelonia')) {
      return {
        content: `🐢 **Green Sea Turtle (Chelonia mydas):**\n\n${marineKnowledgeBase.species.turtle}\n\n**Nesting Season:** November-March\n**Status:** Endangered\n**Threats:** Plastic pollution, coastal development, climate change\n**Conservation:** Protected under Wildlife Protection Act`,
        suggestions: ["Turtle nesting sites", "Conservation efforts", "Marine pollution", "Other sea turtles"]
      };
    }

    if (message.includes('species') || message.includes('fish') || message.includes('marine life') || message.includes('biodiversity')) {
      return {
        content: `🐟 **Marine Biodiversity in Indian Waters:**\n\nOur database contains 1,247 monitored species including:\n\n• **Commercial Fish:** Hilsa, Tuna, Sardines, Mackerel\n• **Endangered Species:** Green Sea Turtles, Whale Sharks\n• **Reef Fish:** Groupers, Snappers, Angelfish\n• **Crustaceans:** Prawns, Crabs, Lobsters\n\n**Latest eDNA Analysis:** 23 new species detections this month`,
        suggestions: ["Search specific species", "View migration maps", "eDNA analysis", "Conservation status"]
      };
    }

    // Alert queries
    if (message.includes('alert') || message.includes('warning') || message.includes('hazard') || message.includes('danger')) {
      return {
        content: `⚠️ **Current Marine Alerts (Offline Mode):**\n\n${marineKnowledgeBase.alerts.current}\n\n**Active Alerts:**\n🔥 Marine Heatwave - Arabian Sea (High Severity)\n🌀 Cyclone Formation - Bay of Bengal (Extreme Severity)\n💨 High Wind Advisory - Kerala Coast (Moderate Severity)\n\n**Recommendations:** Vessels should monitor conditions closely and follow safety protocols.`,
        suggestions: ["View alert map", "Safety guidelines", "Weather forecast", "Subscribe to alerts"]
      };
    }

    if (message.includes('heatwave')) {
      return {
        content: `🔥 **Marine Heatwave Information:**\n\n${marineKnowledgeBase.alerts.heatwave}\n\n**Current Status:** Active heatwave in Arabian Sea with temperatures exceeding 32°C\n\n**Impacts:**\n• Coral bleaching risk\n• Fish behavior changes\n• Reduced oxygen levels\n• Altered food chain dynamics`,
        suggestions: ["Temperature data", "Coral health", "Fish impacts", "Climate trends"]
      };
    }

    if (message.includes('cyclone') || message.includes('storm')) {
      return {
        content: `🌀 **Cyclone Information:**\n\n${marineKnowledgeBase.alerts.cyclone}\n\n**Current Alert:** Deep depression in Bay of Bengal intensifying\n**Landfall Prediction:** 48-72 hours\n**Affected Areas:** Eastern coast - Odisha, Andhra Pradesh\n\n**Marine Safety:** All vessels should return to safe harbor immediately.`,
        suggestions: ["Track cyclone", "Safety protocols", "Port advisories", "Historical data"]
      };
    }

    // Dataset queries
    if (message.includes('data') || message.includes('dataset') || message.includes('download') || message.includes('available')) {
      return {
        content: `📊 **Available Marine Datasets:**\n\n${marineKnowledgeBase.datasets.available}\n\n**Categories:**\n• Temperature & Climate (45 datasets)\n• Ocean Currents (28 datasets)\n• Biodiversity & Species (52 datasets)\n• eDNA Analysis (18 datasets)\n• Water Quality (13 datasets)\n\n**Data Sources:** ${marineKnowledgeBase.datasets.sources}`,
        suggestions: ["Browse datasets", "Download data", "API access", "Data formats"]
      };
    }

    // Migration queries
    if (message.includes('migration') || message.includes('movement') || message.includes('route')) {
      return {
        content: `🗺️ **Fish Migration Patterns:**\n\n${marineKnowledgeBase.migration.patterns}\n\n**Seasonal Patterns:**\n${marineKnowledgeBase.migration.seasons}\n\n**Major Routes:**\n${marineKnowledgeBase.migration.routes}\n\n**Tracking Methods:** Satellite tagging, eDNA sampling, fisheries data analysis`,
        suggestions: ["View migration map", "Seasonal patterns", "Tracking technology", "Species-specific routes"]
      };
    }

    // General help or unclear queries
    if (message.includes('help') || message.includes('what can you do') || message.includes('features')) {
      return {
        content: `🤖 **AquaNova AI Capabilities (Offline Mode):**\n\nI can help you with:\n\n🌡️ **Temperature Analysis** - Current conditions, trends, heatwaves\n🐟 **Marine Species** - Information, migration patterns, eDNA data\n⚠️ **Environmental Alerts** - Heatwaves, cyclones, hazard warnings\n📊 **Datasets** - Available data, download options, formats\n🗺️ **Mapping** - Interactive visualizations, migration routes\n📈 **Trends** - Climate patterns, species populations, water quality\n\nJust ask me anything about marine data for the Indian Ocean region!`,
        suggestions: ["Current sea temperature", "Active alerts", "Available datasets", "Species migration"]
      };
    }

    // Default response for unrecognized queries
    return {
      content: `🌊 I understand you're asking about "${userMessage}". While I have comprehensive marine data for the Indian Ocean region, I might need more specific information to help you better.\n\nI can provide detailed information about:\n• Sea surface temperatures and climate\n• Marine species and biodiversity\n• Fish migration patterns\n• Environmental alerts and hazards\n• Available oceanographic datasets\n\nCould you please rephrase your question or choose from the suggestions below?`,
      suggestions: ["Current temperature", "Marine species info", "Active alerts", "Available datasets"]
    };
  };

  const generateAIResponse = async (userMessage) => {
    try {
      const prompt = `
        You are AquaNova AI, a specialized marine data assistant for the Indian Ocean region.
        You have access to comprehensive oceanographic data, species information, temperature trends, and real-time alerts.
        
        Your knowledge base includes:
        - Current sea surface temperatures (Arabian Sea: ~28.5°C, Bay of Bengal: ~31.2°C)
        - Marine species (Hilsa, Tuna, Green Sea Turtles)
        - Alerts (Marine Heatwaves, Cyclones)
        - Datasets (156 active datasets from Copernicus Marine/INCOIS)
        
        User Question: "${userMessage}"
        
        Provide a helpful, professional, and concise response. Use formatting like **bold** for key terms and bullet points for lists.
        If the question is about specific data you don't have real-time access to, explain what data is typically available in the platform.
        Always maintain the persona of a helpful marine scientist.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text,
        suggestions: ["Current sea temperature", "Active alerts", "Available datasets", "Species information"]
      };
    } catch (error) {
      console.error("Error generating AI response:", error);
      // Fallback to local knowledge base
      console.log("Falling back to local knowledge base...");
      return getFallbackResponse(userMessage);
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
        content: "🌊 Chat cleared! I'm ready to help you with marine data questions. What would you like to know?",
        timestamp: new Date(),
        suggestions: ["Current sea temperature", "Active alerts", "Species information", "Available datasets"]
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
            <h2>AquaNova AI Assistant</h2>
            <p className="ai-status">🟢 Online - Trained on Marine Data</p>
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
          <span>Try asking: "What's the current sea temperature?" or "Any active marine alerts?"</span>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;