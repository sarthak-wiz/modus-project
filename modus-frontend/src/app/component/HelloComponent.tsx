'use client';

import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';

export default function HelloButton() {
  const { getToken } = useAuth();
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const sayHello = async () => {
    try {
      const token = await getToken();
      
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              sayHello(name: "User")
            }
          `
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      setMessage(data.data.sayHello);
      setError('');
    } catch (err) {
      setError('Failed to fetch message');
      setMessage('');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={sayHello}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Say Hello
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}