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
  const formError = document.getElementById('form-error');
  formError.textContent = "";
  if (cart.length === 0) {
    formError.textContent = "Votre panier est vide.";
    return;
  }

  const contact = {
    firstName: this.firstName.value.trim(),
    lastName: this.lastName.value.trim(),
    address: this.address.value.trim(),
    city: this.city.value.trim(),
    email: this.email.value.trim()
  };
  const contactFields = ['firstName', 'lastName', 'address', 'city', 'email'];
  if (!contactFields.every(field => typeof contact[field] === 'string' && contact[field].length > 0)) {
    formError.textContent = "Veuillez renseigner tous les champs du formulaire.";
    return;
  }

  const products = cart.map(item => item && item.id);
  if (!Array.isArray(products) || products.length === 0 ||
      !products.every(productId => typeof productId === 'string' && productId.trim().length > 0)) {
    formError.textContent = "Le panier contient un produit invalide.";
    return;
  }

  const category = cart[0].category;
  if (!cart.every(item => item.category === category)) {
    formError.textContent = "Une commande ne peut contenir que des produits d'une même catégorie.";
    return;
  }

  let apiUrl = "";
  if (category === "camera") apiUrl = "http://localhost:3000/api/cameras/order";
  else if (category === "furniture") apiUrl = "http://localhost:3000/api/furniture/order";
  else if (category === "teddy") apiUrl = "http://localhost:3000/api/teddies/order";
  else {
    formError.textContent = "Catégorie inconnue.";
    return;
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contact, products })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error("Erreur lors de la commande.");
    }
    return res.json();
  })
  .then(data => {
    if (typeof data.orderId !== 'string' || !data.orderId) {
      throw new Error("Réponse de commande invalide.");
    }
    localStorage.removeItem('cart');
    window.location.href = `confirmation.html?orderId=${data.orderId}&total=${total.toFixed(2)}`;
  })
  .catch(() => {
    formError.textContent = "Erreur lors de la commande.";
  });
};