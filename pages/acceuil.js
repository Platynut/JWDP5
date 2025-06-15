const apiUrls = [
  { url: 'http://localhost:3000/api/cameras', label: 'camera' },
  { url: 'http://localhost:3000/api/furniture', label: 'furniture' },
  { url: 'http://localhost:3000/api/teddies', label: 'teddy' }
];

const container = document.querySelector('.article');

apiUrls.forEach(api => {
  fetch(api.url)
    .then(res => res.json())
    .then(products => {
      const section = document.querySelector(`.${api.label}`);
      section.innerHTML = `<h2>${api.label}</h2>` +
        products.map(product => `
          <div>
            <img src="${product.imageUrl}" alt="${product.name}" width="150">
            <h3>${product.name}</h3>
            <p>${product.price / 100} €</p>
            <a href="product.html?id=${product._id}">Voir le produit</a>
          </div>
        `).join('');
      container.appendChild(section);
    })
    .catch(() => {
      const error = document.createElement('p');
      error.textContent = `Erreur lors du chargement des ${api.label.toLowerCase()}.`;
      container.appendChild(error);
    });
});