
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: any;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  let content = '';

  if (message.content) {
    // Case 1: simple text message
    content = message.content;
  } else if (Array.isArray(message.parts)) {
    // Case 2: AI SDK structured message
    content = message.parts
      .map((part: any) => {
        if (part.type === 'text') {
          return part.text || part.content || '';
        }
        if (part.type === 'tool-call') {
          return `[Tool: ${part.toolName}]`;
        }
        if (part.type === 'tool-result') {
          return `[Result from ${part.toolName}]`;
        }
        if (part.type === 'dynamic-tool') {
          return `[Tool: ${part.toolName}]`;
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }


  return (
    <div className={`mb-4 flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
          isAssistant
            ? 'bg-gray-100 text-gray-900 rounded-bl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        {isLoading && isAssistant && !content ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="italic">Thinking…</span>
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
}








