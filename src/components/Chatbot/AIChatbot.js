import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Send,
  SmartToy,
  Person,
  Thermostat,
  Pets,
  Warning,
  Waves,
  DeleteOutline,
  Add,
  History,
  Chat,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import './AIChatbot.css';

const AIChatbot = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const quickPrompts = [
    { icon: React.createElement(Thermostat), text: 'Current ocean temperature', color: '#f59e0b' },
    { icon: React.createElement(Pets), text: 'Marine species info', color: '#10b981' },
    { icon: React.createElement(Warning), text: 'Active ocean alerts', color: '#ef4444' },
    { icon: React.createElement(Waves), text: 'Ocean current data', color: '#3b82f6' }
  ];

  // Initialize with a new chat
  useEffect(function() {
    var savedHistory = localStorage.getItem('aquanova_chat_history');
    if (savedHistory) {
      var parsed = JSON.parse(savedHistory);
      setChatHistory(parsed);
      if (parsed.length > 0) {
        setActiveChatId(parsed[0].id);
        // Convert timestamp strings back to Date objects
        var messagesWithDates = parsed[0].messages.map(function(m) {
          return { ...m, timestamp: new Date(m.timestamp) };
        });
        setMessages(messagesWithDates);
        return;
      }
    }
    startNewChat();
  }, []);

  // Save chat history to localStorage
  useEffect(function() {
    if (chatHistory.length > 0) {
      localStorage.setItem('aquanova_chat_history', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  // Update current chat in history when messages change
  useEffect(function() {
    if (activeChatId && messages.length > 1) {
      setChatHistory(function(prev) {
        return prev.map(function(chat) {
          if (chat.id === activeChatId) {
            var title = messages.find(function(m) { return m.type === 'user'; });
            return {
              ...chat,
              messages: messages,
              title: title ? title.content.substring(0, 30) + (title.content.length > 30 ? '...' : '') : 'New Chat',
              updatedAt: new Date().toISOString()
            };
          }
          return chat;
        });
      });
    }
  }, [messages, activeChatId]);

  useEffect(function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input after typing completes
  useEffect(function() {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  var startNewChat = function() {
    var newChatId = Date.now();
    var welcomeMsg = {
      id: 1,
      type: 'bot',
      content: 'Hello! I am AquaNova AI, your marine science assistant. I can help you with ocean temperatures, marine species, alerts, and oceanographic data. What would you like to know?',
      timestamp: new Date()
    };
    
    var newChat = {
      id: newChatId,
      title: 'New Chat',
      messages: [welcomeMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setChatHistory(function(prev) { return [newChat, ...prev]; });
    setActiveChatId(newChatId);
    setMessages([welcomeMsg]);
    
    setTimeout(function() {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  var loadChat = function(chatId) {
    var chat = chatHistory.find(function(c) { return c.id === chatId; });
    if (chat) {
      setActiveChatId(chatId);
      setMessages(chat.messages.map(function(m) {
        return { ...m, timestamp: new Date(m.timestamp) };
      }));
    }
    setTimeout(function() {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  var deleteChat = function(chatId, e) {
    e.stopPropagation();
    setChatHistory(function(prev) {
      var filtered = prev.filter(function(c) { return c.id !== chatId; });
      if (chatId === activeChatId) {
        if (filtered.length > 0) {
          loadChat(filtered[0].id);
        } else {
          startNewChat();
        }
      }
      return filtered;
    });
  };

  var formatChatDate = function(dateStr) {
    var date = new Date(dateStr);
    var today = new Date();
    var yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  var generateResponse = async function(userMessage) {
    var systemPrompt = 'You are AquaNova AI, a knowledgeable marine science assistant. Provide helpful, accurate information about ocean temperatures (Arabian Sea: ~28.5C, Bay of Bengal: ~31.2C), marine species (Hilsa, Tuna, Sea Turtles, etc.), ocean alerts and environmental conditions, and oceanographic data and trends. Keep responses concise, informative, and professional. Use bullet points for lists.';
    
    try {
      var messagesPayload = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];
      
      var response = await fetch(API_URL + '/api/nvidia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          temperature: 0.7,
          max_tokens: 512
        })
      });

      if (!response.ok) throw new Error('API error');
      var data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API Error:', error);
      return 'I am having trouble connecting right now. Please try again in a moment.';
    }
  };

  var handleSend = async function() {
    if (!inputMessage.trim() || isTyping) return;

    var userMsg = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(function(prev) { return [...prev, userMsg]; });
    var msgToSend = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    var response = await generateResponse(msgToSend);
    
    setMessages(function(prev) {
      return [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      }];
    });
    
    setIsTyping(false);
    setTimeout(function() {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  var handleKeyDown = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      setTimeout(function() {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  };

  var handleQuickPrompt = async function(text) {
    if (isTyping) return;
    
    var userMsg = {
      id: Date.now(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(function(prev) { return [...prev, userMsg]; });
    setIsTyping(true);

    var response = await generateResponse(text);
    
    setMessages(function(prev) {
      return [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      }];
    });
    
    setIsTyping(false);
    setTimeout(function() {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  var clearChat = function() {
    setMessages([{
      id: Date.now(),
      type: 'bot',
      content: 'Chat cleared. How can I help you today?',
      timestamp: new Date()
    }]);
    setTimeout(function() {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  var formatTime = function(date) {
    if (!date) return '';
    var d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  var renderMessage = function(content) {
    var lines = content.split('\n');
    return lines.map(function(line, i) {
      var isBullet = line.startsWith('- ') || line.startsWith('* ');
      
      if (isBullet) {
        return React.createElement('div', { key: i, className: 'chat-bullet' }, line);
      }
      
      return React.createElement(React.Fragment, { key: i },
        line,
        i < lines.length - 1 ? React.createElement('br') : null
      );
    });
  };

  return (
    <div className={'chatbot-page' + (isDarkMode ? ' dark' : '')}>
      {/* Sidebar Toggle Button - Always visible */}
      <button 
        className={'sidebar-toggle' + (sidebarOpen ? '' : ' closed')}
        onClick={function() { setSidebarOpen(!sidebarOpen); }}
        title={sidebarOpen ? 'Close history' : 'Open history'}
      >
        {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>

      {/* Chat History Sidebar */}
      <aside className={'chat-sidebar' + (sidebarOpen ? ' open' : '')}>
        <div className="sidebar-header">
          <h2><History /> Chat History</h2>
          <button className="new-chat-btn" onClick={startNewChat} title="New Chat">
            <Add />
          </button>
        </div>
        <div className="chat-history-list">
          {chatHistory.length === 0 ? (
            <div className="no-history">No chat history yet</div>
          ) : (
            chatHistory.map(function(chat) {
              return (
                <div 
                  key={chat.id} 
                  className={'history-item' + (chat.id === activeChatId ? ' active' : '')}
                  onClick={function() { loadChat(chat.id); }}
                >
                  <Chat className="history-icon" />
                  <div className="history-content">
                    <span className="history-title">{chat.title}</span>
                    <span className="history-date">{formatChatDate(chat.updatedAt)}</span>
                  </div>
                  <button 
                    className="history-delete" 
                    onClick={function(e) { deleteChat(chat.id, e); }}
                    title="Delete chat"
                  >
                    <DeleteOutline />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="chat-container">
        <header className="chat-header">
          <div className="chat-header-left">
            <button className="mobile-sidebar-toggle" onClick={function() { setSidebarOpen(!sidebarOpen); }}>
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <div className="chat-avatar">
              <SmartToy />
            </div>
            <div className="chat-info">
              <h1>AquaNova AI</h1>
              <span className="chat-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <div className="chat-header-right">
            <button className="chat-action-btn" onClick={clearChat} title="Clear chat">
              <DeleteOutline />
            </button>
          </div>
        </header>

        <main className="chat-main">
          <div className="chat-messages">
            {messages.map(function(msg) {
              return (
                <div key={msg.id} className={'chat-message ' + msg.type}>
                  <div className="message-avatar">
                    {msg.type === 'bot' ? <SmartToy /> : <Person />}
                  </div>
                  <div className="message-body">
                    <div className="message-content">
                      {renderMessage(msg.content)}
                    </div>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="chat-message bot">
                <div className="message-avatar">
                  <SmartToy />
                </div>
                <div className="message-body">
                  <div className="message-content typing">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Always visible recommendations */}
        <div className="quick-prompts">
          <span className="prompts-label">Suggestions:</span>
          {quickPrompts.map(function(prompt, i) {
            return (
              <button
                key={i}
                className="quick-prompt-btn"
                onClick={function() { handleQuickPrompt(prompt.text); }}
                style={{ '--accent': prompt.color }}
                disabled={isTyping}
              >
                {prompt.icon}
                <span>{prompt.text}</span>
              </button>
            );
          })}
        </div>

        <footer className="chat-footer">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={function(e) { setInputMessage(e.target.value); }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about ocean data..."
              rows={1}
              disabled={isTyping}
              autoFocus
            />
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={!inputMessage.trim() || isTyping}
            >
              <Send />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AIChatbot;
