import { auth } from 'firebase-admin';

const fetch = require('node-fetch');
export const getTestIdToken = async (): Promise<string|undefined> => {
  try {
    const secretUid = process.env.SECRET_UID;
    const customToken = await auth().createCustomToken(secretUid as string);
    const res = await fetch(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({
          token: customToken,
          returnSecureToken: true
        })
      });
    const data: any = await res.json();
    return data.idToken;
  } catch (e) {
    console.log('ERROR', e);
  }
};
