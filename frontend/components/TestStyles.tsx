'use client';

export default function TestStyles() {
  return (
    <div className="p-4 bg-blue-100 border-2 border-blue-500 rounded-lg">
      <h2 className="text-xl font-bold text-blue-800">CSS Test Component</h2>
      <p className="text-blue-600 mt-2">If you can see this styled properly, Tailwind CSS is working!</p>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Test Button
        </button>
        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}