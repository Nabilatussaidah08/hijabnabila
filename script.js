// ==========================
//  Product Data
// ==========================
const products = [
    { 
        id: 1, 
        name: "Hijab Pashmina Viscose", 
        price: 60000, 
        desc: "Bahan viscose lembut, tidak menerawang.", 
        badge: "Best Seller",
        img: "pashmina viscode.jpeg"
    },
    { 
        id: 2, 
        name: "Hijab Pashmina Kaos", 
        price: 39899, 
        desc: "Bahan kaos adem dan nyaman dipakai seharian.", 
        badge: "New",
        img: "pashminakaos.jpeg"
    },
    { 
        id: 3, 
        name: "Hijab Paris Premium", 
        price: 23000, 
        desc: "Paris premium anti slip, mudah dibentuk.", 
        badge: null,
        img: "oarispremium.jpeg"
    },
    { 
        id: 4, 
        name: "Hijab Ceruti Babydoll", 
        price: 30000, 
        desc: "Ceruti halus, ringan, dan jatuh sempurna.", 
        badge: "Popular",
        img: "Ceruti Babydoll.jpeg"
    },
    { 
        id: 5, 
        name: "Hijab Bergo Instan", 
        price: 18000, 
        desc: "Maxmara premium, praktis tanpa jarum.", 
        badge: "Premium",
        img: "bergo.jpeg"
    },
    { 
        id: 6, 
        name: "Hijab Segiempat Motif", 
        price: 35000, 
        desc: "Motif eksklusif limited edition.", 
        badge: "Limited",
        img: "segiempatmotif.jpeg"
    }
];

let cart = [];
let shippingCost = 15000;
let orderData = {};

// ==========================
//  Generate Product Cards
// ==========================
function generateProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.img}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">Rp ${product.price.toLocaleString('id-ID')}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">+ Keranjang</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ==========================
//  Add to Cart
// ==========================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
}

// ==========================
//  Update Cart Display
// ==========================
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Keranjang masih kosong</p>';
        cartTotal.textContent = 'Total: Rp 0';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p style="font-size: 0.9rem; color:#666;">Qty: ${item.quantity}</p>
            </div>
            <div style="text-align:right;">
                <strong style="color:#667eea;">Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</strong>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Total: Rp ${total.toLocaleString('id-ID')}`;
}

// ==========================
//  Toggle Cart Modal
// ==========================
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// ==========================
//  Proceed to Checkout
// ==========================
function proceedToCheckout() {
    if (cart.length === 0) return alert('Keranjang belanja Anda masih kosong!');
    toggleCart();
    document.getElementById('checkoutModal').style.display = 'flex';
    updateCheckoutSummary();
}

// ==========================
//  Checkout Summary & Shipping
// ==========================
function updateShipping() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked').value;
    const shippingCosts = { regular:15000, express:25000, instant:35000 };
    shippingCost = shippingCosts[selectedShipping];
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const subtotal = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const total = subtotal + shippingCost;
    document.getElementById('summarySubtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('summaryShipping').textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
    document.getElementById('summaryTotal').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// ==========================
//  Submit Order
// ==========================
function submitOrder(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    const shipping = document.querySelector('input[name="shipping"]:checked').value;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    orderData = {
        orderId: 'EH' + Date.now(),
        name, email, phone, address, shipping, payment,
        items: cart,
        subtotal: cart.reduce((s, i) => s + (i.price * i.quantity), 0),
        shippingCost,
        total: cart.reduce((s, i) => s + (i.price * i.quantity), 0) + shippingCost,
        date: new Date().toLocaleDateString('id-ID')
    };

    document.getElementById('checkoutModal').style.display = 'none';
    showPaymentInstructions(payment);
}

// ==========================
//  Payment Instructions
// ==========================
function showPaymentInstructions(method) {
    const modal = document.getElementById('paymentModal');
    const el = document.getElementById('paymentInstructions');
    let content = '';

    if (method === 'transfer') {
        content = `
        <h4>Transfer Bank</h4>
        <p>Silakan transfer ke salah satu rekening berikut:</p>
        <div class="bank-account"><strong>BCA:</strong> 1234567890 a.n Elegant Hijab</div>
        <div class="bank-account"><strong>Mandiri:</strong> 9876543210 a.n Elegant Hijab</div>
        <p style="margin-top:1rem;"><b>Total:</b> Rp ${orderData.total.toLocaleString('id-ID')}<br>Order ID: ${orderData.orderId}</p>`;
    } else if (method === 'ewallet') {
        content = `
        <h4>E-Wallet</h4>
        <p>Kirim ke salah satu akun berikut:</p>
        <div class="bank-account"><strong>DANA:</strong> 081234567890</div>
        <div class="bank-account"><strong>OVO:</strong> 081234567890</div>
        <div class="bank-account"><strong>GoPay:</strong> 081234567890</div>
        <p style="margin-top:1rem;"><b>Total:</b> Rp ${orderData.total.toLocaleString('id-ID')}<br>Order ID: ${orderData.orderId}</p>`;
    } else {
        content = `
        <h4>Cash on Delivery (COD)</h4>
        <p>Pembayaran dilakukan saat barang diterima.</p>
        <p><b>Total:</b> Rp ${orderData.total.toLocaleString('id-ID')}<br>Order ID: ${orderData.orderId}</p>`;
    }

    el.innerHTML = content;
    modal.style.display = 'flex';
}

// ==========================
//  Confirm Payment
// ==========================
function confirmPayment() {
    document.getElementById('paymentModal').style.display = 'none';
    const modal = document.getElementById('successModal');
    document.getElementById('orderNumber').textContent = orderData.orderId;
    modal.style.display = 'flex';

    const msg = `Halo Elegant Hijab! Saya sudah memesan:\nOrder ID: ${orderData.orderId}\nNama: ${orderData.name}\nTotal: Rp ${orderData.total.toLocaleString('id-ID')}`;
    window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(msg)}`, '_blank');

    cart = [];
    updateCart();
}

// ==========================
//  Show Receipt
// ==========================
function showReceipt() {
    document.getElementById('successModal').style.display = 'none';
    const modal = document.getElementById('receiptModal');
    modal.style.display = 'flex';

    document.getElementById('receiptOrderId').textContent = orderData.orderId;
    document.getElementById('receiptDate').textContent = orderData.date;
    document.getElementById('receiptName').textContent = orderData.name;
    document.getElementById('receiptPhone').textContent = orderData.phone;
    document.getElementById('receiptEmail').textContent = orderData.email;
    document.getElementById('receiptAddress').textContent = orderData.address;

    const paymentMethod = { transfer:"Transfer Bank", ewallet:"E-Wallet", cod:"COD" };
    document.getElementById('receiptPayment').textContent = paymentMethod[orderData.payment];
    const shippingMethod = { regular:"Reguler", express:"Express", instant:"Instant" };
    document.getElementById('receiptShippingMethod').textContent = shippingMethod[orderData.shipping];

    let table = `<tr><th>Produk</th><th>Qty</th><th>Harga</th><th>Subtotal</th></tr>`;
    orderData.items.forEach(i=>{
        table += `<tr>
            <td>${i.name}</td>
            <td>${i.quantity}</td>
            <td>Rp ${i.price.toLocaleString('id-ID')}</td>
            <td>Rp ${(i.price*i.quantity).toLocaleString('id-ID')}</td>
        </tr>`;
    });
    document.getElementById('receiptItemsTable').innerHTML = table;

    document.getElementById('receiptSubtotal').textContent = `Rp ${orderData.subtotal.toLocaleString('id-ID')}`;
    document.getElementById('receiptShipping').textContent = `Rp ${orderData.shippingCost.toLocaleString('id-ID')}`;
    document.getElementById('receiptTotal').textContent = `Rp ${orderData.total.toLocaleString('id-ID')}`;
}

// ==========================
//  Init Page
// ==========================
document.addEventListener('DOMContentLoaded', () => {
    generateProducts();
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click', e=>{
            e.preventDefault();
            const t=document.querySelector(a.getAttribute('href'));
            if(t) t.scrollIntoView({behavior:'smooth'});
        });
    });
});
