import React from 'react';
import { InteractiveCode } from './InteractiveCode';

// Test component to debug syntax highlighting
export const SyntaxHighlightingTest: React.FC = () => {
  const testCode = `
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  return (
    <button 
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
`;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Syntax Highlighting Test</h2>
      <InteractiveCode
        code={testCode}
        language="tsx"
        showLineNumbers={true}
      />
    </div>
  );
};

export default SyntaxHighlightingTest;
