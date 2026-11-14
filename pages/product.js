const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const apiBase = [
  { key: 'camera', url: 'http://localhost:3000/api/cameras/' },
  { key: 'furniture', url: 'http://localhost:3000/api/furniture/' },
  { key: 'teddy', url: 'http://localhost:3000/api/teddies/' }
];

let found = false;

for (const api of apiBase) {
  fetch(api.url + id)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(product => {
      if (found) return; 
      found = true;
      let options = '';
      if (product.lenses) {
        options = `<label for="option">Lentille :</label>
          <select id="option">${product.lenses.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
      } else if (product.varnish) {
        options = `<label for="option">Vernis :</label>
          <select id="option">${product.varnish.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
      } else if (product.colors) {
        options = `<label for="option">Couleur :</label>
          <select id="option">${product.colors.map(opt => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
      }

      document.querySelector('.product-detail').innerHTML = `
        <div class="product-page">
          <img src="${product.imageUrl}" alt="${product.name}" style="max-width:300px;display:block;margin:auto;">
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <p><strong>${(product.price / 100).toFixed(2)} €</strong></p>
          ${options}
          <button id="add-to-cart" style="margin-top:20px;padding:10px 24px;font-size:1em;background:#2d8cf0;color:#fff;border:none;border-radius:6px;cursor:pointer;">Ajouter au panier</button>
        </div>
      `;

      document.querySelector('#add-to-cart').onclick = function() {
        const option = document.querySelector('#option') ? document.querySelector('#option').value : null;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          option: option,
          imageUrl: product.imageUrl,
          category: api.key
        });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Produit ajouté au panier !');
      };
    })
    .catch(() => {
      if (!found && api === apiBase[apiBase.length - 1]) {
        document.getElementById('product-detail').innerHTML = `<p>Produit introuvable.</p>`;
      }
    });
}