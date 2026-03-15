// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCi40X2FQIbJu3pj8xIHiu-ijskoRC0WJs",
    authDomain: "loomslove-f4fb2.firebaseapp.com",
    projectId: "loomslove-f4fb2",
    storageBucket: "loomslove-f4fb2.firebasestorage.app",
    messagingSenderId: "395398649739",
    appId: "1:395398649739:web:c399719cf6c80ef40b018e",
    measurementId: "G-D1HWZ24HGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const addProductForm = document.getElementById('addProductForm');
const pName = document.getElementById('pName');
const pImage = document.getElementById('pImage');
const pCategory = document.getElementById('pCategory');
const pPrice = document.getElementById('pPrice');
const pOriginal = document.getElementById('pOriginal');
const addBtn = document.getElementById('addBtn');
const productTableBody = document.getElementById('productTableBody');

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================

// Check Auth State
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, show dashboard
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        fetchProducts(); // Load products once logged in
    } else {
        // User is signed out, show login
        loginScreen.style.display = 'block';
        dashboardScreen.style.display = 'none';
    }
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';

    try {
        await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    } catch (error) {
        console.error("Login failed:", error.message);
        loginError.style.display = 'block';
        loginError.textContent = "Invalid email or password.";
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// ==========================================
// FIRESTORE CRUD LOGIC (Products)
// ==========================================

// Fetch Products from Firestore
async function fetchProducts() {
    productTableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading products...</td></tr>';

    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        productTableBody.innerHTML = ''; // Clear loading

        if (querySnapshot.empty) {
            productTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center">No products found. Add some above!</td></tr>';
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            renderProductRow(docSnap.id, data);
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        productTableBody.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center">Error loading products: ${error.message}</td></tr>`;
    }
}

// Render a single row in the table
function renderProductRow(id, data) {
    const tr = document.createElement('tr');

    // Determine badge class based on category
    let badgeClass = '';
    let categoryDisplay = data.category;
    if (data.category === 'budget-love') badgeClass = 'badge-budget';
    if (data.category === 'classic-love') badgeClass = 'badge-classic';
    if (data.category === 'festive-love') badgeClass = 'badge-festive';
    if (data.category === 'luxury-love') badgeClass = 'badge-luxury';

    tr.innerHTML = `
        <td><img src="${data.image}" alt="${data.name}" class="product-img-preview" onerror="this.src='images/placeholder.jpg'"></td>
        <td style="font-weight:600">${data.name}</td>
        <td><span class="badge ${badgeClass}">${categoryDisplay.replace('-', ' ')}</span></td>
        <td>₹${data.price}</td>
        <td>
            <button class="btn-danger" data-id="${id}">Delete</button>
        </td>
    `;

    // Setup delete button
    const deleteBtn = tr.querySelector('.btn-danger');
    deleteBtn.addEventListener('click', () => deleteProduct(id, data.name, tr));

    productTableBody.appendChild(tr);
}

// Add New Product
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    addBtn.textContent = 'Adding...';
    addBtn.disabled = true;

    try {
        const productData = {
            name: pName.value.trim(),
            image: pImage.value.trim() || 'images/product-2.jpg',
            category: pCategory.value,
            price: Number(pPrice.value),
            originalPrice: pOriginal.value ? Number(pOriginal.value) : null,
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "products"), productData);

        // Reset form & Refresh table
        addProductForm.reset();
        fetchProducts();
        alert('Product added successfully!');

    } catch (error) {
        console.error("Error adding product: ", error);
        alert('Failed to add product: ' + error.message);
    } finally {
        addBtn.textContent = 'Add to Store';
        addBtn.disabled = false;
    }
});

// Delete Product
async function deleteProduct(id, name, rowElement) {
    if (confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
        try {
            await deleteDoc(doc(db, "products", id));
            rowElement.remove(); // Remove from UI smoothly without reloading everything
        } catch (error) {
            console.error("Error deleting product: ", error);
            alert('Failed to delete product: ' + error.message);
        }
    }
}
