// 🔥 Firebase Configuration (shared by all pages)
const firebaseConfig={apiKey:"AIzaSyCxJ_K3VqK_xG10czTYiVtUDqHs5-mkM34",authDomain:"warehouse-management-sys-fe316.firebaseapp.com",projectId:"warehouse-management-sys-fe316",storageBucket:"warehouse-management-sys-fe316.appspot.com",messagingSenderId:"386376589251",appId:"1:386376589251:web:79ace33d41cbbdd4d92776"};

// 🔥 Init Firebase
firebase.initializeApp(firebaseConfig);

// 🔥 Firestore reference for all pages
const db = firebase.firestore();
