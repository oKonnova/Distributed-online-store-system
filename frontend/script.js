// === Глобальні змінні ===
const API_TOKEN = window.API_TOKEN || 'my-secret-api-token-2025';
let cart = [];

// === Функції для роботи з продуктами ===
async function loadProducts() {
  const productList = document.getElementById('productList');
  productList.innerHTML = '<p>Loading products...</p>';
  try {
    const response = await fetch('http://localhost:3001/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log('Products loaded:', products);
    productList.innerHTML = '';
    if (products.length === 0) {
      productList.innerHTML = '<p>No products available</p>';
      return;
    }
    products.forEach(product => {
      console.log('Product:', product);
      console.log('Product ID:', product.id, 'Product _id:', product._id);
      const productId = product.id || product._id;
      if (!productId) {
        console.error('Product has no id or _id:', product);
        return;
      }
      const productDiv = document.createElement('div');
      productDiv.className = 'product-item';
      productDiv.innerHTML = `
        <span>${product.name} ($${product.price})</span>
        <button onclick="addToCart('${productId}', '${product.name}', ${product.price})">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    productList.innerHTML = '<p>Error loading products: ' + error.message + '</p>';
  }
}

// === Функції для роботи з кошиком ===
async function addToCart(productId, productName, productPrice) {
  console.log('addToCart called with:', { productId, type: typeof productId }, productName, productPrice);
  const addMessage = document.getElementById('addMessage');
  console.log('API_TOKEN:', API_TOKEN);
  console.log('Authorization header:', `Bearer ${API_TOKEN}`);

  if (!productId || productId === 'undefined') {
    addMessage.textContent = 'Error: Invalid product ID';
    addMessage.style.color = 'red';
    return;
  }

  try {
    const response = await fetch('http://localhost:3002/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({ productId })
    });

    if (response.ok) {
      const result = await response.text();
      addMessage.textContent = result;
      addMessage.style.color = 'green';

      console.log('Current cart:', cart);
      const existingItem = cart.find(item => {
        console.log('Comparing:', { itemId: item.id, type: typeof item.id }, { productId, type: typeof productId });
        return String(item.id) === String(productId);
      });
      if (existingItem) {
        existingItem.quantity += 1;
        console.log('Item found, increasing quantity:', existingItem);
      } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        console.log('New item added:', { id: productId, name: productName, price: productPrice, quantity: 1 });
      }
      console.log('Cart after adding:', cart);
      updateCartDisplay();
    } else {
      const error = await response.text();
      addMessage.textContent = error;
      addMessage.style.color = 'red';
    }
  } catch (error) {
    console.error('Error in addToCart:', error);
    addMessage.textContent = 'Error: ' + error.message;
    addMessage.style.color = 'red';
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
  } else {
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <span>${item.name} ($${item.price}) x ${item.quantity}</span>
        <button class="add-btn" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">+</button>
        <button class="remove-btn" onclick="removeFromCart(${index})">-</button>
      `;
      cartItems.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<strong>Total: $${total}</strong>`;
    cartItems.appendChild(totalDiv);
  }
}

function removeFromCart(index) {
  const item = cart[index];
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCartDisplay();
}

// === Функції для роботи з модальним вікном ===
function showModal(message) {
  const modal = document.getElementById('orderModal');
  const orderMessage = document.getElementById('orderMessage');
  orderMessage.textContent = message;
  modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('orderModal');
  modal.style.display = 'none';
}

// === Функції для оформлення замовлення ===
async function checkout() {
  try {
    const items = cart.map(item => item.id);
    if (items.length === 0) {
      showModal('Your cart is empty!');
      return;
    }

    const response = await fetch('http://localhost:3003/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
    if (!response.ok) throw new Error('Failed to checkout');

    const result = await response.json();
    const orderId = result.orderId;

    const clearCartResponse = await fetch('http://localhost:3002/cart/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    if (!clearCartResponse.ok) throw new Error('Failed to clear cart');

    cart = [];
    updateCartDisplay();
    showModal(`Checkout successful! Your order ID is ${orderId}`);
  } catch (error) {
    console.error('Error during checkout:', error);
    showModal('Error during checkout: ' + error.message);
  }
}

// === Ініціалізація ===
window.onload = () => {
  loadProducts();
  updateCartDisplay();
};