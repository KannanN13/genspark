document.addEventListener('DOMContentLoaded', function() {
  // State variables
  let currentPage = 1;
  let itemsPerPage = getItemsPerPage();
  let products = [];
  let filteredProducts = [];
  let sortOption = 'default';
  let filterOptions = {
      category: 'all',
      onSale: false,
      minRating: 0
  };

  // Cache DOM elements
  const productsContainer = document.getElementById('product-container');
  const productModal = new bootstrap.Modal(document.getElementById('productModal'));
  const productDetailContent = document.getElementById('productDetailContent');

  // Determine items per page based on screen size
  function getItemsPerPage() {
      if (window.innerWidth < 576) return 4;
      if (window.innerWidth < 992) return 6;
      return 8;
  }

  // Fetch products from API
  async function fetchProducts() {
      try {
          const response = await fetch('https://dummyjson.com/products');
          const data = await response.json();
          products = data.products;
          filteredProducts = [...products];
          updateProducts();
      } catch (error) {
          console.error('Error fetching products:', error);
          productsContainer.innerHTML = '<div class="col-12 text-center my-5"><h3>Failed to load products</h3></div>';
      }
  }

  // Create UI elements
  function createUIElements() {
      const headerSection = document.querySelector('header');
      const controlsContainer = document.createElement('div');
      controlsContainer.className = 'container px-4 px-lg-5 py-4 bg-light';
      controlsContainer.innerHTML = `
          <div class="row gx-2 gx-lg-5 align-items-center">
              <div class="col-12 col-md-6 col-lg-4 mb-3 mb-md-0">
                  <div class="input-group">
                      <input type="text" id="searchInput" class="form-control" placeholder="Search products...">
                      <button class="btn btn-outline-dark" id="searchBtn">
                          <i class="bi bi-search"></i>
                      </button>
                  </div>
              </div>
              <div class="col-6 col-md-3 col-lg-2 mb-3 mb-md-0">
                  <select id="sortSelect" class="form-select form-select-sm">
                      <option value="default">Sort: Default</option>
                      <option value="priceLow">Price: Low-High</option>
                      <option value="priceHigh">Price: High-Low</option>
                      <option value="nameAZ">Name: A-Z</option>
                      <option value="nameZA">Name: Z-A</option>
                  </select>
              </div>
              <div class="col-6 col-md-3 col-lg-2 mb-3 mb-md-0">
                  <select id="categoryFilter" class="form-select form-select-sm">
                      <option value="all">All Categories</option>
                      <option value="beauty">Beauty</option>
                      <option value="smartphones">Smartphones</option>
                      <option value="laptops">Laptops</option>
                      <option value="fragrances">Fragrances</option>
                  </select>
              </div>
              <div class="col-6 col-md-4 col-lg-2 mb-3 mb-md-0 d-flex align-items-center">
                  <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="saleFilter">
                      <label class="form-check-label" for="saleFilter">On Sale</label>
                  </div>
              </div>
              <div class="col-6 col-md-4 col-lg-2 d-flex align-items-center">
                  <select id="ratingFilter" class="form-select form-select-sm">
                      <option value="0">All Ratings</option>
                      <option value="1">★+</option>
                      <option value="2">★★+</option>
                      <option value="3">★★★+</option>
                      <option value="4">★★★★+</option>
                      <option value="5">★★★★★</option>
                  </select>
              </div>
          </div>
      `;
      
      headerSection.after(controlsContainer);
      
      const sectionElement = document.querySelector('section');
      const paginationContainer = document.createElement('div');
      paginationContainer.className = 'container px-4 px-lg-5 mt-3 mb-5';
      paginationContainer.innerHTML = `
          <div class="row">
              <div class="col-12">
                  <nav aria-label="Product pagination">
                      <ul id="pagination" class="pagination pagination-sm justify-content-center flex-wrap"></ul>
                  </nav>
              </div>
          </div>
      `;
      
      sectionElement.appendChild(paginationContainer);
  }

  // Initialize event listeners
  function initEventListeners() {
      document.getElementById('searchBtn').addEventListener('click', searchProducts);
      document.getElementById('searchInput').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') searchProducts();
      });
      
      document.getElementById('sortSelect').addEventListener('change', (e) => {
          sortOption = e.target.value;
          currentPage = 1;
          updateProducts();
      });
      
      document.getElementById('categoryFilter').addEventListener('change', (e) => {
          filterOptions.category = e.target.value;
          currentPage = 1;
          updateProducts();
      });
      
      document.getElementById('saleFilter').addEventListener('change', (e) => {
          filterOptions.onSale = e.target.checked;
          currentPage = 1;
          updateProducts();
      });
      
      document.getElementById('ratingFilter').addEventListener('change', (e) => {
          filterOptions.minRating = parseInt(e.target.value);
          currentPage = 1;
          updateProducts();
      });

      window.addEventListener('resize', () => {
          const newItemsPerPage = getItemsPerPage();
          if (newItemsPerPage !== itemsPerPage) {
              itemsPerPage = newItemsPerPage;
              currentPage = 1;
              updateProducts();
          }
      });
  }

  // Search products using API
  async function searchProducts() {
      const searchTerm = document.getElementById('searchInput').value.trim();
      try {
          if (searchTerm === '') {
              filteredProducts = [...products];
          } else {
              const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`);
              const data = await response.json();
              filteredProducts = data.products;
          }
          currentPage = 1;
          updateProducts();
      } catch (error) {
          console.error('Error searching products:', error);
          productsContainer.innerHTML = '<div class="col-12 text-center my-5"><h3>Search failed</h3></div>';
      }
  }

  // Apply filters
  function applyFilters() {
      filteredProducts = products.filter(product => {
          const categoryMatch = filterOptions.category === 'all' || product.category === filterOptions.category;
          const saleMatch = !filterOptions.onSale || product.discountPercentage > 0;
          const ratingMatch = product.rating >= filterOptions.minRating;
          return categoryMatch && saleMatch && ratingMatch;
      });
  }

  // Sort products
  function sortProducts() {
      switch(sortOption) {
          case 'priceLow':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
          case 'priceHigh':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
          case 'nameAZ':
              filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
              break;
          case 'nameZA':
              filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
              break;
          default:
              filteredProducts.sort((a, b) => a.id - b.id);
      }
  }

  // Render product card
  function renderProductCard(product) {
      const discountedPrice = product.discountPercentage > 0 
          ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2) 
          : null;
      const priceHTML = discountedPrice 
          ? `<span class="text-muted text-decoration-line-through">$${product.price.toFixed(2)}</span> $${discountedPrice}`
          : `$${product.price.toFixed(2)}`;
      const starHTML = product.rating > 0 
          ? `<div class="d-flex justify-content-center small text-warning mb-2">${Array(Math.round(product.rating)).fill('<div class="bi-star-fill"></div>').join('')}</div>`
          : '';

      return `
          <div class="col mb-4 ${window.innerWidth < 576 ? 'col-6' : window.innerWidth < 992 ? 'col-4' : 'col-3'}">
              <div class="card h-100" data-product-id="${product.id}">
                  ${product.discountPercentage > 0 ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                  <img class="card-img-top" src="${product.images[0]}" alt="${product.title}" />
                  <div class="card-body p-3">
                      <div class="text-center">
                          <h6 class="fw-bolder">${product.title}</h6>
                          ${starHTML}
                          <div class="price">${priceHTML}</div>
                      </div>
                  </div>
                  <div class="card-footer p-3 pt-0 border-top-0 bg-transparent">
                      <div class="text-center">
                          <a class="btn btn-outline-dark btn-sm mt-auto" href="#">Add to cart</a>
                      </div>
                  </div>
              </div>
          </div>
      `;
  }

  // Render detailed product card
  function renderProductDetail(product) {
      const discountedPrice = product.discountPercentage > 0 
          ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2) 
          : null;
      const priceHTML = discountedPrice 
          ? `<span class="text-muted text-decoration-line-through">$${product.price.toFixed(2)}</span> <span class="discount-price">$${discountedPrice}</span>`
          : `$${product.price.toFixed(2)}`;

      const reviewsHTML = product.reviews.map(review => `
          <div class="mb-3">
              <div class="d-flex small text-warning mb-1">
                  ${Array(review.rating).fill('<div class="bi-star-fill"></div>').join('')}
              </div>
              <p class="mb-1">"${review.comment}"</p>
              <small class="text-muted">By ${review.reviewerName} on ${new Date(review.date).toLocaleDateString()}</small>
          </div>
      `).join('');

      return `
          <div class="product-detail">
              <div class="row">
                  <div class="col-md-6">
                      <img src="${product.images[0]}" alt="${product.title}" class="img-fluid rounded">
                  </div>
                  <div class="col-md-6">
                      <h5>${product.title}</h5>
                      <p>${product.description}</p>
                      <div class="price-detail mb-3">${priceHTML}</div>
                      <ul class="list-group list-group-flush">
                          <li class="list-group-item"><strong>Category:</strong> ${product.category}</li>
                          <li class="list-group-item"><strong>Brand:</strong> ${product.brand}</li>
                          <li class="list-group-item"><strong>Rating:</strong> ${product.rating.toFixed(2)} / 5</li>
                          <li class="list-group-item"><strong>Stock:</strong> ${product.stock} ${product.availabilityStatus}</li>
                          <li class="list-group-item"><strong>SKU:</strong> ${product.sku}</li>
                          <li class="list-group-item"><strong>Weight:</strong> ${product.weight} oz</li>
                          <li class="list-group-item"><strong>Dimensions:</strong> ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} cm</li>
                          <li class="list-group-item"><strong>Warranty:</strong> ${product.warrantyInformation}</li>
                          <li class="list-group-item"><strong>Shipping:</strong> ${product.shippingInformation}</li>
                          <li class="list-group-item"><strong>Return Policy:</strong> ${product.returnPolicy}</li>
                          <li class="list-group-item"><strong>Minimum Order:</strong> ${product.minimumOrderQuantity}</li>
                          <li class="list-group-item"><strong>Tags:</strong> ${product.tags.join(', ')}</li>
                      </ul>
                  </div>
              </div>
              <div class="reviews-section">
                  <h6>Reviews</h6>
                  ${reviewsHTML || '<p>No reviews yet.</p>'}
              </div>
          </div>
      `;
  }

  // Render pagination
  function renderPagination() {
      const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
      const paginationElement = document.getElementById('pagination');
      
      let paginationHTML = `
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                  <span aria-hidden="true">«</span>
              </a>
          </li>
      `;
      
      const maxPagesToShow = window.innerWidth < 576 ? 3 : 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage + 1 < maxPagesToShow) {
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
          paginationHTML += `
              <li class="page-item ${currentPage === i ? 'active' : ''}">
                  <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
          `;
      }
      
      paginationHTML += `
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
              <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                  <span aria-hidden="true">»</span>
              </a>
          </li>
      `;
      
      paginationElement.innerHTML = paginationHTML;
      
      document.querySelectorAll('#pagination .page-link').forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const pageNum = parseInt(link.getAttribute('data-page'));
              if (pageNum >= 1 && pageNum <= totalPages) {
                  currentPage = pageNum;
                  updateProducts();
              }
          });
      });
  }

  // Update products display
  function updateProducts() {
      applyFilters();
      sortProducts();
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
      
      let productsHTML = paginatedProducts.length === 0 
          ? '<div class="col-12 text-center my-5"><h3>No products found</h3></div>'
          : paginatedProducts.map(renderProductCard).join('');
      
      productsContainer.innerHTML = productsHTML;
      renderPagination();

      // Add click event listeners to product cards
      document.querySelectorAll('.card').forEach(card => {
          card.addEventListener('click', () => {
              const productId = parseInt(card.getAttribute('data-product-id'));
              const product = filteredProducts.find(p => p.id === productId);
              if (product) {
                  productDetailContent.innerHTML = renderProductDetail(product);
                  productModal.show();
              }
          });
      });
  }

  // Initialize the application
  function init() {
      createUIElements();
      initEventListeners();
      fetchProducts();
  }

  init();
});