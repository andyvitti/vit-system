// Firebase configuration placeholder. Replace with your project's values.
const firebaseConfig = window.firebaseConfig || {};

if (!firebase?.apps?.length) {
  if (!Object.keys(firebaseConfig || {}).length) {
    console.warn('[VIT] firebaseConfig is empty; insert your Firebase project settings.');
  }
  firebase.initializeApp(firebaseConfig);
}
