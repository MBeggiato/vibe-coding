# InteractiveCode Component

A highly customizable React component for displaying code with syntax highlighting and clickable component links.

**Bundle Size:** ~81KB (minified + gzipped ~25KB)

## ✨ Features

- 🎨 **Syntax Highlighting** with optimized `react-syntax-highlighter`
- 🔗 **Clickable Component Links** for navigation to documentation or other pages
- 🔍 **Auto-Detection** of component names in various languages
- 📘 **Full TypeScript Support** with complete type definitions
- ♿ **Accessibility Support** with keyboard navigation
- 🚀 **Optimized Bundle Size** - Only loads needed languages
- 📦 **Tree-shakeable** - Import only what you need

## 🚀 Installation

```bash
npm install @vibe-coding/interactive-code
```

## 🎯 Quick Start

```tsx
import { InteractiveCode } from '@vibe-coding/interactive-code';
// Import CSS (required)
import '@vibe-coding/interactive-code/styles'; Component

A highly customizable React component for displaying code with syntax highlighting and clickable component links.

## ✨ Features

- 🎨 **Syntax Highlighting** with `react-syntax-highlighter`
- 🔗 **Clickable Component Links** for navigation to documentation or other pages
- 🔍 **Auto-Detection** of component names in various languages
- 📘 **Full TypeScript Support** with complete type definitions
- ♿ **Accessibility Support** with keyboard navigation
- � **Storybook Integration** for interactive component development

## 🚀 Installation

```bash
npm install
```

## 🎯 Quick Start

```tsx
import { InteractiveCode } from '@vibe-coding/interactive-code';
// Import CSS (required)
import '@vibe-coding/interactive-code/styles';

const code = `
import React from 'react';
import { Button } from './components/Button';

export const App = () => {
  return <Button>Click me</Button>;
};
`;

function App() {
  return (
    <InteractiveCode 
      code={code}
      language="tsx"
    />
  );
}
```

## 📖 Usage

### With Clickable Links

```tsx
import { InteractiveCode, type ComponentLink } from '@vibe-coding/interactive-code';
import '@vibe-coding/interactive-code/styles';

const componentLinks: ComponentLink[] = [
  {
    componentName: 'Button',
    url: '/components/button',
    description: 'Reusable Button component',
    metadata: {
      type: 'component',
      filePath: './components/Button.tsx',
      docsUrl: '/docs/components/button'
    }
  }
];

function App() {
  const handleComponentClick = (link: ComponentLink) => {
    console.log('Clicked on:', link.componentName);
    // Navigate to component documentation
    window.location.href = link.url;
  };

  return (
    <InteractiveCode 
      code={code}
      language="tsx"
      componentLinks={componentLinks}
      onComponentClick={handleComponentClick}
    />
  );
}
```

### Auto-Detection

When no `componentLinks` are provided, the component automatically detects potential component names:

```tsx
<InteractiveCode 
  code={code}
  language="tsx"
  // No componentLinks = Auto-detection enabled
  onComponentClick={(link) => {
    alert(`Auto-detected: ${link.componentName}`);
  }}
/>
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | - | The code to display (required) |
| `language` | `string` | `'typescript'` | Programming language for syntax highlighting |
| `componentLinks` | `ComponentLink[]` | `[]` | Array of clickable component links |
| `theme` | `any` | `tomorrow` | Theme for syntax highlighting |
| `showLineNumbers` | `boolean` | `true` | Whether to show line numbers |
| `customStyle` | `React.CSSProperties` | `{}` | Custom CSS styles |
| `onComponentClick` | `(link: ComponentLink) => void` | - | Callback when a component is clicked |
| `className` | `string` | `''` | CSS class for additional styling |

### ComponentLink Interface

```typescript
interface ComponentLink {
  componentName: string;        // Component name in the code
  url?: string;                // URL to navigate to
  description?: string;        // Description for tooltip
  metadata?: {
    type?: 'component' | 'hook' | 'util' | 'service' | 'type' | 'other';
    filePath?: string;         // Path to the file
    line?: number;            // Line in the file
    docsUrl?: string;         // Documentation URL
  };
}
```

## 🎨 Styling

The component uses CSS modules and can be customized via CSS variables:

```css
.interactive-code {
  --interactive-code-bg: #2d3748;
  --interactive-code-header-bg: #1a202c;
  --interactive-code-link-color: #38b2ac;
  --interactive-code-link-bg: rgba(56, 178, 172, 0.2);
}
```

### CSS Classes

- `.interactive-code` - Main container
- `.interactive-code__header` - Header with language and link info
- `.interactive-code__content` - Code container
- `.interactive-code__component-link` - Clickable component links
- `.interactive-code--light` - Light theme modifier
- `.interactive-code--dark` - Dark theme modifier

## 🌐 Supported Languages

- `typescript` / `ts`
- `tsx` (TypeScript React)
- `javascript` / `js`
- `jsx` (JavaScript React)
- All languages supported by `react-syntax-highlighter`

## 🧑‍💻 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Storybook

This project uses Storybook for component development and documentation:

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

Open [http://localhost:6006](http://localhost:6006) to view the Storybook.

## 🌏 Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
