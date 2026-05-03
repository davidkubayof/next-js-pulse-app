import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
// TO DELETE "query|seed|" 
export const config = {
  matcher: ['/((?!api|query|seed|_next/static|_next/image|.*\\.png$).*)'],
};