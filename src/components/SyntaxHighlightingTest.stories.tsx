import type { Meta, StoryObj } from '@storybook/react-vite';
import { SyntaxHighlightingTest } from './SyntaxHighlightingTest';

const meta: Meta<typeof SyntaxHighlightingTest> = {
  title: 'Debug/SyntaxHighlightingTest',
  component: SyntaxHighlightingTest,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
