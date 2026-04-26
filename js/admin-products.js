import { db, IMGBB_API_KEY } from './firebase-config.js';
import {
    collection, addDoc, getDocs, updateDoc, deleteDoc, doc,
    serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

let allProducts = [];

export function initProducts() {
    document.getElementById('addProductBtn').addEventListener('click', openAddProduct);
    document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
    document.getElementById('productSearch').addEventListener('input', searchProducts);

    const fileInput = document.getElementById('pImageFile');
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const preview = document.getElementById('imagePreview');
            preview.src = URL.createObjectURL(file);
            preview.style.display = 'block';
        }
    });
    fetchProducts();
}

export async function fetchProducts() {
    const tbody = document.getElementById('productTableBody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Loading products...</td></tr>';
    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        allProducts = [];
        snap.forEach(d => {
            const data = d.data();
            // Migrate old 'stock' field to inventory if needed
            if (data.stock !== undefined && !data.inventory) {
                data.inventory = { "M": data.stock };
            }
            // Ensure stock is sum of inventory
            if (data.inventory) {
                data.stock = Object.values(data.inventory).reduce((a, b) => a + b, 0);
            }
            allProducts.push({ id: d.id, ...data });
        });
        renderProductTable(allProducts);
    } catch (err) {
        console.error("Fetch products error:", err);
        tbody.innerHTML = `<tr><td colspan="6" class="loading-cell" style="color:var(--danger)">${err.message}</td></tr>`;
    }
}

function renderProductTable(products) {
    const tbody = document.getElementById('productTableBody');
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">No products found. Add some!</td></tr>';
        return;
    }
    tbody.innerHTML = products.map(p => {
        const stock = p.stock ?? 0;
        const stockClass = stock <= 5 ? 'stock-low' : 'stock-ok';
        const badgeMap = { 'budget-love': 'badge-budget', 'classic-love': 'badge-classic', 'festive-love': 'badge-festive', 'luxury-love': 'badge-luxury' };
        return `<tr>
            <td><img src="${p.image}" alt="${p.name}" class="product-img-sm" onerror="this.src='images/placeholder.jpg'"></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="badge ${badgeMap[p.category] || ''}">${(p.category || '').replace('-', ' ')}</span></td>
            <td>₹${p.price}${p.originalPrice ? ` <s style="color:var(--text-muted);font-size:.8rem">₹${p.originalPrice}</s>` : ''}</td>
            <td>
                <div class="stock-control">
                    <button class="stock-btn" onclick="window._updateStock('${p.id}', -1)">−</button>
                    <span class="stock-value ${stockClass}">${stock}</span>
                    <button class="stock-btn" onclick="window._updateStock('${p.id}', 1)">+</button>
                </div>
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-edit" onclick="window._editProduct('${p.id}')">✏️ Edit</button>
                    <button class="action-btn btn-delete" onclick="window._deleteProduct('${p.id}','${p.name.replace(/'/g, "\\'")}')">🗑️</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function openAddProduct() {
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    document.getElementById('productSubmitBtn').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('editProductId').value = '';
    document.getElementById('existingImageUrl').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('pImageFile').required = true;
    document.querySelectorAll('.size-stock-input').forEach(input => {
        input.value = 0;
    });
    document.getElementById('productModal').classList.add('active');
}

window._editProduct = function (id) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    document.getElementById('productSubmitBtn').textContent = 'Save Changes';
    document.getElementById('editProductId').value = id;
    document.getElementById('existingImageUrl').value = p.image || '';
    document.getElementById('pName').value = p.name;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pOriginal').value = p.originalPrice || '';
    document.getElementById('pStock').value = p.stock ?? 0;
    document.getElementById('pImageFile').required = false;
    const preview = document.getElementById('imagePreview');
    preview.src = p.image;
    preview.style.display = 'block';

    const inventory = p.inventory || {};
    document.querySelectorAll('.size-stock-input').forEach(input => {
        const size = input.dataset.size;
        input.value = inventory[size] || 0;
    });

    document.getElementById('productModal').classList.add('active');
};

async function handleProductSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('productSubmitBtn');
    const editId = document.getElementById('editProductId').value;
    btn.disabled = true;
    btn.textContent = 'Uploading...';
    try {
        let imageUrl = document.getElementById('existingImageUrl').value;
        const file = document.getElementById('pImageFile').files[0];
        if (file) {
            imageUrl = await uploadToImgBB(file);
        }
        if (!imageUrl) throw new Error("Please select an image.");

        const data = {
            name: document.getElementById('pName').value.trim(),
            image: imageUrl,
            category: document.getElementById('pCategory').value,
            price: Number(document.getElementById('pPrice').value),
            originalPrice: document.getElementById('pOriginal').value ? Number(document.getElementById('pOriginal').value) : null,
            inventory: {}
        };

        let totalStock = 0;
        document.querySelectorAll('.size-stock-input').forEach(input => {
            const qty = Number(input.value) || 0;
            if (qty > 0) {
                data.inventory[input.dataset.size] = qty;
                totalStock += qty;
            }
        });
        data.stock = totalStock;
        data.sizes = Object.keys(data.inventory); // Keep sizes array for easy filtering if needed

        if (editId) {
            await updateDoc(doc(db, "products", editId), data);
            window.showToast('Product updated!');
        } else {
            data.createdAt = serverTimestamp();
            await addDoc(collection(db, "products"), data);
            window.showToast('Product added!');
        }
        document.getElementById('productModal').classList.remove('active');
        fetchProducts();
    } catch (err) {
        console.error("Product save error:", err);
        window.showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = editId ? 'Save Changes' : 'Add Product';
    }
}

async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.error?.message || "ImgBB upload failed");
    return json.data.url;
}

window._deleteProduct = async function (id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
        await deleteDoc(doc(db, "products", id));
        window.showToast('Product deleted');
        fetchProducts();
    } catch (err) {
        window.showToast('Delete failed: ' + err.message, 'error');
    }
};

window._updateStock = async function (id, delta) {
    const p = allProducts.find(x => x.id === id);
    if (!p) return;
    const newStock = Math.max(0, (p.stock ?? 0) + delta);
    try {
        await updateDoc(doc(db, "products", id), { stock: newStock });
        p.stock = newStock;
        renderProductTable(allProducts);
    } catch (err) {
        window.showToast('Stock update failed', 'error');
    }
};

function searchProducts(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term)
    );
    renderProductTable(filtered);
}
