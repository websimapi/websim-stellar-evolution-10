export function GameDisplay({ messages, isLoading }) {
  // Create a ref for auto-scrolling
  const messagesEndRef = React.useRef(null);
  
  // Auto-scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Message type to CSS class mapping
  const getMessageClass = (type) => {
    const classMap = {
      'EXPLORATION': 'message-exploration',
      'RESEARCH': 'message-research',
      'CONSTRUCTION': 'message-success',
      'COLONIZATION': 'message-success',
      'ERROR': 'message-danger',
      'WARNING': 'message-warning',
      'SPECIAL_EVENT': 'message-danger',
      'USER_COMMAND': 'message-user',
    };
    return classMap[type] || '';
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return React.createElement(
    'div',
    { className: 'game-display' },
    React.createElement(
      'div',
      { className: 'game-output' },
      messages.map((message, index) => 
        React.createElement(
          'div',
          { 
            className: `message-container ${getMessageClass(message.type)} ${index === messages.length - 1 ? 'new-message' : ''}`,
            key: index
          },
          React.createElement(
            'div',
            { className: 'message-content' },
            message.content
          ),
          message.detailContent && React.createElement(
            'div',
            { className: 'message-detail' },
            message.detailContent
          ),
          message.imageUrl && React.createElement(
            'img',
            { 
              src: message.imageUrl,
              alt: 'Event visualization',
              className: 'event-image'
            }
          ),
          React.createElement(
            'div',
            { className: 'timestamp' },
            formatTimestamp(message.timestamp)
          )
        )
      ),
      isLoading && React.createElement(
        'div',
        { className: 'loading-indicator' },
        React.createElement(
          'div',
          { className: 'loading-dots' },
          React.createElement('div', { className: 'loading-dot' }),
          React.createElement('div', { className: 'loading-dot' }),
          React.createElement('div', { className: 'loading-dot' })
        )
      ),
      React.createElement('div', { ref: messagesEndRef })
    )
  );
}

