import React, { useMemo, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { InteractiveCodeProps } from '../types/InteractiveCode.types';
import { CodeParser } from '../utils/CodeParser';
import './InteractiveCode.css';

/**
 * InteractiveCode-Komponente mit Syntax-Highlighting und klickbaren Komponenten-Links
 */
export const InteractiveCode: React.FC<InteractiveCodeProps> = ({
  code,
  language = 'typescript',
  componentLinks = [],
  theme = tomorrow,
  showLineNumbers = true,
  customStyle = {},
  onComponentClick,
  className = '',
}) => {
  const codeRef = useRef<HTMLDivElement>(null);

  // Auto-detect Komponenten falls keine Links übergeben wurden
  const enhancedLinks = useMemo(() => {
    if (componentLinks.length > 0) {
      return CodeParser.validateLinks(componentLinks);
    }
    return CodeParser.autoDetectComponents(code, language);
  }, [code, language, componentLinks]);

  // Erstelle eine Map für schnellen Lookup der Komponenten
  const componentMap = useMemo(() => {
    const map = new Map();
    enhancedLinks.forEach(link => {
      map.set(link.componentName, link);
    });
    return map;
  }, [enhancedLinks]);

  // Post-Processing: Füge Click-Handler zu relevanten Textelementen hinzu
  useEffect(() => {
    if (!codeRef.current || enhancedLinks.length === 0) return;

    const codeElement = codeRef.current;
    
    // Finde alle Textknoten und prüfe sie auf Komponenten-Namen
    const walker = document.createTreeWalker(
      codeElement,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text)) {
      textNodes.push(node);
    }

    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      let hasReplacements = false;
      let newContent = text;

      // Prüfe jeden Komponenten-Namen
      enhancedLinks.forEach(link => {
        const componentName = link.componentName;
        const regex = new RegExp(`\\b${componentName}\\b`, 'g');
        
        if (regex.test(text)) {
          hasReplacements = true;
          newContent = newContent.replace(regex, `<span class="code-block__clickable-component" data-component="${componentName}" role="button" tabindex="0" title="${link.description || `Klicke um zu ${componentName} zu navigieren`}">${componentName}</span>`);
        }
      });

      if (hasReplacements) {
        // Erstelle ein neues Element mit dem verarbeiteten HTML
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newContent;
        
        // Ersetze den Textknoten mit den neuen Elementen
        const parent = textNode.parentNode;
        if (parent) {
          // Füge alle Kinder des Wrappers vor dem Textknoten ein
          while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, textNode);
          }
          // Entferne den ursprünglichen Textknoten
          parent.removeChild(textNode);
        }
      }
    });

    // Füge Event-Listener für alle klickbaren Komponenten hinzu
    const clickableElements = codeElement.querySelectorAll('.code-block__clickable-component');
    
    clickableElements.forEach(element => {
      const componentName = element.getAttribute('data-component');
      const link = componentName ? componentMap.get(componentName) : null;
      
      if (link) {
        const handleClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          if (onComponentClick) {
            onComponentClick(link);
          } else if (link.url) {
            window.open(link.url, '_blank', 'noopener,noreferrer');
          }
        };

        const handleKeyDown = (e: Event) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            if (onComponentClick) {
              onComponentClick(link);
            } else if (link.url) {
              window.open(link.url, '_blank', 'noopener,noreferrer');
            }
          }
        };

        element.addEventListener('click', handleClick);
        element.addEventListener('keydown', handleKeyDown);

        // Cleanup-Funktion
        return () => {
          element.removeEventListener('click', handleClick);
          element.removeEventListener('keydown', handleKeyDown);
        };
      }
    });
  }, [enhancedLinks, componentMap, onComponentClick]);

  return (
    <div className={`code-block ${className}`}>
      <div className="code-block__header">
        <span className="code-block__language">{language}</span>
        {enhancedLinks.length > 0 && (
          <span className="code-block__links-info">
            {enhancedLinks.length} klickbare Komponente(n)
          </span>
        )}
      </div>
      
      <div className="code-block__content" ref={codeRef}>
        <SyntaxHighlighter
          language={language}
          style={theme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            borderRadius: '0 0 8px 8px',
            ...customStyle,
          }}
          codeTagProps={{
            style: {
              fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", "Consolas", monospace',
            }
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default InteractiveCode;
