
export function ChatHeader() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 border-b border-gray-200">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Todo Assistant</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your tasks naturally with AI
        </p>
      </div>
    </header>
  );
}