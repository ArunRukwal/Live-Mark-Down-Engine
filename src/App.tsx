/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Maximize2, 
  Minimize2, 
  Settings, 
  Type, 
  Monitor, 
  Moon, 
  Sun, 
  Terminal,
  Download,
  Copy,
  Check,
  PanelLeft,
  Columns
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Theme = 'midnight' | 'paper' | 'mono';
type Layout = 'split' | 'edit' | 'preview';

const STORAGE_KEY = 'syntax-soul-content';

const DEFAULT_MARKDOWN = `# Syntax & Soul — The MD Engine ✍️

Welcome to a professional-grade Markdown environment. This engine supports **GitHub Flavored Markdown** (GFM) and high-performance real-time rendering.

## 1. Text Formatting
Standard typography is clean and balanced. 
- **Bold text** with \`**\` or *Italic text* with \`*\`.
- ~~Strikethrough~~ for deletions.
- \`Inline code\` for technical snippets.
- [External links](https://google.com) look great.

## 2. Lists & Tasks
Organize your thoughts with nested structures:
- [x] Implement real-time preview
- [x] Configure GFM support
- [ ] Add PDF export module
  - [ ] Research libraries
  - [ ] Prototype renderer

1. First priority
2. Second priority
   - A sub-item
   - Another sub-item

## 3. Technical Snippets
Automatic syntax highlighting for 100+ languages:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  isPro: boolean;
}

const greet = (u: User) => {
  return \`Welcome back, \${u.name}!\`;
};
\`\`\`

## 4. Structured Data
Clean, responsive tables for your specifications:

| Feature | Support | Performance |
| :--- | :---: | ---: |
| Real-time | Ready | < 1ms |
| GFM | Full | Native |
| Themes | Pro | Dynamic |

> "The best way to predict the future is to write it in Markdown."
> — *Ancient Developer Proverb*

---
*Created by Syntax & Soul // 2024*`;

export default function App() {
  const [content, setContent] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_MARKDOWN);
  const [theme, setTheme] = useState<Theme>('midnight');
  const [layout, setLayout] = useState<Layout>('split');
  const [fontSize, setFontSize] = useState(15);
  const [fontFamily, setFontFamily] = useState<'mono' | 'sans' | 'serif'>('mono');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const themes = {
    midnight: {
      bg: 'bg-[#09090b]',
      text: 'text-zinc-100',
      ui: 'bg-[#18181b]',
      border: 'border-[#27272a]',
      accent: 'text-blue-500',
      prism: vscDarkPlus,
      markdown: 'prose-invert prose-zinc'
    },
    paper: {
      bg: 'bg-[#fafafa]',
      text: 'text-zinc-900',
      ui: 'bg-white',
      border: 'border-zinc-200',
      accent: 'text-zinc-900',
      prism: oneLight,
      markdown: 'prose-zinc'
    },
    mono: {
      bg: 'bg-black',
      text: 'text-green-500',
      ui: 'bg-black',
      border: 'border-green-900',
      accent: 'text-green-400',
      prism: vscDarkPlus,
      markdown: 'prose-invert prose-green'
    }
  };

  const activeTheme = themes[theme];

  return (
    <div id="app-root" className={cn("min-h-screen font-sans transition-all duration-500", activeTheme.bg, activeTheme.text)}>
      {/* HEADER / TOOLBAR */}
      <header id="app-header" className={cn("h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-md bg-opacity-80", activeTheme.ui, activeTheme.border)}>
        <div className="flex items-center gap-4">
          <div className={cn("flex items-center gap-2.5 px-3 py-1.5 border rounded-lg font-mono text-xs font-bold uppercase tracking-tighter shadow-sm", activeTheme.border)}>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>Syntax & Soul</span>
          </div>
          <div className="hidden md:flex h-4 w-[1px] bg-zinc-800/50" />
          <p className="hidden md:block text-[10px] uppercase font-bold opacity-40 -mb-0.5 tracking-widest">Draft_01.md</p>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex bg-black/10 p-1 rounded-xl border border-zinc-800/20 mr-2">
             {(['midnight', 'paper'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    theme === t ? "bg-blue-600 text-white shadow-lg" : "opacity-50 hover:opacity-100"
                  )}
                >
                  {t === 'midnight' ? <Moon size={16} /> : <Sun size={16} />}
                </button>
             ))}
          </div>

          <div className="flex items-center gap-1 bg-black/10 p-1 rounded-xl border border-zinc-800/20">
            <button 
              onClick={() => setLayout('edit')}
              className={cn("p-2 rounded-lg transition-all", layout === 'edit' ? "bg-white/10" : "opacity-40")}
              title="Editor Only"
            >
              <PanelLeft size={18} />
            </button>
            <button 
              onClick={() => setLayout('split')}
              className={cn("p-2 rounded-lg transition-all", layout === 'split' ? "bg-white/10" : "opacity-40")}
              title="Split View"
            >
              <Columns size={18} />
            </button>
            <button 
              onClick={() => setLayout('preview')}
              className={cn("p-2 rounded-lg transition-all", layout === 'preview' ? "bg-white/10" : "opacity-40")}
              title="Preview Only"
            >
              <Monitor size={18} />
            </button>
          </div>
          
          <div className="w-4" />
          
          <button 
            onClick={handleCopy}
            className={cn("p-2.5 rounded-xl border transition-all flex items-center gap-2 font-bold text-xs uppercase", activeTheme.border, "hover:bg-blue-600/10")}
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            <span className="hidden sm:inline">Copy</span>
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn("p-2.5 rounded-xl border transition-all", activeTheme.border, "hover:rotate-45")}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main id="app-main" className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* EDITOR PANEL */}
        <motion.div 
          initial={false}
          animate={{ 
            width: layout === 'edit' ? '100%' : layout === 'preview' ? '0%' : '50%',
            opacity: layout === 'preview' ? 0 : 1,
            pointerEvents: layout === 'preview' ? 'none' : 'auto'
          }}
          className={cn(
            "h-full border-r transition-colors duration-500",
            activeTheme.border
          )}
        >
          <textarea
            ref={textareaRef}
            id="markdown-editor"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck={false}
            className={cn(
              "w-full h-full p-10 resize-none bg-transparent outline-none leading-relaxed transition-all",
              fontFamily === 'mono' && "font-mono font-medium",
              fontFamily === 'sans' && "font-sans",
              fontFamily === 'serif' && "font-serif",
              theme === 'mono' ? "selection:bg-green-500/30 text-green-500" : "selection:bg-blue-500/30"
            )}
            style={{ fontSize: `${fontSize}px` }}
            placeholder="Start typing your story in markdown..."
          />
        </motion.div>

        {/* PREVIEW PANEL */}
        <motion.div 
          initial={false}
          animate={{ 
            width: layout === 'preview' ? '100%' : layout === 'edit' ? '0%' : '50%',
            opacity: layout === 'edit' ? 0 : 1,
            pointerEvents: layout === 'edit' ? 'none' : 'auto'
          }}
          className="h-full overflow-y-auto overflow-x-hidden"
        >
          <div id="markdown-preview" className={cn("max-w-4xl mx-auto p-10 sm:p-16 prose prose-sm sm:prose-base lg:prose-lg prose-pre:p-0 transition-opacity duration-300", activeTheme.markdown)}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={activeTheme.prism}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        background: theme === 'paper' ? '#f8f9fa' : '#09090b',
                        padding: '2rem',
                        margin: '1.5rem 0',
                        fontSize: '0.875rem',
                        borderRadius: '12px',
                        border: theme === 'paper' ? '1px solid #e2e8f0' : '1px solid #27272a'
                      }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={cn(className, "bg-zinc-800/10 dark:bg-white/10 px-1.5 py-0.5 rounded-md text-blue-500 font-bold")} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </motion.div>
      </main>

      {/* SETTINGS MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className={cn("fixed right-0 top-14 bottom-0 w-80 border-l shadow-2xl z-40 p-6 flex flex-col gap-8", activeTheme.ui, activeTheme.border)}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase font-mono tracking-widest opacity-50">Configuration</h2>
              <button onClick={() => setIsMenuOpen(false)}><Minimize2 size={16} /></button>
            </div>

            {/* THEME SELECTION */}
            <section className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase flex items-center gap-2">
                <Monitor size={14} /> Appearance
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['midnight', 'paper', 'mono'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "py-3 rounded border text-[10px] uppercase font-bold transition-all",
                      theme === t ? "border-blue-500 bg-blue-500/10" : "border-zinc-800 opacity-60 hover:opacity-100"
                    )}
                  >
                    {t === 'midnight' && <Moon size={14} className="mx-auto mb-1" />}
                    {t === 'paper' && <Sun size={14} className="mx-auto mb-1" />}
                    {t === 'mono' && <Terminal size={14} className="mx-auto mb-1" />}
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {/* FONT FAMILY */}
            <section className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase flex items-center gap-2">
                <Type size={14} /> Typeface
              </label>
              <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                {(['mono', 'sans', 'serif'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFontFamily(f)}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all capitalize",
                      fontFamily === f ? "bg-zinc-800 shadow-sm" : "opacity-40 hover:opacity-100"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            {/* FONT SIZE */}
            <section className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase flex items-center gap-2">
                <Type size={14} /> Font Size: {fontSize}px
              </label>
              <input 
                type="range" 
                min="10" 
                max="24" 
                value={fontSize} 
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] uppercase opacity-50 font-mono">
                <span>Tiny</span>
                <span>Normal</span>
                <span>Large</span>
              </div>
            </section>

            {/* LAYOUT */}
            <section className="flex flex-col gap-4">
              <label className="text-xs font-bold uppercase flex items-center gap-2">
                <Maximize2 size={14} /> Project Layout
              </label>
              <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                {(['edit', 'split', 'preview'] as Layout[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLayout(l)}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all",
                      layout === l ? "bg-zinc-800 shadow-sm" : "opacity-40 hover:opacity-100"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col gap-2">
              <p className="text-[10px] uppercase font-mono opacity-40">System Status</p>
              <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-mono">Real-time sync active</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE TOGGLE FOOTER */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setLayout(layout === 'preview' ? 'edit' : 'preview')}
          className="bg-blue-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl active:scale-95 transition-transform"
        >
          {layout === 'preview' ? <PanelLeft size={20} /> : <Monitor size={20} />}
          <span className="font-bold text-sm">{layout === 'preview' ? 'Edit' : 'View'}</span>
        </button>
      </div>

      <style>{`
        /* Custom Scrollbar for a technical look */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
        
        /* Typography overrides for technical detail */
        .prose code {
          background: rgba(0,0,0,0.1);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-weight: 500;
        }
        .prose pre {
          border: 1px solid rgba(255,255,255,0.1);
          background: #0f0f0f !important;
        }
        
        /* GFM Task List Styling */
        .prose ul li input[type="checkbox"] {
          margin-right: 0.75rem;
          accent-color: #3b82f6;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
