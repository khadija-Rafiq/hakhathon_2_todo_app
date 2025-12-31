// 'use client';

// import { useEffect, useState } from 'react';
// import { ChatInterface } from '@/components/ChatInterface';
// import { useRouter } from 'next/navigation';
// import { getToken, getUser } from '@/lib/auth';

// export default function ChatPage() {
//   const [userId, setUserId] = useState<string | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Check if user is authenticated
//     const user = getUser();
//     const token = getToken();
    
//     if (!user || !token) {
//       router.push('/login');
//       return;
//     }

//     setUserId(user.id);
//     setToken(token);
//   }, [router]);

//   if (!userId || !token) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="h-screen flex flex-col">
//       <ChatInterface userId={userId} token={token} />
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { useRouter } from 'next/navigation';
import { getToken, getUser } from '@/lib/auth';

export default function ChatPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const user = getUser();
    const token = getToken();
    
    if (!user || !token) {
      router.push('/login');
      return;
    }

    setUserId(user.id);
    setToken(token);
  }, [router]);

  // Function to handle close - goes back to previous page
  const handleClose = () => {
    router.back(); // Ya router.push('/tasks') - jahan bhi jana ho
  };

  if (!userId || !token) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatInterface 
        userId={userId} 
        token={token}
        onClose={handleClose}  // ✅ X button ko enable karta hai
      />
    </div>
  );
}