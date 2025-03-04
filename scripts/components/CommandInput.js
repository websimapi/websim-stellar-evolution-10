export function CommandInput({ onCommand, isLoading }) {
  const [command, setCommand] = React.useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() && !isLoading) {
      onCommand(command);
      setCommand('');
    }
  };
  
  return React.createElement(
    'div',
    { className: 'command-input-container' },
    React.createElement(
      'form',
      { 
        className: 'command-input-form',
        onSubmit: handleSubmit
      },
      React.createElement(
        'input',
        {
          type: 'text',
          className: 'command-input',
          value: command,
          onChange: (e) => setCommand(e.target.value),
          placeholder: 'Enter your command...',
          disabled: isLoading,
          autoFocus: true
        }
      ),
      React.createElement(
        'button',
        {
          type: 'submit',
          className: 'command-submit',
          disabled: isLoading
        },
        isLoading ? 'Processing...' : 'Send'
      )
    )
  );
}

