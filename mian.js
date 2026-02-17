

// Cart array to store products
var cart = [];

// Store all products
var allProducts = [];

// ======================================
// LOAD HOME PAGE PRODUCTS
// ======================================

function loadHomeProducts() {
    // Get the container where products will be shown
    var container = document.querySelector('.homeProducts');

    // If container doesn't exist, stop here
    if (!container) {
        return;
    }

    // Fetch products from API
    fetch('https://fakestoreapi.com/products')
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            // Clear the container
            container.innerHTML = '';

            // Sort products by rating (highest first)
            products.sort(function (a, b) {
                return b.rating.rate - a.rating.rate;
            });

            // Get only first 3 products (top rated)
            var topProducts = products.slice(0, 3);

            // Loop through products and create cards
            for (var i = 0; i < topProducts.length; i++) {
                var product = topProducts[i];
                var card = createProductCard(product);
                container.innerHTML = container.innerHTML + card;
            }
        })
        .catch(function (error) {
            console.log('Error loading products:', error);
        });
}

// ======================================
// LOAD ALL PRODUCTS (Products Page)
// ======================================

function loadAllProducts() {
    var container = document.getElementById('productsGrid');
    var spinner = document.getElementById('loadingSpinner');

    if (!container) {
        return;
    }

    // Fetch all products from API
    fetch('https://fakestoreapi.com/products')
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            // Save products globally
            allProducts = products;

            // Hide loading spinner
            if (spinner) {
                spinner.classList.add('hidden');
            }

            // Display products
            displayProducts(products);
        })
        .catch(function (error) {
            console.log('Error:', error);
        });
}

// ======================================
// DISPLAY PRODUCTS IN GRID
// ======================================

function displayProducts(products) {
    var container = document.getElementById('productsGrid');

    if (!container) {
        return;
    }

    // Clear container
    container.innerHTML = '';

    // Check if no products
    if (products.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-500 py-10">No products found.</p>';
        return;
    }

    // Loop through products and add cards
    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var card = createProductCard(product);
        container.innerHTML = container.innerHTML + card;
    }
}

// ======================================
// CREATE PRODUCT CARD HTML
// ======================================

function createProductCard(product) {
    // Shorten title if too long
    var title = product.title;
    if (title.length > 30) {
        title = title.substring(0, 30) + '...';
    }

    // Format category name (capitalize first letter)
    var category = product.category;
    category = category.charAt(0).toUpperCase() + category.slice(1);

    // Create card HTML
    var card = `
        <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
            <!-- Image -->
            <div class="relative bg-gray-50 h-56 flex items-center justify-center p-4">
                <img src="${product.image}" 
                     alt="${product.title}" 
                     class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                
                <!-- Category Badge -->
                <span class="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                    ${category}
                </span>
                
                <!-- Rating Badge -->
                <div class="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full shadow-sm">
                    <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                    <span class="text-xs font-medium text-gray-700">${product.rating.rate}</span>
                    <span class="text-xs text-gray-400">(${product.rating.count})</span>
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="p-4">
                <h3 class="font-medium text-slate-800 text-sm mb-1 min-h-[40px]" title="${product.title}">
                    ${title}
                </h3>
                <p class="text-lg font-bold text-slate-900 mb-4">$${product.price.toFixed(2)}</p>
                
                <!-- Buttons -->
                <div class="flex gap-2">
                    <button onclick="openModal(${product.id})" 
                            class="flex-1 btn btn-sm btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <i class="fa-solid fa-eye mr-1"></i> Details
                    </button>
                    <button onclick="addToCart(${product.id})" 
                            class="flex-1 btn btn-sm bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-lg">
                        <i class="fa-solid fa-cart-plus mr-1"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;

    return card;
}

// ======================================
// LOAD CATEGORIES
// ======================================

function loadCategories() {
    var container = document.getElementById('categoryFilters');

    if (!container) {
        return;
    }

    // Fetch categories from API
    fetch('https://fakestoreapi.com/products/categories')
        .then(function (response) {
            return response.json();
        })
        .then(function (categories) {
            // Remove skeleton loader
            var skeleton = container.querySelector('.category-skeleton');
            if (skeleton) {
                skeleton.remove();
            }

            // Add category buttons
            for (var i = 0; i < categories.length; i++) {
                var category = categories[i];

                // Create button
                var button = document.createElement('button');
                button.className = 'btn btn-sm bg-white text-gray-700 hover:bg-indigo-600 hover:text-white border border-gray-300 rounded-full category-btn';
                button.setAttribute('data-category', category);
                button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                button.onclick = function () {
                    filterByCategory(this.getAttribute('data-category'));
                };

                container.appendChild(button);
            }
        })
        .catch(function (error) {
            console.log('Error loading categories:', error);
        });
}

// ======================================
// FILTER BY CATEGORY
// ======================================

function filterByCategory(category) {
    var container = document.getElementById('productsGrid');
    var spinner = document.getElementById('loadingSpinner');

    if (!container) {
        return;
    }

    // Update active button style
    var allButtons = document.querySelectorAll('.category-btn');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].classList.remove('bg-indigo-600', 'text-white');
        allButtons[i].classList.add('bg-white', 'text-gray-700');
    }

    var activeButton = document.querySelector('[data-category="' + category + '"]');
    if (activeButton) {
        activeButton.classList.remove('bg-white', 'text-gray-700');
        activeButton.classList.add('bg-indigo-600', 'text-white');
    }

    // Show loading
    if (spinner) {
        spinner.classList.remove('hidden');
    }
    container.innerHTML = '';

    // Check if "all" category
    if (category === 'all') {
        if (spinner) {
            spinner.classList.add('hidden');
        }
        displayProducts(allProducts);
        return;
    }

    // Fetch products by category
    fetch('https://fakestoreapi.com/products/category/' + category)
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            if (spinner) {
                spinner.classList.add('hidden');
            }
            displayProducts(products);
        })
        .catch(function (error) {
            console.log('Error:', error);
        });
}

// ======================================
// OPEN PRODUCT MODAL
// ======================================

function openModal(productId) {
    var modal = document.getElementById('productModal');
    var modalContent = document.getElementById('modalContent');

    if (!modal || !modalContent) {
        return;
    }

    // Show loading in modal
    modalContent.innerHTML = '<div class="flex justify-center items-center w-full py-10"><span class="loading loading-spinner loading-lg text-indigo-600"></span></div>';
    modal.showModal();

    // Fetch product details
    fetch('https://fakestoreapi.com/products/' + productId)
        .then(function (response) {
            return response.json();
        })
        .then(function (product) {
            // Create star rating
            var stars = '';
            var fullStars = Math.floor(product.rating.rate);
            for (var i = 0; i < 5; i++) {
                if (i < fullStars) {
                    stars = stars + '<i class="fa-solid fa-star text-yellow-400 text-sm"></i>';
                } else {
                    stars = stars + '<i class="fa-regular fa-star text-yellow-400 text-sm"></i>';
                }
            }

            // Format category
            var category = product.category;
            category = category.charAt(0).toUpperCase() + category.slice(1);

            // Update modal content
            modalContent.innerHTML = '<div class="w-full md:w-1/3 bg-gray-50 rounded-lg p-4 flex items-center justify-center"><img src="' + product.image + '" alt="' + product.title + '" class="max-h-64 object-contain" /></div><div class="flex-1"><span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-3">' + category + '</span><h2 class="text-xl md:text-2xl font-bold text-slate-800 mb-3">' + product.title + '</h2><div class="flex items-center gap-2 mb-4"><div class="flex items-center gap-1">' + stars + '</div><span class="text-sm text-gray-600">' + product.rating.rate + ' (' + product.rating.count + ' reviews)</span></div><p class="text-2xl font-bold text-indigo-600 mb-4">$' + product.price.toFixed(2) + '</p><p class="text-gray-600 text-sm leading-relaxed mb-6">' + product.description + '</p><div class="flex flex-col sm:flex-row gap-3"><button onclick="addToCart(' + product.id + '); document.getElementById(\'productModal\').close();" class="btn bg-indigo-600 hover:bg-indigo-700 border-none text-white flex-1"><i class="fa-solid fa-cart-plus mr-2"></i> Add to Cart</button><button class="btn bg-orange-500 hover:bg-orange-600 border-none text-white flex-1"><i class="fa-solid fa-bolt mr-2"></i> Buy Now</button></div></div>';
        })
        .catch(function (error) {
            modalContent.innerHTML = '<p class="text-center text-red-500">Failed to load product details.</p>';
            console.log('Error:', error);
        });
}

// ======================================
// ADD TO CART
// ======================================

function addToCart(productId) {
    // First check if product is already in allProducts array
    var product = null;

    for (var i = 0; i < allProducts.length; i++) {
        if (allProducts[i].id === productId) {
            product = allProducts[i];
            break;
        }
    }

    // If found in allProducts, add directly
    if (product) {
        cart.push(product);
        updateCartCount();
        showToast(product.title);
        return;
    }

    // Otherwise fetch from API
    fetch('https://fakestoreapi.com/products/' + productId)
        .then(function (response) {
            return response.json();
        })
        .then(function (product) {
            cart.push(product);
            updateCartCount();
            showToast(product.title);
        })
        .catch(function (error) {
            console.log('Error adding to cart:', error);
        });
}

// ======================================
// UPDATE CART COUNT
// ======================================

function updateCartCount() {
    var cartBadges = document.querySelectorAll('.cart-count');

    for (var i = 0; i < cartBadges.length; i++) {
        cartBadges[i].textContent = cart.length;
    }
}

// ======================================
// SHOW TOAST MESSAGE
// ======================================

function showToast(productTitle) {
    // Remove old toast if exists
    var oldToast = document.querySelector('.toast-notification');
    if (oldToast) {
        oldToast.remove();
    }

    // Shorten title if too long
    if (productTitle.length > 20) {
        productTitle = productTitle.substring(0, 20) + '...';
    }

    // Create toast element
    var toast = document.createElement('div');
    toast.className = 'toast-notification fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    toast.textContent = productTitle + ' added to cart!';

    // Add to page
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(function () {
        toast.remove();
    }, 3000);
}

// ======================================
// START THE APP
// ======================================

function startApp() {
    // Update cart count
    updateCartCount();

    // Check which page we are on
    var productsGrid = document.getElementById('productsGrid');
    var homeProducts = document.querySelector('.homeProducts');

    // If on products page
    if (productsGrid) {
        loadCategories();
        loadAllProducts();
    }

    // If on home page
    if (homeProducts) {
        loadHomeProducts();
    }
}

// Run when page loads
document.addEventListener('DOMContentLoaded', startApp);
