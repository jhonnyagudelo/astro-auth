// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyDtLX4_FgrVSl7URsOWdLD4iQMCzJLbfkY",
	authDomain: "astro-authentication-5f4c9.firebaseapp.com",
	projectId: "astro-authentication-5f4c9",
	storageBucket: "astro-authentication-5f4c9.appspot.com",
	messagingSenderId: "926463330353",
	appId: "1:926463330353:web:8a8daf33109625a891ad10",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const firebase = {
	app,
	auth,
};
