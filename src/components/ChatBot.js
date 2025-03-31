import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm the Siddhanath Yoga Parampara chatbot. How can I help you with Gurunath's teachings today?", 
      sender: 'bot' 
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user'
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    
    // In a real implementation, this would call an API to get a response from the chatbot
    // trained on Gurunath's YouTube transcripts
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: "I'm a placeholder response. In the actual implementation, I would be trained on Gurunath's teachings and provide relevant information based on your query.",
        sender: 'bot'
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 1000);
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <div 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="chatbot-icon">
          {isOpen ? '✕' : '💬'}
        </div>
        {!isOpen && <span>Chat with Gurunath AI</span>}
      </div>
      
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Siddhanath Yoga Parampara</h3>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Gurunath's teachings..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
