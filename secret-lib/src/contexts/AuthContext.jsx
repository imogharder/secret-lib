import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut,
  onAuthStateChanged, updateProfile
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { createUserDoc, getUserDoc } from '../lib/db'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)  // Firebase auth user
  const [profile, setProfile] = useState(null)  // Firestore user doc
  const [loading, setLoading] = useState(true)

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const profileDoc = await getUserDoc(firebaseUser.uid)
        // If no profile doc yet, create it (first sign-in)
        if (!profileDoc) {
          await createUserDoc(firebaseUser.uid, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || '',
          })
          setProfile({ role: 'pending', email: firebaseUser.email })
        } else {
          setProfile(profileDoc)
        }
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const refreshProfile = async () => {
    if (user) {
      const profileDoc = await getUserDoc(user.uid)
      setProfile(profileDoc)
    }
  }

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }

  const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  const registerWithEmail = async (email, password, displayName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    return result.user
  }

  const logout = async () => {
    await signOut(auth)
  }

  const isAdmin  = profile?.role === 'admin'
  const isMember = profile?.role === 'member' || profile?.role === 'admin'
  const isPending = profile?.role === 'pending'

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      isAdmin, isMember, isPending,
      loginWithGoogle, loginWithEmail, registerWithEmail,
      logout, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
