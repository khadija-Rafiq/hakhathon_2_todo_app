import { Message } from 'ai';
import { Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`mb-4 flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-[75%] text-sm leading-relaxed ${
          isAssistant
            ? 'bg-gray-100 text-gray-900 rounded-bl-none'
            : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        {isLoading && isAssistant && !message.content ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="italic">Thinking…</span>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}
