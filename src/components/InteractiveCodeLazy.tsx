// Optimierte Version nur mit den benötigten Sprachen
import React, { useMemo, useRef, useEffect, lazy, Suspense } from 'react';
import type { InteractiveCodeProps } from '../types/InteractiveCode.types';
import { CodeParser } from '../utils/CodeParser';
import './InteractiveCode.css';

// Lazy load syntax highlighter nur wenn benötigt
const SyntaxHighlighter = lazy(() => 
  import('react-syntax-highlighter').then(module => ({
    default: module.Prism
  }))
);

// Lazy load theme
const getTheme = () => 
  import('react-syntax-highlighter/dist/esm/styles/prism').then(module => 
    module.tomorrow
  );

/**
 * InteractiveCode-Komponente mit Syntax-Highlighting und klickbaren Komponenten-Links
 * Optimiert für kleinere Bundle-Size durch Lazy Loading
 */
export const InteractiveCode: React.FC<InteractiveCodeProps> = ({
  code,
  language = 'typescript',
  componentLinks = [],
  theme,
  showLineNumbers = true,
  customStyle = {},
  onComponentClick,
  className = '',
}) => {
  const [loadedTheme, setLoadedTheme] = React.useState(theme);

  // Lade Theme lazy wenn nicht bereitgestellt
  React.useEffect(() => {
    if (!theme) {
      getTheme().then(setLoadedTheme);
    }
  }, [theme]);

  // ... rest der Komponente bleibt gleich
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-detect components if no manual links provided
  const finalComponentLinks = useMemo(() => {
    if (componentLinks.length > 0) {
      return componentLinks;
    }
    return CodeParser.autoDetectComponents(code, language);
  }, [code, language, componentLinks]);

  // Add click handlers to detected components
  useEffect(() => {
    if (!containerRef.current || !onComponentClick) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('interactive-code__component-link')) {
        const componentName = target.getAttribute('data-component');
        if (componentName) {
          const link = finalComponentLinks.find(l => l.componentName === componentName);
          if (link) {
            event.preventDefault();
            onComponentClick(link);
          }
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('click', handleClick);
    };
  }, [finalComponentLinks, onComponentClick]);

  // Rest der Implementierung...
  const processCodeWithLinks = (code: string): string => {
    if (finalComponentLinks.length === 0) return code;

    let processedCode = code;
    finalComponentLinks.forEach(link => {
      const regex = new RegExp(`\\b(${link.componentName})\\b`, 'g');
      processedCode = processedCode.replace(
        regex,
        `<span class="interactive-code__component-link" data-component="${link.componentName}" title="${link.description || ''}">${link.componentName}</span>`
      );
    });

    return processedCode;
  };

  const processedCode = processCodeWithLinks(code);

  return (
    <div 
      ref={containerRef}
      className={`interactive-code ${className}`} 
      style={customStyle}
    >
      <div className="interactive-code__header">
        <span className="interactive-code__language">{language}</span>
        {finalComponentLinks.length > 0 && (
          <span className="interactive-code__links-info">
            {finalComponentLinks.length} clickable component{finalComponentLinks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="interactive-code__content">
        <Suspense fallback={<pre className="interactive-code__fallback">{code}</pre>}>
          <SyntaxHighlighter
            language={language}
            style={loadedTheme}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: '16px',
              background: 'transparent',
            }}
            codeTagProps={{
              dangerouslySetInnerHTML: { __html: processedCode }
            }}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default InteractiveCode;
