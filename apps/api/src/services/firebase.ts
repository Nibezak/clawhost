import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'

let _auth: Auth

function getFirebaseAuth() {
  if (!_auth) {
    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    }
    _auth = getAuth()
  }
  return _auth
}

export { getFirebaseAuth as auth }

export async function verifyToken(token: string) {
  try {
    const decoded = await getFirebaseAuth().verifyIdToken(token)
    return decoded
  } catch {
    return null
  }
}
