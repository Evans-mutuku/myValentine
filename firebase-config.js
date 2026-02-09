// TODO: Replace with your actual Firebase project configuration
// You can get these details from the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: "AIzaSyBjRddKP7qmcLp5tH-VXlVSwq2xSljvido",
  authDomain: "auth-upload-32044.firebaseapp.com",
  databaseURL: "https://auth-upload-32044-default-rtdb.firebaseio.com",
  projectId: "auth-upload-32044",
  storageBucket: "auth-upload-32044.appspot.com",
  messagingSenderId: "295248225975",
  appId: "1:295248225975:web:2ba19fd0795b174ce18f32",
  measurementId: "G-ML2Z15NDFT"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized (placeholder config)");
} catch (e) {
  console.warn("Firebase initialization failed (likely due to placeholder config).", e);
}
