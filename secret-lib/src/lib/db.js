import {
  collection, doc, getDoc, getDocs, addDoc, setDoc,
  updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, onSnapshot
} from 'firebase/firestore'
import { db } from './firebase'

// ── USERS ────────────────────────────────────────────────
export const createUserDoc = async (uid, data) => {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    role: 'pending',
    createdAt: serverTimestamp(),
  })
}

export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export const getAllUsers = async () => {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, 'users', uid), {
    role,
    ...(role === 'member' ? { approvedAt: serverTimestamp() } : {})
  })
}

export const deleteUserDoc = async (uid) => {
  await deleteDoc(doc(db, 'users', uid))
}

// ── NICHES ───────────────────────────────────────────────
export const getNiches = async () => {
  const snap = await getDocs(query(collection(db, 'niches'), orderBy('order', 'asc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const subscribeNiches = (callback) => {
  return onSnapshot(
    query(collection(db, 'niches'), orderBy('order', 'asc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export const addNiche = async (data, authorId) => {
  const snap = await getDocs(collection(db, 'niches'))
  const ref = await addDoc(collection(db, 'niches'), {
    ...data,
    order: snap.size,
    createdBy: authorId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const updateNiche = async (id, data) => {
  await updateDoc(doc(db, 'niches', id), data)
}

export const deleteNiche = async (id) => {
  await deleteDoc(doc(db, 'niches', id))
}

// ── CATEGORIES ───────────────────────────────────────────
export const getCategories = async (nicheId) => {
  const snap = await getDocs(
    query(collection(db, 'categories'), where('nicheId', '==', nicheId), orderBy('order', 'asc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const subscribeCategories = (nicheId, callback) => {
  return onSnapshot(
    query(collection(db, 'categories'), where('nicheId', '==', nicheId), orderBy('order', 'asc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export const addCategory = async (data, authorId) => {
  const snap = await getDocs(
    query(collection(db, 'categories'), where('nicheId', '==', data.nicheId))
  )
  const ref = await addDoc(collection(db, 'categories'), {
    ...data,
    order: snap.size,
    createdBy: authorId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const updateCategory = async (id, data) => {
  await updateDoc(doc(db, 'categories', id), data)
}

export const deleteCategory = async (id) => {
  await deleteDoc(doc(db, 'categories', id))
}

// ── ENTRIES ──────────────────────────────────────────────
export const getEntries = async (nicheId) => {
  const snap = await getDocs(
    query(collection(db, 'entries'), where('nicheId', '==', nicheId), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const subscribeEntries = (nicheId, callback) => {
  return onSnapshot(
    query(collection(db, 'entries'), where('nicheId', '==', nicheId), orderBy('createdAt', 'desc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export const getAllEntries = async () => {
  const snap = await getDocs(query(collection(db, 'entries'), orderBy('createdAt', 'desc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const addEntry = async (data, author) => {
  const ref = await addDoc(collection(db, 'entries'), {
    ...data,
    authorId: author.uid,
    authorName: author.displayName || author.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export const updateEntry = async (id, data) => {
  await updateDoc(doc(db, 'entries', id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export const deleteEntry = async (id) => {
  await deleteDoc(doc(db, 'entries', id))
}

// ── TAGS ─────────────────────────────────────────────────
export const getTags = async () => {
  const snap = await getDocs(query(collection(db, 'tags'), orderBy('name', 'asc')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export const subscribeTags = (callback) => {
  return onSnapshot(
    query(collection(db, 'tags'), orderBy('name', 'asc')),
    snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  )
}

export const addTag = async (data, authorId) => {
  const ref = await addDoc(collection(db, 'tags'), {
    ...data,
    createdBy: authorId,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export const updateTag = async (id, data) => {
  await updateDoc(doc(db, 'tags', id), data)
}

export const deleteTag = async (id) => {
  await deleteDoc(doc(db, 'tags', id))
}
