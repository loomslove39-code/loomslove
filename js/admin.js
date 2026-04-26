import { auth, db } from './firebase-config.js';
import {
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    onAuthStateChanged, signOut, sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { initProducts } from './admin-products.js';
import { initOrders } from './admin-orders.js';

// Toast notification
window.showToast = function (message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
};

// Auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('dashboardScreen').style.display = 'flex';
        document.getElementById('userEmail').textContent = user.email;
        loadDashboard();
        initProducts();
        initOrders();
    } else {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('dashboardScreen').style.display = 'none';
    }
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errEl = document.getElementById('authError');
    errEl.style.display = 'none';
    try {
        await signInWithEmailAndPassword(
            auth,
            document.getElementById('loginEmail').value,
            document.getElementById('loginPassword').value
        );
        showToast('Welcome back!');
    } catch (err) {
        errEl.textContent = err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : err.message;
        errEl.style.display = 'block';
    }
});

// Toggle Password Visibility
document.getElementById('togglePassword').addEventListener('click', function () {
    const pwdInput = document.getElementById('loginPassword');
    const isPwd = pwdInput.type === 'password';
    pwdInput.type = isPwd ? 'text' : 'password';
    this.textContent = isPwd ? '🙈' : '👁️';
});

// Forgot Password
document.getElementById('forgotPasswordBtn').addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        showToast('Please enter your email address first.', 'error');
        return;
    }
    
    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent! Please check your inbox.');
    } catch (err) {
        console.error("Reset error:", err);
        showToast(err.message, 'error');
    }
});



// Logout
document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));



// Sidebar navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`sec-${section}`).classList.add('active');
        document.getElementById('pageTitle').textContent = section.charAt(0).toUpperCase() + section.slice(1);
        document.querySelector('.sidebar').classList.remove('open');
    });
});

// Mobile menu
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('open');
});

// Close modals
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => document.getElementById(btn.dataset.modal).classList.remove('active'));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
});

// Dashboard stats
async function loadDashboard() {
    try {
        const [prodSnap, orderSnap] = await Promise.all([
            getDocs(collection(db, "products")),
            getDocs(collection(db, "orders"))
        ]);

        const products = [];
        prodSnap.forEach(d => products.push(d.data()));
        const orders = [];
        orderSnap.forEach(d => orders.push(d.data()));

        document.getElementById('statProducts').textContent = products.length;
        document.getElementById('statOrders').textContent = orders.length;

        const lowStock = products.filter(p => (p.stock ?? 0) <= 5);
        document.getElementById('statLowStock').textContent = lowStock.length;

        let revenue = 0;
        orders.forEach(o => { if (o.status !== 'cancelled') revenue += (o.total || 0); });
        document.getElementById('statRevenue').textContent = '₹' + revenue.toLocaleString('en-IN');

        const alertsDiv = document.getElementById('lowStockAlerts');
        alertsDiv.innerHTML = lowStock.length > 0
            ? lowStock.map(p => `<div class="alert-item"><span class="alert-name">${p.name}</span><span class="badge badge-warning">${p.stock ?? 0} left</span></div>`).join('')
            : '<p class="empty-msg">All items well stocked ✅</p>';

        const recentDiv = document.getElementById('recentOrders');
        const recent = orders.slice(0, 5);
        recentDiv.innerHTML = recent.length > 0
            ? recent.map(o => `<div class="alert-item"><span class="alert-name">${o.customerName || 'N/A'}</span><span class="badge badge-${o.status}">${o.status}</span></div>`).join('')
            : '<p class="empty-msg">No orders yet</p>';
    } catch (err) {
        console.error("Dashboard error:", err);
    }
}
