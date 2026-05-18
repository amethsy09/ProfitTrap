import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from './cart.service';
import { Product, CartItem } from './shop.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.html',
 
})
export class ShopComponent {
  cartService = inject(CartService);
  
  // Notification
  notification = signal<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Modal panier
  showCartModal = signal<boolean>(false);
  
  // Code promo
  promoCode = signal<string>('');
  discount = signal<number>(0);
  hasPromoCode = signal<boolean>(false);
  
  // Filtres
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('all');
  
  // Prix total avec réduction
  totalWithDiscount = computed(() => {
    const total = this.cartService.totalPrice();
    const discountAmount = this.discount();
    return total - discountAmount;
  });
  
  // Liste des produits
  products = signal<Product[]>([
    // Compléments alimentaires
    {
      id: 1,
      name: 'Protéine Whey Isolat',
      category: 'complement',
      price: 49.99,
      originalPrice: 69.99,
      description: 'Protéine en poudre de haute qualité pour la reconstruction musculaire. Absorption rapide.',
      image: '💪',
      stock: 50,
      rating: 4.8,
      reviews: 234,
      isPromo: true,
      discount: 29
    },
    {
      id: 2,
      name: 'Créatine Monohydrate',
      category: 'complement',
      price: 29.99,
      description: 'Améliore la force et la performance lors des exercices de haute intensité.',
      image: '⚡',
      stock: 100,
      rating: 4.9,
      reviews: 567,
      isNew: true
    },
    {
      id: 3,
      name: 'BCAA 2:1:1',
      category: 'complement',
      price: 34.99,
      originalPrice: 44.99,
      description: 'Acides aminés essentiels pour la récupération musculaire.',
      image: '🧪',
      stock: 75,
      rating: 4.6,
      reviews: 189,
      isPromo: true,
      discount: 22
    },
    {
      id: 4,
      name: 'Oméga-3 EPA/DHA',
      category: 'complement',
      price: 24.99,
      description: 'Acides gras essentiels pour la santé cardiovasculaire.',
      image: '🐟',
      stock: 120,
      rating: 4.7,
      reviews: 312
    },
    {
      id: 5,
      name: 'Vitamine D3',
      category: 'complement',
      price: 19.99,
      description: 'Renforce le système immunitaire et la santé osseuse.',
      image: '☀️',
      stock: 200,
      rating: 4.8,
      reviews: 456,
      isNew: true
    },
    {
      id: 6,
      name: 'Multivitamines Sport',
      category: 'complement',
      price: 39.99,
      description: 'Complexe vitaminique complet pour sportifs.',
      image: '💊',
      stock: 85,
      rating: 4.7,
      reviews: 278
    },
    // Équipements
    {
      id: 7,
      name: 'Tapis de Yoga',
      category: 'equipment',
      price: 39.99,
      originalPrice: 59.99,
      description: 'Tapis antidérapant haute densité pour le yoga et le pilates.',
      image: '🧘',
      stock: 30,
      rating: 4.5,
      reviews: 89,
      isPromo: true,
      discount: 33
    },
    {
      id: 8,
      name: 'Kettlebell 12kg',
      category: 'equipment',
      price: 54.99,
      description: 'Kettlebell en fonte avec revêtement en vinyle.',
      image: '🏋️',
      stock: 25,
      rating: 4.8,
      reviews: 156
    },
    {
      id: 9,
      name: 'Barre de Traction',
      category: 'equipment',
      price: 79.99,
      description: 'Barre de traction multi-prises pour porte.',
      image: '📊',
      stock: 15,
      rating: 4.7,
      reviews: 98,
      isNew: true
    },
    {
      id: 10,
      name: 'Élastiques Résistance',
      category: 'equipment',
      price: 19.99,
      description: 'Set de 5 élastiques pour exercices de résistance.',
      image: '🔄',
      stock: 200,
      rating: 4.4,
      reviews: 445
    },
    {
      id: 11,
      name: 'Corde à Sauter',
      category: 'equipment',
      price: 14.99,
      description: 'Corde à sauter professionnelle avec roulements à billes.',
      image: '🪢',
      stock: 150,
      rating: 4.6,
      reviews: 234,
      isNew: true
    },
    {
      id: 12,
      name: 'Gants de Musculation',
      category: 'equipment',
      price: 24.99,
      description: 'Gants renforcés pour la protection des mains.',
      image: '🧤',
      stock: 60,
      rating: 4.5,
      reviews: 167
    },
    // Vêtements
    {
      id: 13,
      name: 'T-Shirt Technique',
      category: 'clothing',
      price: 29.99,
      description: 'T-shirt respirant évacuant la transpiration.',
      image: '👕',
      stock: 80,
      rating: 4.6,
      reviews: 267
    },
    {
      id: 14,
      name: 'Legging Sport',
      category: 'clothing',
      price: 44.99,
      description: 'Legging haute compression pour le sport.',
      image: '👖',
      stock: 60,
      rating: 4.7,
      reviews: 189,
      isNew: true
    },
    {
      id: 15,
      name: 'Short de Sport',
      category: 'clothing',
      price: 34.99,
      description: 'Short léger pour l\'entraînement.',
      image: '🩳',
      stock: 90,
      rating: 4.5,
      reviews: 145
    },
    // Accessoires
    {
      id: 16,
      name: 'Gourde Isotherme',
      category: 'accessory',
      price: 19.99,
      description: 'Gourde 1L en acier inoxydable.',
      image: '💧',
      stock: 150,
      rating: 4.9,
      reviews: 723,
      isNew: true
    },
    {
      id: 17,
      name: 'Sac de Sport',
      category: 'accessory',
      price: 49.99,
      originalPrice: 69.99,
      description: 'Sac multifonctions avec compartiment chaussures.',
      image: '🎒',
      stock: 40,
      rating: 4.8,
      reviews: 234,
      isPromo: true,
      discount: 29
    },
    {
      id: 18,
      name: 'Serviette Microfibre',
      category: 'accessory',
      price: 15.99,
      description: 'Serviette compacte et absorbante.',
      image: '🧣',
      stock: 200,
      rating: 4.7,
      reviews: 178
    }
  ]);
  
  // Produits filtrés
  filteredProducts = computed(() => {
    let filtered = this.products();
    
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }
    
    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(p => p.category === this.selectedCategory());
    }
    
    return filtered;
  });
  
  // Statistiques
  stats = computed(() => ({
    total: this.filteredProducts().length,
    categories: {
      complement: this.filteredProducts().filter(p => p.category === 'complement').length,
      equipment: this.filteredProducts().filter(p => p.category === 'equipment').length,
      clothing: this.filteredProducts().filter(p => p.category === 'clothing').length,
      accessory: this.filteredProducts().filter(p => p.category === 'accessory').length
    }
  }));
  
  // Catégories
  categories = [
    { value: 'all', label: 'Tous les produits', icon: '📦' },
    { value: 'complement', label: 'Compléments', icon: '💊' },
    { value: 'equipment', label: 'Équipements', icon: '🏋️' },
    { value: 'clothing', label: 'Vêtements', icon: '👕' },
    { value: 'accessory', label: 'Accessoires', icon: '🎒' }
  ];
  
  // Ajouter au panier
  addToCart(product: Product) {
    const result = this.cartService.addToCart(product, 1);
    this.showNotification(result.message, result.success ? 'success' : 'error');
  }
  
  // Mettre à jour la quantité dans le modal
  updateQuantity(item: CartItem, newQuantity: number) {
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      this.cartService.updateQuantity(item.product.id, newQuantity);
    } else if (newQuantity === 0) {
      this.cartService.removeFromCart(item.product.id);
    } else if (newQuantity > item.product.stock) {
      this.showNotification(`Stock maximum: ${item.product.stock}`, 'error');
    }
  }
  
  // Retirer du panier
  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.showNotification('Produit retiré du panier', 'success');
  }
  
  // Vider le panier
  clearCart() {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      this.cartService.clearCart();
      this.discount.set(0);
      this.hasPromoCode.set(false);
      this.promoCode.set('');
      this.showNotification('Panier vidé', 'info');
    }
  }
  
  // Appliquer code promo
  applyPromoCode() {
    if (this.promoCode() === 'BIENVENUE15') {
      const discountAmount = this.cartService.totalPrice() * 0.15;
      this.discount.set(discountAmount);
      this.hasPromoCode.set(true);
      this.showNotification('Code promo appliqué ! -15%', 'success');
    } else if (this.promoCode() === 'LIVRAISONOFFERTE') {
      this.showNotification('Livraison offerte sur votre commande !', 'success');
    } else {
      this.showNotification('Code promo invalide', 'error');
    }
  }
  
  // Supprimer code promo
  removePromoCode() {
    this.discount.set(0);
    this.hasPromoCode.set(false);
    this.promoCode.set('');
    this.showNotification('Code promo supprimé', 'info');
  }
  
  // Afficher notification
  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notification.set({ show: true, message, type });
    setTimeout(() => {
      this.notification.set({ show: false, message: '', type: 'success' });
    }, 2500);
  }
  
  // Réinitialiser les filtres
  resetFilters() {
    this.searchTerm.set('');
    this.selectedCategory.set('all');
  }
  
  // Ouvrir modal panier
  openCartModal() {
    this.showCartModal.set(true);
  }
  
  // Fermer modal panier
  closeCartModal() {
    this.showCartModal.set(false);
  }
  
  // Obtenir le libellé de la catégorie
  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      complement: 'Complément',
      equipment: 'Équipement',
      clothing: 'Vêtement',
      accessory: 'Accessoire'
    };
    return labels[category] || category;
  }
  
  // Obtenir la couleur de la catégorie
  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      complement: 'bg-purple-100 text-purple-800',
      equipment: 'bg-blue-100 text-blue-800',
      clothing: 'bg-green-100 text-green-800',
      accessory: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }
}