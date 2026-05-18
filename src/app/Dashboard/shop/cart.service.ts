import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from './shop.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  // État privé
  private itemsSignal = signal<CartItem[]>([]);
  
  // État public (readonly)
  readonly items = this.itemsSignal.asReadonly();
  
  // Computed values
  readonly totalItems = computed(() => {
    return this.itemsSignal().reduce((total, item) => total + item.quantity, 0);
  });
  
  readonly totalPrice = computed(() => {
    return this.itemsSignal().reduce((total, item) => total + item.subtotal, 0);
  });
  
  constructor() {
    this.loadFromStorage();
    
    effect(() => {
      const items = this.itemsSignal();
      localStorage.setItem('cart', JSON.stringify(items));
      console.log('🛒 Panier mis à jour:', {
        items: this.totalItems(),
        total: this.totalPrice()
      });
    });
  }
  
  private loadFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.itemsSignal.set(items);
      } catch (e) {
        console.error('Erreur chargement panier', e);
      }
    }
  }
  
  addToCart(product: Product, quantity: number = 1): { success: boolean; message: string } {
    const currentItems = this.itemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= product.stock) {
        const updatedItems = currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity, subtotal: newQuantity * product.price }
            : item
        );
        this.itemsSignal.set(updatedItems);
        return { success: true, message: `${product.name} ajouté au panier (x${quantity})` };
      } else {
        return { success: false, message: `Stock insuffisant pour ${product.name}` };
      }
    } else {
      if (quantity <= product.stock) {
        this.itemsSignal.set([...currentItems, {
          product,
          quantity,
          subtotal: quantity * product.price
        }]);
        return { success: true, message: `${product.name} ajouté au panier` };
      } else {
        return { success: false, message: `Stock insuffisant pour ${product.name}` };
      }
    }
  }
  
  removeFromCart(productId: number) {
    const currentItems = this.itemsSignal();
    this.itemsSignal.set(currentItems.filter(item => item.product.id !== productId));
  }
  
  updateQuantity(productId: number, quantity: number) {
    const currentItems = this.itemsSignal();
    const item = currentItems.find(item => item.product.id === productId);
    
    if (item && quantity > 0 && quantity <= item.product.stock) {
      const updatedItems = currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity, subtotal: quantity * item.product.price }
          : item
      );
      this.itemsSignal.set(updatedItems);
    } else if (quantity === 0) {
      this.removeFromCart(productId);
    }
  }
  
  clearCart() {
    this.itemsSignal.set([]);
  }
  
  isEmpty(): boolean {
    return this.itemsSignal().length === 0;
  }
  
  getItemCount(): number {
    return this.totalItems();
  }
}