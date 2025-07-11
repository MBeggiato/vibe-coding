import type { ComponentLink, LanguageConfig } from '../types/InteractiveCode.types';

export class CodeParser {
  private static languageConfigs: LanguageConfig[] = [
    {
      language: 'typescript',
      displayName: 'TypeScript',
      componentPattern: /\b([A-Z][a-zA-Z0-9]*(?:Component|Hook|Provider|Context|Service)?)\b/g,
      extensions: ['.ts', '.tsx'],
    },
    {
      language: 'javascript',
      displayName: 'JavaScript',
      componentPattern: /\b([A-Z][a-zA-Z0-9]*(?:Component|Hook|Provider|Context|Service)?)\b/g,
      extensions: ['.js', '.jsx'],
    },
    {
      language: 'tsx',
      displayName: 'TypeScript React',
      componentPattern: /\b([A-Z][a-zA-Z0-9]*(?:Component|Hook|Provider|Context)?)\b/g,
      extensions: ['.tsx'],
    },
    {
      language: 'jsx',
      displayName: 'JavaScript React',
      componentPattern: /\b([A-Z][a-zA-Z0-9]*(?:Component|Hook|Provider|Context)?)\b/g,
      extensions: ['.jsx'],
    },
  ];

  static autoDetectComponents(
    code: string,
    language: string,
    existingLinks: ComponentLink[] = []
  ): ComponentLink[] {
    const config = this.languageConfigs.find(l => l.language === language);
    if (!config || !config.componentPattern) {
      return existingLinks;
    }

    const detectedComponents = new Set<string>();
    const existingComponentNames = new Set(existingLinks.map(link => link.componentName));
    
    let match;
    while ((match = config.componentPattern.exec(code)) !== null) {
      const componentName = match[1];
      
      if (
        !existingComponentNames.has(componentName) &&
        !this.isCommonWord(componentName) &&
        !detectedComponents.has(componentName)
      ) {
        detectedComponents.add(componentName);
      }
    }

    const autoDetectedLinks: ComponentLink[] = Array.from(detectedComponents).map(name => ({
      componentName: name,
      description: `Auto-detected component: ${name}`,
      metadata: {
        type: this.guessComponentType(name),
      }
    }));

    return [...existingLinks, ...autoDetectedLinks];
  }

  static findComponentPositions(code: string, componentName: string): Array<{
    line: number;
    column: number;
    length: number;
  }> {
    const lines = code.split('\n');
    const positions: Array<{ line: number; column: number; length: number }> = [];

    lines.forEach((line, lineIndex) => {
      let startIndex = 0;
      let foundIndex;
      
      while ((foundIndex = line.indexOf(componentName, startIndex)) !== -1) {
        const beforeChar = foundIndex > 0 ? line[foundIndex - 1] : ' ';
        const afterChar = foundIndex + componentName.length < line.length 
          ? line[foundIndex + componentName.length] 
          : ' ';
        
        if (!/[a-zA-Z0-9_]/.test(beforeChar) && !/[a-zA-Z0-9_]/.test(afterChar)) {
          positions.push({
            line: lineIndex + 1,
            column: foundIndex + 1,
            length: componentName.length,
          });
        }
        
        startIndex = foundIndex + 1;
      }
    });

    return positions;
  }

  static createClickableCode(code: string, links: ComponentLink[]): string {
    let result = code;
    
    const sortedLinks = [...links].sort((a, b) => b.componentName.length - a.componentName.length);
    
    sortedLinks.forEach((link, index) => {
      const regex = new RegExp(`\\b${this.escapeRegExp(link.componentName)}\\b`, 'g');
      result = result.replace(regex, (match) => {
        return `<span class="code-component-link" data-link-index="${index}">${match}</span>`;
      });
    });

    return result;
  }

  private static escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private static isCommonWord(word: string): boolean {
    const commonWords = [
      'React', 'Component', 'Props', 'State', 'HTML', 'CSS', 'JS', 'TS',
      'Error', 'Success', 'Warning', 'Info', 'Debug', 'Log', 'Console',
      'Object', 'Array', 'String', 'Number', 'Boolean', 'Function',
      'Promise', 'Async', 'Await', 'Import', 'Export', 'Default',
      'Type', 'Interface', 'Class', 'Extends', 'Implements',
    ];
    
    return commonWords.includes(word) || word.length < 3;
  }

  private static guessComponentType(name: string): NonNullable<ComponentLink['metadata']>['type'] {
    if (name.startsWith('use') && name.length > 3) {
      return 'hook';
    }
    if (name.endsWith('Service') || name.endsWith('API')) {
      return 'service';
    }
    if (name.endsWith('Type') || name.endsWith('Interface')) {
      return 'type';
    }
    if (name.endsWith('Provider') || name.endsWith('Context')) {
      return 'component';
    }
    if (name.endsWith('Util') || name.endsWith('Helper')) {
      return 'util';
    }
    
    return 'component';
  }

  static validateLinks(links: ComponentLink[]): ComponentLink[] {
    return links.filter(link => {
      return (
        link.componentName &&
        link.componentName.trim().length > 0 &&
        /^[a-zA-Z][a-zA-Z0-9_]*$/.test(link.componentName)
      );
    });
  }

  static createStandardLinks(language: string): ComponentLink[] {
    const standardLinks: { [key: string]: ComponentLink[] } = {
      'typescript': [
        {
          componentName: 'React',
          url: 'https://react.dev',
          description: 'React Documentation',
          metadata: { type: 'other', docsUrl: 'https://react.dev' }
        }
      ],
      'tsx': [
        {
          componentName: 'useState',
          url: 'https://react.dev/reference/react/useState',
          description: 'React useState Hook',
          metadata: { type: 'hook', docsUrl: 'https://react.dev/reference/react/useState' }
        },
        {
          componentName: 'useEffect',
          url: 'https://react.dev/reference/react/useEffect',
          description: 'React useEffect Hook',
          metadata: { type: 'hook', docsUrl: 'https://react.dev/reference/react/useEffect' }
        }
      ]
    };

    return standardLinks[language] || [];
  }
}
