import React, { useMemo, useRef, useEffect, memo, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { InteractiveCodeProps, ComponentLink } from '../types/InteractiveCode.types';
import { CodeParser } from '../utils/CodeParser';
import './InteractiveCode.css';

export const InteractiveCode: React.FC<InteractiveCodeProps> = memo(({
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

  const enhancedLinks = useMemo(() => {
    if (componentLinks.length > 0) {
      return CodeParser.validateLinks(componentLinks);
    }
    return CodeParser.autoDetectComponents(code, language);
  }, [code, language, componentLinks]);

  const componentMap = useMemo(() => {
    const map = new Map();
    enhancedLinks.forEach(link => {
      map.set(link.componentName, link);
    });
    return map;
  }, [enhancedLinks]);

  // Cache compiled regexes for better performance
  const componentRegexes = useMemo(() => {
    const regexMap = new Map();
    enhancedLinks.forEach(link => {
      regexMap.set(link.componentName, new RegExp(`\\b${link.componentName}\\b`, 'g'));
    });
    return regexMap;
  }, [enhancedLinks]);

  // Cache template strings for better performance
  const createClickableSpan = useCallback((componentName: string, description?: string) => {
    const tooltip = description || `Click to navigate to ${componentName}`;
    return `<span class="interactive-code__clickable-component" data-component="${componentName}" data-tooltip="${tooltip}" role="button" tabindex="0" aria-label="${tooltip}">${componentName}</span>`;
  }, []);

  const handleComponentAction = useCallback((link: ComponentLink) => {
    if (onComponentClick) {
      onComponentClick(link);
    } else if (link.url) {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  }, [onComponentClick]);

  useEffect(() => {
    if (!codeRef.current || enhancedLinks.length === 0) return;

    const codeElement = codeRef.current;
    
    // Clear existing clickable elements more efficiently
    const existingClickableElements = codeElement.querySelectorAll('.interactive-code__clickable-component');
    existingClickableElements.forEach(element => {
      const parent = element.parentNode;
      if (parent) {
        const textNode = document.createTextNode(element.textContent || '');
        parent.replaceChild(textNode, element);
        parent.normalize();
      }
    });
    
    // More efficient DOM traversal
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

    const eventListeners: Array<{ element: Element; type: string; handler: EventListener }> = [];

    // Process text nodes with cached regexes
    textNodes.forEach(textNode => {
      const text = textNode.textContent || '';
      if (!text.trim()) return; // Skip empty text nodes
      
      let hasReplacements = false;
      let newContent = text;

      enhancedLinks.forEach(link => {
        const componentName = link.componentName;
        const regex = componentRegexes.get(componentName);
        
        if (regex && regex.test(text)) {
          hasReplacements = true;
          // Reset regex lastIndex for global flag
          regex.lastIndex = 0;
          newContent = newContent.replace(regex, createClickableSpan(componentName, link.description));
        }
      });

      if (hasReplacements) {
        const wrapper = document.createElement('span');
        wrapper.innerHTML = newContent;
        
        const parent = textNode.parentNode;
        if (parent) {
          while (wrapper.firstChild) {
            parent.insertBefore(wrapper.firstChild, textNode);
          }
          if (textNode.parentNode === parent) {
            parent.removeChild(textNode);
          }
        }
      }
    });

    // Add event listeners with delegation pattern for better performance
    const clickableElements = codeElement.querySelectorAll('.interactive-code__clickable-component');
    
    clickableElements.forEach(element => {
      const componentName = element.getAttribute('data-component');
      const link = componentName ? componentMap.get(componentName) : null;
      
      if (link) {
        const handleClick = (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          handleComponentAction(link);
        };

        const handleKeyDown = (e: Event) => {
          const keyEvent = e as KeyboardEvent;
          if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            handleComponentAction(link);
          }
        };

        element.addEventListener('click', handleClick);
        element.addEventListener('keydown', handleKeyDown);
        
        eventListeners.push(
          { element, type: 'click', handler: handleClick },
          { element, type: 'keydown', handler: handleKeyDown }
        );
      }
    });

    return () => {
      eventListeners.forEach(({ element, type, handler }) => {
        element.removeEventListener(type, handler);
      });
    };
  }, [enhancedLinks, componentMap, componentRegexes, createClickableSpan, handleComponentAction]);

  // Memoize the style object to prevent unnecessary re-renders
  const syntaxHighlighterStyle = useMemo(() => ({
    margin: 0,
    borderRadius: '0 0 8px 8px',
    ...customStyle,
  }), [customStyle]);

  const codeTagStyle = useMemo(() => ({
    fontFamily: '"Fira Code", "JetBrains Mono", "Monaco", "Consolas", monospace',
  }), []);

  return (
    <div className={`interactive-code ${className}`}>
      <div className="interactive-code__header">
        <span className="interactive-code__language">{language}</span>
        {enhancedLinks.length > 0 && (
          <span className="interactive-code__links-info">
            {enhancedLinks.length} clickable component{enhancedLinks.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="interactive-code__content" ref={codeRef}>
        <SyntaxHighlighter
          language={language}
          style={theme}
          showLineNumbers={showLineNumbers}
          customStyle={syntaxHighlighterStyle}
          codeTagProps={{ style: codeTagStyle }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
});

export default InteractiveCode;
