// filepath: /e:/Mon_Hoc/NC_Khoa_Hoc/Code/App_Hoc_Nhom/FirebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-ye8v7QJmC3kLAIQLpGNNP48CUDZQQFM",
  authDomain: "app-hoc-nhom.firebaseapp.com",
  projectId: "app-hoc-nhom",
  storageBucket: "app-hoc-nhom.appspot.com",
  messagingSenderId: "45281545059",
  appId: "1:45281545059:web:edace200e76939e062a156",
  measurementId: "G-8XECQG39J8",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;