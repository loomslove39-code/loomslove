// ============================================
// LOOMSLOVE - JavaScript Functionality
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCi40X2FQIbJu3pj8xIHiu-ijskoRC0WJs",
    authDomain: "loomslove-f4fb2.firebaseapp.com",
    projectId: "loomslove-f4fb2",
    storageBucket: "loomslove-f4fb2.firebasestorage.app",
    messagingSenderId: "395398649739",
    appId: "1:395398649739:web:c399719cf62c80ef40b018e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // ============================================
    // NEWSLETTER FORM HANDLING
    // ============================================
    const newsletterForm = document.getElementById('newsletterForm');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (emailRegex.test(email)) {
                // Success message
                const button = this.querySelector('.newsletter-button');
                const originalText = button.textContent;

                button.textContent = '✓ Subscribed!';
                button.style.background = '#4CAF50';

                // Reset form
                emailInput.value = '';

                // Reset button after 3 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 3000);

                // In a real application, you would send this data to your backend
                console.log('Newsletter subscription:', email);
            } else {
                // Error handling
                emailInput.style.borderColor = '#ff4444';

                setTimeout(() => {
                    emailInput.style.borderColor = '';
                }, 2000);
            }
        });
    }

    // ============================================
    // PRODUCT CARD INTERACTIONS
    // ============================================
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Add click handler for future e-commerce functionality
        card.addEventListener('click', function () {
            // This would navigate to product detail page in a full e-commerce site
            console.log('Product clicked:', this.querySelector('.product-name').textContent);
        });

        // Add keyboard accessibility
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });

    // ============================================
    // FEATURED COLLECTION INTERACTIONS
    // ============================================
    const featuredItems = document.querySelectorAll('.featured-item');

    featuredItems.forEach(item => {
        item.addEventListener('click', function () {
            const title = this.querySelector('.featured-title');
            if (title) {
                console.log('Collection clicked:', title.textContent);
                // Navigate to collection page or filter products
            }
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                this.click();
            }
        });
    });

    // ============================================
    // DYNAMIC YEAR IN FOOTER
    // ============================================
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.innerHTML = footerText.innerHTML.replace('2026', currentYear);
    }

    // ============================================
    // LOADING ANIMATION ENHANCEMENT
    // ============================================
    // Add a subtle reveal effect when page loads
    document.body.style.opacity = '0';

    window.addEventListener('load', function () {
        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease-in';
            document.body.style.opacity = '1';
        }, 100);
    });

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    // Lazy load images when they come into viewport
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src attribute
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ============================================
    // SIZE SELECTION LOGIC
    // ============================================
    const sizeSelectors = document.querySelectorAll('.size-selector');

    sizeSelectors.forEach(selector => {
        const buttons = selector.querySelectorAll('.size-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                // Prevent event from bubbling up to the product card
                e.stopPropagation();

                // Remove selected class from all buttons in this selector
                buttons.forEach(b => b.classList.remove('selected'));

                // Add selected class to the clicked button
                this.classList.add('selected');
            });
        });

        // Pre-select 'M' size by default for all products
        const defaultSize = selector.querySelector('.size-btn:nth-child(2)');
        if (defaultSize) {
            defaultSize.classList.add('selected');
        }
    });

    console.log('🌟 LoomsLove website loaded successfully!');
});

// ============================================
// E-COMMERCE LOGIC (Cart, Wishlist, WhatsApp)
// ============================================

// WhatsApp Number provided by store owner
const WHATSAPP_NUMBER = "919946470735";

// Cart and Wishlist state
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// DOM Elements
const cartToggle = document.getElementById('cartToggle');
const cartOverlay = document.getElementById('cartOverlay');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalAmt = document.getElementById('cartTotalAmt');
const checkoutWhatsappBtn = document.getElementById('checkoutWhatsappBtn');

// Helper to get selected size
function getSelectedSize(productName) {
    const cards = document.querySelectorAll('.product-card');
    for (let card of cards) {
        if (card.querySelector('.product-name').textContent === productName) {
            const selectedBtn = card.querySelector('.size-btn.selected');
            return selectedBtn ? selectedBtn.textContent : 'M';
        }
    }
    return 'M';
}

// Update Cart UI
function updateCartUI() {
    // Update count badge
    if (cartCount) cartCount.textContent = cart.length;

    // Render items
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            cartTotalAmt.textContent = '₹0';
            checkoutWhatsappBtn.style.display = 'none';
            return;
        }

        let total = 0;
        let html = '';

        cart.forEach((item, index) => {
            total += parseInt(item.price);
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-size">Size: ${item.size}</p>
                        <p class="cart-item-price">₹${item.price}</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${index})">🗑</button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        cartTotalAmt.textContent = '₹' + total;
        checkoutWhatsappBtn.style.display = 'flex';
    }
}

// Add item to cart
window.addToCart = function (name, price, image) {
    const size = getSelectedSize(name);
    cart.push({ name, price, image, size });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();

    // Open sidebar automatically
    if (cartSidebar) {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    }
};

// Remove item from cart
window.removeFromCart = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
};

// Add to wishlist
window.addToWishlist = function (name, price, image) {

    // Check if already in wishlist
    const exists = wishlist.some(item => item.name === name);
    if (!exists) {
        wishlist.push({ name, price, image });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert(`${name} added to Wishlist! ❤`);
    } else {
        alert(`${name} is already in your Wishlist!`);
    }
};

// Direct WhatsApp Buy (Single Product)
window.buyOnWhatsApp = function (name, price) {
    const size = getSelectedSize(name);
    const message = `Hello LoomsLove! 👋\n\nI would like to place an order for:\n\n*Product:* ${name}\n*Size:* ${size}\n*Price:* ₹${price}\n\nPlease let me know how to proceed. Thank you!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
};

// Checkout Entire Cart via WhatsApp
if (checkoutWhatsappBtn) {
    checkoutWhatsappBtn.addEventListener('click', function () {
        if (cart.length === 0) return;

        let message = `Hello LoomsLove! 👋\n\nI would like to place an order for the following items:\n\n`;
        let total = 0;

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n   Size: ${item.size} - ₹${item.price}\n\n`;
            total += parseInt(item.price);
        });

        message += `*Total Order Value: ₹${total}*\n\nPlease let me know how to proceed with payment and delivery details. Thank you!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    });
}

// Sidebar Toggle Listeners
if (cartToggle) {
    cartToggle.addEventListener('click', function (e) {
        e.preventDefault();
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', function () {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', function () {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    fetchAndRenderProducts();
});

// ============================================
// DYNAMIC PRODUCT RENDERING (Firebase)
// ============================================

async function fetchAndRenderProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));

        let products = [];
        querySnapshot.forEach((doc) => {
            products.push({ id: doc.id, ...doc.data() });
        });

        // Fallback dummy data if DB is empty
        if (products.length === 0) {
            products = [
                { id: "1", name: "Linen Summer Top", price: 899, originalPrice: 1499, category: "budget-love", image: "images/product-2.jpg" },
                { id: "2", name: "Wide Leg Trousers", price: 1299, originalPrice: 1999, category: "budget-love", image: "images/product-5.jpg" },
                { id: "3", name: "Cashmere Sweater", price: 1799, originalPrice: null, category: "classic-love", image: "images/product-4.jpg" },
                { id: "4", name: "Floral Maxi Dress", price: 1999, originalPrice: 2499, category: "festive-love", image: "images/product-3.jpg" },
                { id: "5", name: "Silk Evening Dress", price: 2999, originalPrice: null, category: "luxury-love", image: "images/product-1.jpg" },
                { id: "6", name: "Leather Handbag", price: 2499, originalPrice: null, category: "luxury-love", image: "images/product-6.jpg" }
            ];
            console.log("Database empty. Using fallback sample products.");
        }

        // Clear existing hardcoded grid HTML
        ['budget-love', 'classic-love', 'festive-love', 'luxury-love'].forEach(cat => {
            const grid = document.querySelector(`#${cat} .products-grid`);
            if (grid) grid.innerHTML = '';
        });

        // Inject products into correct categories
        products.forEach(p => {
            const grid = document.querySelector(`#${p.category} .products-grid`);
            if (grid) {
                // Determine badge style
                let badgeClass = '';
                let badgeText = '';
                if (p.category === 'budget-love') { badgeClass = 'budget-badge'; badgeText = 'Budget'; }
                if (p.category === 'classic-love') { badgeClass = ''; badgeText = ''; }
                if (p.category === 'festive-love') { badgeClass = 'festive-badge'; badgeText = 'Festive'; }
                if (p.category === 'luxury-love') { badgeClass = 'luxury-badge'; badgeText = 'Luxury'; }

                let badgeHtml = badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : '';

                // Calculate discount if originalPrice exists
                let priceHtml = `<div class="product-price-row"><span class="product-price">₹${p.price}</span></div>`;
                if (p.originalPrice && p.originalPrice > p.price) {
                    const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
                    priceHtml = `
                        <div class="product-price-row">
                            <span class="product-price">₹${p.price}</span>
                            <span class="product-price-original">₹${p.originalPrice}</span>
                            <span class="product-discount">${discount}% OFF</span>
                        </div>
                    `;
                }

                // Make safe strings for onClick functions
                const safeName = p.name.replace(/'/g, "\\'");
                const safeImg = p.image.replace(/'/g, "\\'");

                const html = `
                    <div class="product-card">
                        <div class="product-image-wrapper">
                            <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='images/placeholder.jpg'">
                            ${badgeHtml}
                            <div class="wishlist-btn" onclick="addToWishlist('${safeName}', ${p.price}, '${safeImg}')">❤</div>
                        </div>
                        <div class="product-info">
                            <p class="product-category">${p.category.replace('-', ' ')}</p>
                            <h3 class="product-name">${p.name}</h3>
                            ${priceHtml}
                            <div class="size-selector">
                                <div class="size-btn">S</div>
                                <div class="size-btn selected">M</div>
                                <div class="size-btn">L</div>
                                <div class="size-btn">XL</div>
                            </div>
                            <div class="product-actions">
                                <button class="btn-add-cart" onclick="addToCart('${safeName}', ${p.price}, '${safeImg}')">Add to Cart</button>
                                <button class="btn-buy-whatsapp" onclick="buyOnWhatsApp('${safeName}', ${p.price})">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/></svg> Buy on WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                grid.innerHTML += html;
            }
        });

        // Re-attach size selection event listeners for newly injected HTML
        attachSizeSelectors();

    } catch (error) {
        console.error("Error fetching products from Firebase:", error);
    }
}

// Function to attach click listeners to size buttons (called after dynamic render)
function attachSizeSelectors() {
    const sizeSelectors = document.querySelectorAll('.size-selector');
    sizeSelectors.forEach(selector => {
        const buttons = selector.querySelectorAll('.size-btn');
        buttons.forEach(btn => {
            // Remove old listeners to prevent duplicates if called multiple times
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            newBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                buttons.forEach(b => {
                    const found = b.parentNode ? b : selector.querySelector('.size-btn:nth-child(' + (Array.from(b.parentNode.children).indexOf(b) + 1) + ')');
                    if (found) found.classList.remove('selected');
                });
                this.classList.add('selected');
            });
        });
    });
}
