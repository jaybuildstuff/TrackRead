// ====== COPY ALL OF THIS CODE BELOW INTO YOUR `script.js` FILE ON GITHUB ====== //

// ==============================================================================
// // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLgtoSwBc7fXV_krL147GY4iX9vTqP2-g",
  authDomain: "books-d5095.firebaseapp.com",
  projectId: "books-d5095",
  storageBucket: "books-d5095.firebasestorage.app",
  messagingSenderId: "1076318945243",
  appId: "1:1076318945243:web:9cc7fb2aa6e40aab6c71fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//
// You MUST replace this entire block of comments below (from /* to */)
// with the `const firebaseConfig = { ... };` object you copied from the Firebase Console.
//
// It should look something like this AFTER you paste your config:
/*
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "...",
  appId: "1:..."
};
*/
// ==============================================================================

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firestore database
const db = firebase.firestore();

// --- DOM Elements (elements from your HTML) ---
const bookTitleInput = document.getElementById('bookTitle');
const bookAuthorInput = document.getElementById('bookAuthor');
const readerSelect = document.getElementById('readerSelect');
const addBookBtn = document.getElementById('addBookBtn');
const userBooksUl = document.getElementById('userBooks');
const girlfriendBooksUl = document.getElementById('girlfriendBooks');

// --- Functions ---

// Function to add a book to Firestore
addBookBtn.addEventListener('click', async () => {
    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const reader = readerSelect.value; // 'user' or 'girlfriend'

    if (title === '') {
        alert('Book title cannot be empty!');
        return;
    }

    try {
        await db.collection('books').add({
            title: title,
            author: author,
            reader: reader, // 'user' or 'girlfriend'
            status: 'Not Started', // Default status
            createdAt: firebase.firestore.FieldValue.serverTimestamp() // Timestamp for ordering
        });
        console.log('Book added successfully!');
        // Clear inputs
        bookTitleInput.value = '';
        bookAuthorInput.value = '';
        readerSelect.value = 'user'; // Reset to default
    } catch (error) {
        console.error('Error adding book:', error);
        alert('Failed to add book. Check console for details.');
    }
});

// Function to render books to the UL (unordered list)
const renderBook = (doc) => {
    const data = doc.data(); // Get the data from the Firestore document
    const li = document.createElement('li'); // Create a new list item
    li.setAttribute('data-id', doc.id); // Store Firestore document ID on the list item

    let targetUl;
    if (data.reader === 'user') {
        targetUl = userBooksUl; // Add to "My Books" list
    } else {
        targetUl = girlfriendBooksUl; // Add to "My Girlfriend's Books" list
    }

    // Generate the HTML content for the list item
    li.innerHTML = `
        <div class="book-details">
            <div class="book-title">${data.title}</div>
            <div class="book-author">${data.author ? 'by ' + data.author : ''}</div>
        </div>
        <span class="book-status status-${data.status.toLowerCase().replace(/\s/g, '-')}" data-status="${data.status}">
            ${data.status}
        </span>
        <div class="book-actions">
            ${data.status !== 'Reading' ? `<button class="mark-reading">Reading</button>` : ''}
            ${data.status !== 'Finished' ? `<button class="mark-finished">Finished</button>` : ''}
            <button class="remove-book">Remove</button>
        </div>
    `;

    targetUl.appendChild(li); // Add the new list item to the correct list

    // Add event listeners to the buttons within this new list item
    li.querySelector('.mark-reading')?.addEventListener('click', async () => {
        await db.collection('books').doc(doc.id).update({ status: 'Reading' });
    });
    li.querySelector('.mark-finished')?.addEventListener('click', async () => {
        await db.collection('books').doc(doc.id).update({ status: 'Finished' });
    });
    li.querySelector('.remove-book').addEventListener('click', async () => {
        // Confirm before deleting
        if (confirm('Are you sure you want to remove this book?')) {
            await db.collection('books').doc(doc.id).delete();
        }
    });
};

// --- Realtime Listener for Books (Keeps your lists updated automatically) ---
// This listens for any changes in the 'books' collection in Firestore
db.collection('books').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
    // Clear existing lists before re-rendering everything
    userBooksUl.innerHTML = '';
    girlfriendBooksUl.innerHTML = '';

    // Loop through all documents (books) in the snapshot and render them
    snapshot.forEach(doc => {
        renderBook(doc);
    });
}, error => {
    console.error("Error fetching documents: ", error);
    alert("Failed to load books. Please check your internet connection or Firebase setup.");
});

// ====== END OF CODE TO COPY FOR `script.js` ====== //
