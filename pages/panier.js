const cart = JSON.parse(localStorage.getItem('cart')) || [];
let total = 0;
const cartSummary = document.getElementById('cart-summary');
if (cart.length === 0) {
  cartSummary.innerHTML = "<p>Votre panier est vide.</p>";
  document.getElementById('order-form').style.display = "none";
} else {
  cartSummary.innerHTML = cart.map(item => {
    total += item.price / 100;
    return `<div class="cart-item">
      <img src="${item.imageUrl}" alt="${item.name}">
      <div class="cart-item-info">
        <strong>${item.name}</strong><br>
        ${item.option ? `<span>Option : ${item.option}</span><br>` : ""}
        <span>${(item.price / 100).toFixed(2)} €</span>
      </div>
    </div>`;
  }).join('') + `<div class="cart-total">Total : <strong>${total.toFixed(2)} €</strong></div>`;
}

document.getElementById('order-form').onsubmit = function(e) {
  e.preventDefault();
  document.getElementById('form-error').textContent = "";
  if (cart.length === 0) {
    document.getElementById('form-error').textContent = "Votre panier est vide.";
    return;
  }
  const contact = {
    firstName: this.firstName.value.trim(),
    lastName: this.lastName.value.trim(),
    address: this.address.value.trim(),
    city: this.city.value.trim(),
    email: this.email.value.trim()
  };
  const category = cart[0].category;
  let apiUrl = "";
  if (category === "camera") apiUrl = "http://localhost:3000/api/cameras/order";
  else if (category === "furniture") apiUrl = "http://localhost:3000/api/furniture/order";
  else if (category === "teddy") apiUrl = "http://localhost:3000/api/teddies/order";
  else {
    document.getElementById('form-error').textContent = "Catégorie inconnue.";
    return;
  }
  const products = cart.map(item => item.id);
  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact, products })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.removeItem('cart');
    window.location.href = `confirmation.html?orderId=${data.orderId}&total=${total.toFixed(2)}`;
  })
  .catch(() => {
    document.getElementById('form-error').textContent = "Erreur lors de la commande.";
  });
};