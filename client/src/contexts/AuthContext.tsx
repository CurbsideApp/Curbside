import { createContext, useState, useContext, useEffect } from "react";
import { User as fUser } from '@firebase/auth-types';
import { auth } from '../firebase';
import { AuthContextType } from '../interfaces/AuthContextInterface'


const AuthContext = createContext<any | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: any }) {

  const [currentUser, setCurrentUser] = useState<fUser | null>(); // React.useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  async function signUp(email: string, password: string): Promise<any> {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    return userCredential;
  }

  async function logIn(email: string, password: string): Promise<any> {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    return userCredential;
  }

  async function logOut() {
    await auth.signOut();
    localStorage.removeItem('userToken');
    setCurrentUser(null);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);
    })
    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    signUp,
    logIn,
    logOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
