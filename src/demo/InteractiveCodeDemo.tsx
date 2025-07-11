import React, { useState } from 'react';
import { InteractiveCode } from '../components/InteractiveCode';
import type { ComponentLink } from '../types/InteractiveCode.types';

const sampleCode = `import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { UserService } from './services/UserService';

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    UserService.getCurrentUser()
      .then(setUser)
      .catch(console.error);
  }, []);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      
      <Button onClick={handleEditClick}>
        Edit Profile
      </Button>
      
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <h2>Edit User Profile</h2>
      </Modal>
    </div>
  );
};`;

const componentLinks: ComponentLink[] = [
  {
    componentName: 'Button',
    url: '/components/button',
    description: 'Wiederverwendbare Button-Komponente',
    metadata: {
      type: 'component',
      filePath: './components/Button.tsx',
      docsUrl: '/docs/components/button'
    }
  },
  {
    componentName: 'Modal',
    url: '/components/modal',
    description: 'Modal-Dialog-Komponente',
    metadata: {
      type: 'component',
      filePath: './components/Modal.tsx',
      docsUrl: '/docs/components/modal'
    }
  },
  {
    componentName: 'UserService',
    url: '/services/user-service',
    description: 'Service für User-API-Calls',
    metadata: {
      type: 'service',
      filePath: './services/UserService.ts',
      docsUrl: '/docs/services/user-service'
    }
  },
  {
    componentName: 'useState',
    url: 'https://react.dev/reference/react/useState',
    description: 'React useState Hook',
    metadata: {
      type: 'hook',
      docsUrl: 'https://react.dev/reference/react/useState'
    }
  },
  {
    componentName: 'useEffect',
    url: 'https://react.dev/reference/react/useEffect',
    description: 'React useEffect Hook',
    metadata: {
      type: 'hook',
      docsUrl: 'https://react.dev/reference/react/useEffect'
    }
  }
];

export const InteractiveCodeDemo: React.FC = () => {
  const [showAutoDetect, setShowAutoDetect] = useState(false);

  const handleComponentClick = (link: ComponentLink) => {
    alert(`Clicked on: ${link.componentName}\nType: ${link.metadata?.type}\nURL: ${link.url}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>InteractiveCode Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Beispiel mit vordefinierten Links</h2>
        <p>
          Diese InteractiveCode-Komponente zeigt React-Code mit klickbaren Komponenten-Links.
          Klicken Sie auf die farbig markierten Komponenten-Namen!
        </p>
        
        <InteractiveCode
          code={sampleCode}
          language="tsx"
          componentLinks={componentLinks}
          onComponentClick={handleComponentClick}
          showLineNumbers={true}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={showAutoDetect}
            onChange={(e) => setShowAutoDetect(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Auto-Detect Modus anzeigen (ohne vordefinierte Links)
        </label>
      </div>

      {showAutoDetect && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Auto-Detect Modus</h2>
          <p>
            In diesem Modus erkennt die Komponente automatisch potenzielle Komponenten-Namen.
          </p>
          
          <InteractiveCode
            code={sampleCode}
            language="tsx"
            componentLinks={[]} // Keine vordefinierten Links
            onComponentClick={handleComponentClick}
            showLineNumbers={true}
          />
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>Einfaches JavaScript Beispiel</h2>
        
        <InteractiveCode
          code={`function calculateSum(a, b) {
  const result = a + b;
  console.log('Result:', result);
  return result;
}

const myCalculator = new Calculator();
const total = calculateSum(5, 3);`}
          language="javascript"
          componentLinks={[
            {
              componentName: 'Calculator',
              url: '/utils/calculator',
              description: 'Calculator utility class'
            }
          ]}
          onComponentClick={handleComponentClick}
          showLineNumbers={true}
        />
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Features der InteractiveCode-Komponente:</h3>
        <ul>
          <li>✅ Syntax-Highlighting mit react-syntax-highlighter</li>
          <li>✅ Klickbare Komponenten-Namen mit Custom-Links</li>
          <li>✅ Auto-Detection von Komponenten-Namen</li>
          <li>✅ Responsive Design</li>
          <li>✅ Accessibility-Support (Tastaturnavigation)</li>
          <li>✅ TypeScript-Support</li>
          <li>✅ Anpassbare Themes</li>
          <li>✅ Zeilennummern optional</li>
        </ul>
      </div>
    </div>
  );
};
