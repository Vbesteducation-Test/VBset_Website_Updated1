import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDlKHYnMTKd0Ve52Jhqlp1zyjzigLsuRaI",
    authDomain: "gemini-quiz-61a3f.firebaseapp.com",
    databaseURL: "https://gemini-quiz-61a3f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gemini-quiz-61a3f",
    storageBucket: "gemini-quiz-61a3f.appspot.com",
    messagingSenderId: "327131411339",
    appId: "1:327131411339:web:fbb796df5cd3bfa39b758e",
    measurementId: "G-J3J8ZC9B8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

// Add this function to validate the form data
function validateFormData(email, password) {
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
    }
}

document.getElementById("registration-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    try {
        // Get user input values
        const name = document.getElementById("name").value.trim();
        const education = document.getElementById("education").value.trim();
        const email = document.getElementById("email").value.trim();
        // Create a more secure password
        const password = `${Math.random().toString(36).slice(-8)}Aa1!`; // Random password with special characters

        let school = "";
        let college = "";
        let collegeID = "";

        if (education === "school") {
            school = document.getElementById("school-name").value.trim();
        } else if (education === "college") {
            college = document.getElementById("college-name").value.trim();
            collegeID = document.getElementById("college-id").value.trim();
        }

        // Validate form data
        validateFormData(email, password);

        // Create the authentication user
        console.log("Creating user with email:", email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User created successfully:", userCredential.user.uid);

        // Store additional user data
        const userData = {
            name: name,
            education: education,
            email: email,
            school: school,
            college: college,
            collegeID: collegeID,
            createdAt: new Date().toISOString()
        };

        // Save user data to database
        await set(ref(database, `users/${userCredential.user.uid}`), userData);
        console.log("User data saved to database");

        // Store user ID in localStorage
        localStorage.setItem("userId", userCredential.user.uid);
        
        // Show success message with the generated password
        alert(`✅ Registration successful!\nYour password is: ${password}\nPlease save this password for future logins.`);
        
        // Redirect to quiz page
        window.location.href = "index.html";
    } catch (error) {
        console.error("Registration error:", error);
        let errorMessage = "Registration failed: ";
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage += "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email address.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage += "Email/password accounts are not enabled. Please contact support.";
                break;
            case 'auth/weak-password':
                errorMessage += "Password should be at least 6 characters.";
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    }
});