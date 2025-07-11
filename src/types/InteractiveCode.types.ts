/**
 * Defines a clickable link to a component in code
 */
export interface ComponentLink {
  /** Component name in the code */
  componentName: string;
  /** URL to navigate to */
  url?: string;
  /** Description for tooltip */
  description?: string;
  /** Additional metadata */
  metadata?: {
    /** Component type (e.g. 'component', 'hook', 'util') */
    type?: 'component' | 'hook' | 'util' | 'service' | 'type' | 'other';
    /** File path */
    filePath?: string;
    /** Line in file */
    line?: number;
    /** Documentation URL */
    docsUrl?: string;
  };
}

/**
 * Props for the InteractiveCode component
 */
export interface InteractiveCodeProps {
  /** Code to display */
  code: string;
  /** Programming language for syntax highlighting */
  language?: string;
  /** Array of clickable component links */
  componentLinks?: ComponentLink[];
  /** Theme for syntax highlighting */
  theme?: Record<string, React.CSSProperties>;
  /** Whether to show line numbers */
  showLineNumbers?: boolean;
  /** Custom CSS styles */
  customStyle?: React.CSSProperties;
  /** Callback when component is clicked */
  onComponentClick?: (link: ComponentLink) => void;
  /** CSS class for additional styling */
  className?: string;
  /** Title for the InteractiveCode */
  title?: string;
  /** Whether code should be copyable */
  copyable?: boolean;
  /** Callback for copy action */
  onCopy?: (code: string) => void;
}

export interface InteractiveCodeTheme {
  name: string;
  displayName: string;
  style: Record<string, React.CSSProperties>;
  isDark: boolean;
}

export interface LanguageConfig {
  language: string;
  displayName: string;
  componentPattern?: RegExp;
  extensions: string[];
  defaultLinks?: ComponentLink[];
}

export type ComponentClickHandler = (link: ComponentLink, event: React.MouseEvent) => void;
export type CopyHandler = (code: string, success: boolean) => void;

export type InteractiveCodeVariant = 'default' | 'compact' | 'inline';
export type InteractiveCodeSize = 'small' | 'medium' | 'large';
