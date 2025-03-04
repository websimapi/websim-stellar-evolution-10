export function Header({ resources }) {
  const resourceIcons = {
    energy: '⚡',
    minerals: '🪨',
    knowledge: '🧠',
    population: '👥'
  };

  const formatNumber = (num) => {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  return React.createElement(
    'div',
    { className: 'header' },
    React.createElement(
      'h1',
      { className: 'header-title' },
      'Stellar Evolution'
    ),
    React.createElement(
      'div',
      { className: 'resources-display' },
      Object.entries(resources).map(([resource, value]) => 
        React.createElement(
          'div',
          { 
            className: 'resource-item',
            key: resource
          },
          React.createElement(
            'span',
            { className: 'resource-icon' },
            resourceIcons[resource] || '📊'
          ),
          React.createElement(
            'span',
            { className: 'resource-value' },
            formatNumber(value)
          )
        )
      )
    )
  );
}

