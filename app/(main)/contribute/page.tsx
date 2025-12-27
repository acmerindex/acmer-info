'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Spinner } from '@/components/icons';

export default function ContributePage() {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/contribute.md')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to load content');
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setContent('# 加载失败\n\n无法加载贡献指南，请稍后再试。');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container max-w-4xl py-6 lg:py-10 overflow-hidden">
      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Spinner />
          <span className="ml-2 text-muted-foreground">正在加载内容...</span>
        </div>
      ) : (
        <article className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </article>
      )}
    </div>
  );
}
