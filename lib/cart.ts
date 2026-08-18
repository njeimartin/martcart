export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  quantity: number;
};

const KEY = "martcart-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("martcart-cart-updated"));
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((x) => x.productId === item.productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...item, quantity });
  saveCart(cart);
}

export function removeFromCart(productId: string) { saveCart(getCart().filter((x) => x.productId !== productId)); }

export function cartTotal(items = getCart()) { return items.reduce((sum, item) => sum + item.price * item.quantity, 0); }
