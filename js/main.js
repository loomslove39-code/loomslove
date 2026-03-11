// ============================================
// LOOMSLOVE - JavaScript Functionality
// ============================================

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
document.addEventListener('DOMContentLoaded', updateCartUI);
