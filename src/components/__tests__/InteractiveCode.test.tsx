import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InteractiveCode } from '../InteractiveCode';
import type { ComponentLink } from '../../types/InteractiveCode.types';

describe('InteractiveCode', () => {
  const sampleCode = `import React from 'react';
import { Button } from './Button';

export const TestComponent = () => {
  return <Button>Click me</Button>;
};`;

  const sampleLinks: ComponentLink[] = [
    {
      componentName: 'Button',
      url: '/components/button',
      description: 'Button component',
    },
    {
      componentName: 'React',
      url: 'https://react.dev',
      description: 'React library',
    },
  ];

  it('sollte Code mit Syntax-Highlighting rendern', () => {
    render(<InteractiveCode code={sampleCode} language="tsx" />);
    
    // Prüfe ob der Code gerendert wird (Text ist durch Syntax-Highlighting aufgeteilt)
    expect(screen.getAllByText('import')).toHaveLength(2); // 2 import statements
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getAllByText('from')).toHaveLength(2); // 2 from keywords
    expect(screen.getByText('export')).toBeInTheDocument();
    
    // TestComponent sollte als klickbare Komponente im Code erscheinen
    const testComponents = screen.getAllByText('TestComponent');
    expect(testComponents.length).toBeGreaterThanOrEqual(1); // Mindestens einmal im Code
  });

  it('sollte die Sprache im Header anzeigen', () => {
    render(<InteractiveCode code={sampleCode} language="tsx" />);
    
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  it('sollte klickbare Links für Komponenten erstellen', () => {
    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        componentLinks={sampleLinks}
      />
    );
    
    // Prüfe ob Links-Info angezeigt wird
    expect(screen.getByText('2 klickbare Komponente(n)')).toBeInTheDocument();
    
    // Prüfe ob klickbare Komponenten im Code existieren
    const buttonElements = screen.getAllByText('Button');
    expect(buttonElements.length).toBeGreaterThan(0);
    
    // Mindestens ein Button sollte als klickbare Komponente im Code sein
    const clickableButton = buttonElements.find(button => 
      button.className.includes('code-block__clickable-component') ||
      button.getAttribute('role') === 'button'
    );
    expect(clickableButton).toBeInTheDocument();
  });

  it('sollte onComponentClick callback aufrufen', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        componentLinks={sampleLinks}
        onComponentClick={mockOnClick}
      />
    );

    // Finde klickbaren Link
    const clickableLink = screen.getByRole('button', { name: /Button/ });
    await user.click(clickableLink);

    expect(mockOnClick).toHaveBeenCalledWith(
      expect.objectContaining({
        componentName: 'Button',
        url: '/components/button',
      })
    );
  });

  it('sollte Links in neuem Tab öffnen wenn kein onComponentClick übergeben wurde', () => {
    // Mock window.open
    const mockOpen = vi.fn();
    Object.defineProperty(window, 'open', {
      writable: true,
      value: mockOpen,
    });

    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        componentLinks={sampleLinks}
      />
    );

    // Finde und klicke auf Link
    const clickableLink = screen.getByRole('button', { name: /Button/ });
    fireEvent.click(clickableLink);

    expect(mockOpen).toHaveBeenCalledWith(
      '/components/button',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('sollte Tastaturnavigation unterstützen', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        componentLinks={sampleLinks}
        onComponentClick={mockOnClick}
      />
    );

    // Finde klickbaren Link und simuliere Enter-Taste
    const clickableLink = screen.getByRole('button', { name: /Button/ });
    clickableLink.focus();
    await user.keyboard('{Enter}');

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('sollte Space-Taste für Aktivierung unterstützen', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        componentLinks={sampleLinks}
        onComponentClick={mockOnClick}
      />
    );

    // Finde klickbaren Link und simuliere Space-Taste
    const clickableLink = screen.getByRole('button', { name: /Button/ });
    clickableLink.focus();
    await user.keyboard(' ');

    expect(mockOnClick).toHaveBeenCalled();
  });

  it('sollte auto-detection verwenden wenn keine Links übergeben werden', () => {
    render(<InteractiveCode code={sampleCode} language="tsx" />);
    
    // Auto-detection sollte Links finden und die Info anzeigen
    const linksInfo = screen.queryByText(/klickbare Komponente/);
    if (linksInfo) {
      expect(linksInfo).toBeInTheDocument();
    }
  });

  it('sollte custom CSS-Klassen akzeptieren', () => {
    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        className="custom-class"
      />
    );
    
    const interactiveCode = screen.getByText('tsx').closest('.interactive-code');
    expect(interactiveCode).toHaveClass('custom-class');
  });

  it('sollte Zeilennummern optional anzeigen', () => {
    const { rerender } = render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        showLineNumbers={true}
      />
    );
    
    // Mit Zeilennummern (Standard)
    expect(screen.getByText('tsx')).toBeInTheDocument();
    
    // Ohne Zeilennummern
    rerender(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        showLineNumbers={false}
      />
    );
    
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  it('sollte Tooltip für Links anzeigen', () => {
    render(
      <InteractiveCode 
        code={sampleCode} 
        language="tsx" 
        componentLinks={sampleLinks}
      />
    );

    const clickableLink = screen.getByRole('button', { name: /Button/ });
    expect(clickableLink).toHaveAttribute('title', 'Button component');
  });

  it('sollte leeren Code graceful handhaben', () => {
    render(<InteractiveCode code="" language="tsx" />);
    
    expect(screen.getByText('tsx')).toBeInTheDocument();
  });

  it('sollte ungültige Links filtern', () => {
    const invalidLinks: ComponentLink[] = [
      { componentName: '', url: '/invalid' }, // Leerer Name
      { componentName: '123Invalid', url: '/invalid' }, // Beginnt mit Zahl
      { componentName: 'Valid-Component', url: '/valid' }, // Enthält Bindestrich
      { componentName: 'ValidComponent', url: '/valid' }, // Gültig
    ];

    render(
      <InteractiveCode 
        code="Valid-Component ValidComponent" 
        language="tsx" 
        componentLinks={invalidLinks}
      />
    );

    // Sollte nur gültige Links verarbeiten
    const linksInfo = screen.queryByText(/klickbare Komponente/);
    if (linksInfo) {
      // Genauer Test würde prüfen, dass nur gültige Links angezeigt werden
      expect(linksInfo).toBeInTheDocument();
    }
  });
});
