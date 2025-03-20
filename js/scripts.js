// E-commerce Store Functionality (Pagination, Search, Sorting, Filtering)
document.addEventListener('DOMContentLoaded', function() {
    // Product data - in a real application, this would come from a database
    const products = [
        { id: 1, name: 'Fancy Product', price: { min: 40, max: 80 }, category: 'fancy', onSale: false, rating: 0, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 2, name: 'Special Item', price: { original: 20, current: 18 }, category: 'special', onSale: true, rating: 5, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 3, name: 'Sale Item', price: { original: 50, current: 25 }, category: 'sale', onSale: true, rating: 0, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 4, name: 'Popular Item', price: { current: 40 }, category: 'popular', onSale: false, rating: 5, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 5, name: 'Sale Item', price: { original: 50, current: 25 }, category: 'sale', onSale: true, rating: 0, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 6, name: 'Fancy Product', price: { min: 120, max: 280 }, category: 'fancy', onSale: false, rating: 0, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 7, name: 'Special Item', price: { original: 20, current: 18 }, category: 'special', onSale: true, rating: 5, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 8, name: 'Popular Item', price: { current: 40 }, category: 'popular', onSale: false, rating: 5, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        // Add more products for demonstration
        { id: 9, name: 'Winter Jacket', price: { current: 120 }, category: 'clothing', onSale: false, rating: 4, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 10, name: 'Summer Dress', price: { original: 80, current: 60 }, category: 'clothing', onSale: true, rating: 4, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 11, name: 'Leather Shoes', price: { current: 90 }, category: 'footwear', onSale: false, rating: 3, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 12, name: 'Sport Sneakers', price: { original: 95, current: 75 }, category: 'footwear', onSale: true, rating: 5, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 13, name: 'Casual Watch', price: { current: 150 }, category: 'accessories', onSale: false, rating: 4, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 14, name: 'Smartphone', price: { current: 499 }, category: 'electronics', onSale: false, rating: 5, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 15, name: 'Bluetooth Headphones', price: { original: 120, current: 89 }, category: 'electronics', onSale: true, rating: 4, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' },
        { id: 16, name: 'Laptop Bag', price: { current: 45 }, category: 'accessories', onSale: false, rating: 3, image: 'https://dummyimage.com/450x300/dee2e6/6c757d.jpg' }
    ];

    // State variables
    let currentPage = 1;
    const itemsPerPage = 8;
    let filteredProducts = [...products];
    let sortOption = 'default';
    let filterOptions = {
        category: 'all',
        onSale: false,
        minRating: 0
    };

    // Cache DOM elements
    const productsContainer = document.querySelector('.row-cols-2');
    
    // Create and append UI elements
    function createUIElements() {
        const headerSection = document.querySelector('header');
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'container px-4 px-lg-5 py-4 bg-light';
        controlsContainer.innerHTML = `
            <div class="row gx-4 gx-lg-5">
                <div class="col-md-4 mb-3">
                    <div class="input-group">
                        <input type="text" id="searchInput" class="form-control" placeholder="Search products...">
                        <button class="btn btn-outline-dark" id="searchBtn">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <select id="sortSelect" class="form-select">
                        <option value="default">Sort by: Default</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="nameAZ">Name: A to Z</option>
                        <option value="nameZA">Name: Z to A</option>
                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <select id="categoryFilter" class="form-select">
                        <option value="all">All Categories</option>
                        <option value="fancy">Fancy</option>
                        <option value="special">Special</option>
                        <option value="sale">Sale</option>
                        <option value="popular">Popular</option>
                        <option value="clothing">Clothing</option>
                        <option value="footwear">Footwear</option>
                        <option value="electronics">Electronics</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>
                <div class="col-md-2 mb-3 d-flex align-items-center">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="saleFilter">
                        <label class="form-check-label" for="saleFilter">On Sale</label>
                    </div>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5">
                <div class="col-12 mb-3">
                    <div id="ratingFilter" class="d-flex align-items-center">
                        <span class="me-2">Min Rating:</span>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-dark active" data-rating="0">All</button>
                            <button type="button" class="btn btn-outline-dark" data-rating="1">★</button>
                            <button type="button" class="btn btn-outline-dark" data-rating="2">★★</button>
                            <button type="button" class="btn btn-outline-dark" data-rating="3">★★★</button>
                            <button type="button" class="btn btn-outline-dark" data-rating="4">★★★★</button>
                            <button type="button" class="btn btn-outline-dark" data-rating="5">★★★★★</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert after header
        headerSection.after(controlsContainer);
        
        // Create pagination container
        const sectionElement = document.querySelector('section');
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'container px-4 px-lg-5 mt-3 mb-5';
        paginationContainer.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <nav aria-label="Product pagination">
                        <ul id="pagination" class="pagination justify-content-center"></ul>
                    </nav>
                </div>
            </div>
        `;
        
        // Insert pagination at the end of section
        sectionElement.appendChild(paginationContainer);
    }

    // Initialize event listeners
    function initEventListeners() {
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', function() {
            searchProducts();
        });
        
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
        
        // Sorting
        document.getElementById('sortSelect').addEventListener('change', function(e) {
            sortOption = e.target.value;
            currentPage = 1;
            updateProducts();
        });
        
        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', function(e) {
            filterOptions.category = e.target.value;
            currentPage = 1;
            updateProducts();
        });
        
        // Sale filter
        document.getElementById('saleFilter').addEventListener('change', function(e) {
            filterOptions.onSale = e.target.checked;
            currentPage = 1;
            updateProducts();
        });
        
        // Rating filter
        const ratingButtons = document.querySelectorAll('#ratingFilter button');
        ratingButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                ratingButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                // Update filter
                filterOptions.minRating = parseInt(this.getAttribute('data-rating'));
                currentPage = 1;
                updateProducts();
            });
        });
    }

    // Search products
    function searchProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        if (searchTerm === '') {
            // Reset to all products if search is empty
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.category.toLowerCase().includes(searchTerm)
            );
        }
        currentPage = 1;
        updateProducts();
    }

    // Apply filters
    function applyFilters() {
        filteredProducts = products.filter(product => {
            // Category filter
            const categoryMatch = filterOptions.category === 'all' || product.category === filterOptions.category;
            
            // Sale filter
            const saleMatch = !filterOptions.onSale || product.onSale;
            
            // Rating filter
            const ratingMatch = product.rating >= filterOptions.minRating;
            
            return categoryMatch && saleMatch && ratingMatch;
        });
    }

    // Sort products
    function sortProducts() {
        switch(sortOption) {
            case 'priceLow':
                filteredProducts.sort((a, b) => {
                    const priceA = a.price.current || a.price.min || 0;
                    const priceB = b.price.current || b.price.min || 0;
                    return priceA - priceB;
                });
                break;
            case 'priceHigh':
                filteredProducts.sort((a, b) => {
                    const priceA = a.price.current || a.price.max || a.price.min || 0;
                    const priceB = b.price.current || b.price.max || b.price.min || 0;
                    return priceB - priceA;
                });
                break;
            case 'nameAZ':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameZA':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default sorting by ID
                filteredProducts.sort((a, b) => a.id - b.id);
        }
    }

    // Render product card
    function renderProductCard(product) {
        let priceHTML = '';
        let starHTML = '';
        
        // Generate price HTML
        if (product.price.min && product.price.max) {
            priceHTML = `$${product.price.min.toFixed(2)} - $${product.price.max.toFixed(2)}`;
        } else if (product.price.original && product.price.current) {
            priceHTML = `
                <span class="text-muted text-decoration-line-through">$${product.price.original.toFixed(2)}</span>
                $${product.price.current.toFixed(2)}
            `;
        } else {
            priceHTML = `$${product.price.current.toFixed(2)}`;
        }
        
        // Generate stars HTML
        if (product.rating > 0) {
            starHTML = `
                <div class="d-flex justify-content-center small text-warning mb-2">
                    ${Array(product.rating).fill('<div class="bi-star-fill"></div>').join('')}
                </div>
            `;
        }
        
        // Generate the card HTML
        return `
            <div class="col mb-5">
                <div class="card h-100">
                    ${product.onSale ? '<div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>' : ''}
                    <img class="card-img-top" src="${product.image}" alt="${product.name}" />
                    <div class="card-body p-4">
                        <div class="text-center">
                            <h5 class="fw-bolder">${product.name}</h5>
                            ${starHTML}
                            ${priceHTML}
                        </div>
                    </div>
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                            <a class="btn btn-outline-dark mt-auto" href="#">
                                ${product.price.min ? 'View options' : 'Add to cart'}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        const paginationElement = document.getElementById('pagination');
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHTML += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        paginationElement.innerHTML = paginationHTML;
        
        // Add event listeners to pagination links
        document.querySelectorAll('#pagination .page-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const pageNum = parseInt(this.getAttribute('data-page'));
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
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        // Render products
        let productsHTML = '';
        if (paginatedProducts.length === 0) {
            productsHTML = '<div class="col-12 text-center my-5"><h3>No products found</h3></div>';
        } else {
            paginatedProducts.forEach(product => {
                productsHTML += renderProductCard(product);
            });
        }
        
        productsContainer.innerHTML = productsHTML;
        renderPagination();
        
        // Update product count display
        const productCountElement = document.querySelector('.lead.fw-normal');
        if (productCountElement) {
            productCountElement.textContent = `Showing ${paginatedProducts.length} of ${filteredProducts.length} products`;
        }
    }

    // Initialize the application
    function init() {
        createUIElements();
        initEventListeners();
        updateProducts();
    }

    // Start the application
    init();
});