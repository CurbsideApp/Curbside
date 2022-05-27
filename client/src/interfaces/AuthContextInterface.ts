import { User as fUser } from '@firebase/auth-types';
import { auth } from '../firebase';

export interface AuthContextType {
  currentUser: User | null;
  auth: typeof auth,
  setCurrentUser: (user: User) => void;
  // sendVerification: (email:string) => Promise<void>,
  signUp: (email: string, password: string) => Promise<{[key:string]: any}>;
  logIn: (email: string, password: string) => Promise<{[key:string]: any}>;
  logOut: () => Promise<void>;
}

export interface User {
  id: string,
  email:string
}