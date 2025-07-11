import type { Meta, StoryObj } from '@storybook/react-vite';
import { InteractiveCode } from './InteractiveCode';
import type { ComponentLink } from '../types/InteractiveCode.types';
import './InteractiveCode.css';

const meta: Meta<typeof InteractiveCode> = {
  title: 'Components/InteractiveCode',
  component: InteractiveCode,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
A React component for displaying code with syntax highlighting and clickable component links.

**Features:**
- 🎨 Syntax highlighting with react-syntax-highlighter  
- 🔗 Clickable links to components (auto-detected or manually defined)
- ⌨️ Full keyboard navigation and accessibility support
- 🎯 Auto-detection of React components in code
- 📱 Responsive design with customizable styling
        `,
      },
    },
  },
  argTypes: {
    code: {
      control: 'text',
      description: 'The code to display',
    },
    language: {
      control: 'text',
      description: 'The programming language for syntax highlighting',
    },
    showLineNumbers: {
      control: 'boolean',
      description: 'Should line numbers be displayed?',
    },
    componentLinks: {
      control: 'object',
      description: 'Definition of clickable links (auto-detection used if empty)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
    onComponentClick: {
      action: 'component-clicked',
      description: 'Callback when clicking on a component',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Beispiel-Code-Snippets
const sampleReactCode = `import React from 'react';
import { Button } from './Button';
import { Modal } from './components/Modal';

export const TestComponent = () => {
  return (
    <div>
      <Button onClick={() => alert('Clicked!')}>
        Click me
      </Button>
      <Modal isOpen={true}>
        Hello World
      </Modal>
    </div>
  );
};`;

const sampleTypeScriptCode = `interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}

const userService = new UserService();`;

const sampleJavaScriptCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);

console.log('Fibonacci of 10:', fibonacci(10));
console.log('Doubled numbers:', doubled);`;

// Standard-Links für Demos
const demoLinks: ComponentLink[] = [
  {
    componentName: 'Button',
    url: 'https://react.dev/reference/react-dom/components/button',
    description: 'Standard HTML Button Element',
  },
  {
    componentName: 'Modal',
    url: 'https://react.dev',
    description: 'React Modal Komponente',
  },
];

// **Stories**

export const Default: Story = {
  args: {
    code: sampleReactCode,
    language: 'tsx',
    showLineNumbers: true,
  },
};

export const WithManualLinks: Story = {
  args: {
    code: sampleReactCode,
    language: 'tsx',
    showLineNumbers: true,
    componentLinks: demoLinks,
  },
  parameters: {
    docs: {
      description: {
        story: 'InteractiveCode mit manuell definierten Links. Wenn `componentLinks` gesetzt ist, wird die Auto-Detection deaktiviert.',
      },
    },
  },
};

export const AutoDetectOnly: Story = {
  args: {
    code: sampleReactCode,
    language: 'tsx',
    showLineNumbers: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'InteractiveCode mit automatischer Komponenten-Erkennung. Komponenten wie `Button`, `Modal` und `TestComponent` werden automatisch erkannt.',
      },
    },
  },
};

export const TypeScriptCode: Story = {
  args: {
    code: sampleTypeScriptCode,
    language: 'typescript',
    showLineNumbers: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'TypeScript-Code mit Syntax-Highlighting. Auto-Erkennung findet hier `User` und `UserService` als mögliche Komponenten.',
      },
    },
  },
};

export const JavaScriptCode: Story = {
  args: {
    code: sampleJavaScriptCode,
    language: 'javascript',
    showLineNumbers: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Reiner JavaScript-Code ohne Komponenten-Links.',
      },
    },
  },
};

export const NoLineNumbers: Story = {
  args: {
    code: sampleReactCode,
    language: 'tsx',
    showLineNumbers: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'InteractiveCode ohne Zeilennummern für kompaktere Darstellung.',
      },
    },
  },
};

export const CustomStyling: Story = {
  args: {
    code: sampleReactCode,
    language: 'tsx',
    showLineNumbers: true,
    className: 'custom-code-block',
  },
  parameters: {
    docs: {
      description: {
        story: 'InteractiveCode mit benutzerdefinierten CSS-Klassen für individuelles Styling.',
      },
    },
  },
};

export const LongCode: Story = {
  args: {
    code: `import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { Form } from './components/Form';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { Checkbox } from './components/Checkbox';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  active: boolean;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserSelect = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleUserUpdate = async (updatedUser: UserData) => {
    try {
      await fetch(\`/api/users/\${updatedUser.id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className="user-management">
      <h1>User Management</h1>
      
      {isLoading && <div>Loading users...</div>}
      
      <div className="user-list">
        {users.map(user => (
          <div key={user.id} className="user-item">
            <span>{user.name}</span>
            <span>{user.email}</span>
            <Button onClick={() => handleUserSelect(user)}>
              Edit
            </Button>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        {selectedUser && (
          <Form
            initialData={selectedUser}
            onSubmit={handleUserUpdate}
          >
            <Input 
              name="name" 
              label="Name" 
              required 
            />
            <Input 
              name="email" 
              label="Email" 
              type="email" 
              required 
            />
            <Select 
              name="role" 
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
                { value: 'guest', label: 'Guest' },
              ]}
            />
            <Checkbox 
              name="active" 
              label="Active User" 
            />
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;`,
    language: 'tsx',
    showLineNumbers: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Längerer Code-Block mit vielen automatisch erkannten Komponenten. Zeigt wie die Komponente mit komplexerem Code umgeht.',
      },
    },
  },
};

export const EmptyCode: Story = {
  args: {
    code: '',
    language: 'tsx',
    showLineNumbers: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'InteractiveCode mit leerem Code - zeigt wie die Komponente graceful mit leeren Inhalten umgeht.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    code: sampleReactCode,
    language: 'tsx',
    showLineNumbers: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interaktive Demo - klicke auf die erkannten Komponenten um das `onComponentClick` Event zu sehen.',
      },
    },
  },
};

export const ClickableComponentsDemo: Story = {
  args: {
    code: `import React, { useState } from 'react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';
import { Input } from './components/Input';
import { Card } from './components/Card';

const MyApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card title="Demo App">
      <Input placeholder="Type something..." />
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <p>Hello from Modal!</p>
        <Button variant="secondary">
          Close
        </Button>
      </Modal>
    </Card>
  );
};`,
    language: 'tsx',
    showLineNumbers: true,
    componentLinks: [
      {
        componentName: 'Button',
        url: 'https://mui.com/components/buttons/',
        description: 'Material-UI Button Komponente',
      },
      {
        componentName: 'Modal',
        url: 'https://mui.com/components/modal/',
        description: 'Material-UI Modal Komponente',
      },
      {
        componentName: 'Input',
        url: 'https://mui.com/components/text-fields/',
        description: 'Material-UI Input Komponente',
      },
      {
        componentName: 'Card',
        url: 'https://mui.com/components/card/',
        description: 'Material-UI Card Komponente',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `
**Interaktive Demo der klickbaren Komponenten**

Diese Story zeigt die neue Funktionalität:
- ✨ **Klicke direkt auf Komponenten im Code** (Button, Modal, Input, Card)
- 🎨 **Gestrichelte Unterstreichung** zeigt klickbare Bereiche
- 🔗 **Sofortiger Link-Aufruf** beim Klick
- ⌨️ **Tastaturnavigation** mit Tab, Enter und Space

Versuche auf die verschiedenen Komponenten-Namen im Code zu klicken!
        `,
      },
    },
  },
};
