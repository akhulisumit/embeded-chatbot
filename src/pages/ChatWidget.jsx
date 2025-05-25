import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  RotateCcw
} from "lucide-react";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "👋 Hi there! I'm Aligna, your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const botId = new URLSearchParams(window.location.search).get("botId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [open, isMinimized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { 
      sender: "You", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`https://your-backend.com/api/chat?botId=${botId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        const botReply = { 
          sender: "Bot", 
          text: data.response || "I'm sorry, I couldn't process that request. Please try again.",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, botReply]);
        setIsTyping(false);
      }, 1000);
    } catch (err) {
      setTimeout(() => {
        const errorMsg = { 
          sender: "Bot", 
          text: "🔌 I'm having trouble connecting right now. Please check your internet connection and try again.",
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, errorMsg]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const clearChat = () => {
    setMessages([{
      sender: "Bot",
      text: "👋 Hi there! I'm Aligna, your AI assistant. How can I help you today?",
      timestamp: new Date()
    }]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const TypingIndicator = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-2 px-4 py-3"
    >
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-md">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
        <div className="flex space-x-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? "60px" : "600px"
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="w-96 bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-gray-200/50 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-lg font-semibold">Aligna AI</span>
                  <div className="text-xs opacity-90">Always here to help</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 relative z-10">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  title="Clear chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-grow overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white max-h-96">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className={`flex items-start space-x-3 ${
                        msg.sender === "You" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                        msg.sender === "You" 
                          ? "bg-gradient-to-br from-green-400 to-blue-500" 
                          : "bg-gradient-to-br from-blue-500 to-purple-600"
                      }`}>
                        {msg.sender === "You" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[75%] ${msg.sender === "You" ? "text-right" : "text-left"}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm border text-sm leading-relaxed ${
                          msg.sender === "You"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-200"
                            : "bg-white text-gray-800 border-gray-100"
                        }`}>
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                        <div className={`text-xs text-gray-500 mt-1 px-1 ${
                          msg.sender === "You" ? "text-right" : "text-left"
                        }`}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-4 bg-white border-t border-gray-100">
                  <div className="flex items-center space-x-3 bg-gray-50 rounded-2xl p-2 border border-gray-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200">
                    <input
                      ref={inputRef}
                      className="flex-grow px-3 py-2 bg-transparent focus:outline-none placeholder-gray-500 text-sm"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      disabled={isTyping}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        input.trim() && !isTyping
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    Press Enter to send • Shift+Enter for new line
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          
          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
          
          {/* Notification Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
          />
        </motion.button>
      )}
    </div>
  );
}
