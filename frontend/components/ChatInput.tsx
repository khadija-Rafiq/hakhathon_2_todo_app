// import { FormEvent } from 'react';

// interface ChatInputProps {
//   input: string;
//   handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
//   isLoading: boolean;
// }

// export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="p-4 border-t border-gray-200 flex"
//     >
//       <input
//         value={input}
//         placeholder="Type your message here..."
//         onChange={handleInputChange}
//         className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         disabled={isLoading}
//       />
//       <button
//         type="submit"
//         className={`px-6 py-3 rounded-r-lg text-white ${
//           isLoading
//             ? 'bg-gray-400 cursor-not-allowed'
//             : 'bg-blue-500 hover:bg-blue-600'
//         }`}
//         disabled={isLoading}
//       >
//         {isLoading ? 'Sending...' : 'Send'}
//       </button>
//     </form>
//   );
// }




import { FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  return (
    <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-4">
      <div className="max-w-3xl mx-auto px-6">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 bg-white rounded-2xl border border-gray-200 shadow-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <input
            value={input}
            placeholder="Ask me anything about your todos..."
            onChange={handleInputChange}
            className="flex-1 px-5 py-4 bg-transparent focus:outline-none text-gray-900 placeholder-gray-400 text-sm"
            disabled={isLoading}
            autoFocus
          />
          
          <button
            type="submit"
            className={`mr-2 p-3 rounded-xl transition-all ${
              isLoading || !input.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-md'
            }`}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        <p className="text-xs text-gray-400 text-center mt-3">
          AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}