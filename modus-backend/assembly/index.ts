import { verifyToken } from '@clerk/clerk-sdk-node';

// Define the context type for auth
export interface AuthContext {
  token: string | null;
  userId: string | null;
}

interface ModusRequest {
  headers: {
    get(name: string): string | null;
  };
}

interface TokenClaims {
  sub: string; // User ID
  email?: string; // Optional email claim
  [key: string]: any; // Additional claims
}

// Auth middleware function
export function createContext(
  options: { req: ModusRequest },
  callback: (context: AuthContext) => void
): void {
  const authHeader = options.req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return callback({ token: null, userId: null }); // Invalid token
  }

  const token = authHeader.split(' ')[1];

  verifyToken(token, { secretKey: "" })
    .then((claims: TokenClaims) => {
      callback({
        token,
        userId: claims.sub || null
      });
    })
    .catch(() => {
      callback({ token: null, userId: null }); // Token verification failed
    });
}

export function sayHello(name: string | null, context: AuthContext): string {
  if (!context.userId) {
    throw new Error('Unauthorized'); // Ensure user is authenticated
  }
  return `Hello, ${name || "World"}!`;
}
