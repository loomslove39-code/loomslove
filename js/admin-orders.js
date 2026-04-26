import { db } from './firebase-config.js';
import {
    collection, addDoc, getDocs, updateDoc, deleteDoc, doc,
    serverTimestamp, query, orderBy
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

let allOrders = [];

export function initOrders() {
    document.getElementById('addOrderBtn').addEventListener('click', openAddOrder);
    document.getElementById('orderForm').addEventListener('submit', handleOrderSubmit);
    document.getElementById('orderSearch').addEventListener('input', searchOrders);
    fetchOrders();
}

export async function fetchOrders() {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">Loading orders...</td></tr>';
    try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        allOrders = [];
        snap.forEach(d => allOrders.push({ id: d.id, ...d.data() }));
        renderOrderTable(allOrders);
    } catch (err) {
        console.error("Fetch orders error:", err);
        tbody.innerHTML = `<tr><td colspan="7" class="loading-cell" style="color:var(--danger)">${err.message}</td></tr>`;
    }
}

function renderOrderTable(orders) {
    const tbody = document.getElementById('orderTableBody');
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-cell">No orders yet. Log your first order!</td></tr>';
        return;
    }
    tbody.innerHTML = orders.map((o, i) => {
        const date = o.createdAt?.toDate ? o.createdAt.toDate().toLocaleDateString('en-IN') : 'N/A';
        const orderNum = `#${String(orders.length - i).padStart(4, '0')}`;
        const statusOpts = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        return `<tr>
            <td><strong>${orderNum}</strong></td>
            <td>
                <div><strong>${o.customerName || 'N/A'}</strong></div>
                <div style="font-size:0.8rem;color:var(--text-muted)">${o.phone || ''}</div>
            </td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${(o.items || '').replace(/"/g, '&quot;')}">${o.items || 'N/A'}</td>
            <td><strong>₹${(o.total || 0).toLocaleString()}</strong></td>
            <td>
                <select class="badge badge-${o.status}" onchange="window._updateOrderStatus('${o.id}', this.value)" style="border:none;cursor:pointer;font-family:inherit">
                    ${statusOpts.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                </select>
            </td>
            <td style="font-size:0.85rem">${date}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-edit" onclick="window._editOrder('${o.id}')">✏️</button>
                    <button class="action-btn btn-delete" onclick="window._deleteOrder('${o.id}')">🗑️</button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

function openAddOrder() {
    document.getElementById('orderModalTitle').textContent = 'Log New Order';
    document.getElementById('orderSubmitBtn').textContent = 'Log Order';
    document.getElementById('orderForm').reset();
    document.getElementById('editOrderId').value = '';
    document.getElementById('orderModal').classList.add('active');
}

window._editOrder = function (id) {
    const o = allOrders.find(x => x.id === id);
    if (!o) return;
    document.getElementById('orderModalTitle').textContent = 'Edit Order';
    document.getElementById('orderSubmitBtn').textContent = 'Save Changes';
    document.getElementById('editOrderId').value = id;
    document.getElementById('oCustomer').value = o.customerName || '';
    document.getElementById('oPhone').value = o.phone || '';
    document.getElementById('oItems').value = o.items || '';
    document.getElementById('oTotal').value = o.total || '';
    document.getElementById('oStatus').value = o.status || 'pending';
    document.getElementById('oNotes').value = o.notes || '';
    document.getElementById('orderModal').classList.add('active');
};

async function handleOrderSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('orderSubmitBtn');
    const editId = document.getElementById('editOrderId').value;
    btn.disabled = true;
    try {
        const data = {
            customerName: document.getElementById('oCustomer').value.trim(),
            phone: document.getElementById('oPhone').value.trim(),
            items: document.getElementById('oItems').value.trim(),
            total: Number(document.getElementById('oTotal').value),
            status: document.getElementById('oStatus').value,
            notes: document.getElementById('oNotes').value.trim()
        };
        if (editId) {
            await updateDoc(doc(db, "orders", editId), data);
            window.showToast('Order updated!');
        } else {
            data.createdAt = serverTimestamp();
            await addDoc(collection(db, "orders"), data);
            window.showToast('Order logged!');
        }
        document.getElementById('orderModal').classList.remove('active');
        fetchOrders();
    } catch (err) {
        window.showToast('Error: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = editId ? 'Save Changes' : 'Log Order';
    }
}

window._updateOrderStatus = async function (id, status) {
    try {
        await updateDoc(doc(db, "orders", id), { status });
        const o = allOrders.find(x => x.id === id);
        if (o) o.status = status;
        window.showToast(`Order marked as ${status}`);
    } catch (err) {
        window.showToast('Status update failed', 'error');
    }
};

window._deleteOrder = async function (id) {
    if (!confirm('Delete this order? This cannot be undone.')) return;
    try {
        await deleteDoc(doc(db, "orders", id));
        window.showToast('Order deleted');
        fetchOrders();
    } catch (err) {
        window.showToast('Delete failed: ' + err.message, 'error');
    }
};

function searchOrders(e) {
    const term = e.target.value.toLowerCase();
    const filtered = allOrders.filter(o =>
        (o.customerName || '').toLowerCase().includes(term) ||
        (o.items || '').toLowerCase().includes(term) ||
        (o.status || '').toLowerCase().includes(term)
    );
    renderOrderTable(filtered);
}
