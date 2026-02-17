// Sample products data matching the design
const sampleProducts = [
    {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack",
        price: 109.95,
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: { rate: 3.9, count: 120 }
    },
    {
        id: 2,
        title: "Mens Casual Premium Slim Fit T-Shirts",
        price: 22.3,
        image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        rating: { rate: 4.1, count: 259 }
    },
    {
        id: 3,
        title: "Mens Cotton Jacket",
        price: 55.99,
        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        rating: { rate: 4.7, count: 500 }
    },
    {
        id: 4,
        title: "Mens Casual Slim Fit",
        price: 15.99,
        image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
        rating: { rate: 2.1, count: 430 }
    }
];

const loadHomeProducts = () => {
    // Use sample products for consistent design, or fetch from API
    displayHomeProducts(sampleProducts);
    
    // Optionally fetch from API:
    // fetch('https://fakestoreapi.com/products?limit=4')
    //     .then(res => res.json())
    //     .then(data => displayHomeProducts(data))
}

const displayHomeProducts = (products) => {
    const homeProductsContainer = document.querySelector('.homeProducts');
    if (!homeProductsContainer) return;
    
    homeProductsContainer.innerHTML = '';
    
    products.forEach(product => {
        // Generate star rating HTML
        const fullStars = Math.floor(product.rating.rate);
        const hasHalfStar = product.rating.rate % 1 >= 0.5;
        let starsHTML = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHTML += '<i class="fa-solid fa-star text-yellow-400 text-xs"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHTML += '<i class="fa-solid fa-star-half-stroke text-yellow-400 text-xs"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star text-yellow-400 text-xs"></i>';
            }
        }
        
        // Truncate title if too long
        const truncatedTitle = product.title.length > 35 
            ? product.title.substring(0, 35) + '...' 
            : product.title;
        
        const productCard = `
            <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <!-- Image Container -->
                <div class="relative bg-gray-100 h-56 flex items-center justify-center p-4 overflow-hidden">
                    <img src="${product.image}" 
                         alt="${product.title}" 
                         class="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    
                    <!-- Best Selling Badge -->
                    <span class="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-2.5 py-1 rounded">
                        Best Selling
                    </span>
                    
                    <!-- Rating Badge -->
                    <div class="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                        <i class="fa-solid fa-star text-yellow-400 text-xs"></i>
                        <span class="text-xs font-medium text-gray-700">${product.rating.rate}</span>
                        <span class="text-xs text-gray-400">(${product.rating.count})</span>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="p-4">
                    <h3 class="font-medium text-slate-800 text-sm mb-1 line-clamp-2 min-h-[40px]">
                        ${truncatedTitle}
                    </h3>
                    <p class="text-lg font-bold text-slate-900 mb-4">$${product.price.toFixed(2)}</p>
                    
                    <!-- Buttons -->
                    <div class="flex gap-2">
                        <button class="flex-1 btn btn-sm btn-outline border-gray-300 text-gray-600 hover:bg-gray-100 hover:border-gray-400 rounded-lg font-medium">
                            <i class="fa-solid fa-eye mr-1"></i> Details
                        </button>
                        <button class="flex-1 btn btn-sm bg-indigo-600 hover:bg-indigo-700 border-none text-white rounded-lg font-medium">
                            <i class="fa-solid fa-cart-plus mr-1"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
        homeProductsContainer.innerHTML += productCard;
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', loadHomeProducts);

// Fallback if DOM is already loaded
if (document.readyState !== 'loading') {
    loadHomeProducts();
}