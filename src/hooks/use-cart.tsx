import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  creator: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: calculateTotal(updatedItems),
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: 1 }];
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: calculateTotal(updatedItems),
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Sync cart with database for authenticated users
  useEffect(() => {
    const syncCartWithDatabase = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch cart from database
      const { data: cartData } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products (
            id,
            title,
            price,
            image_url,
            instructor
          )
        `)
        .eq('user_id', user.id);

      if (cartData) {
        // Clear current cart and load from database
        dispatch({ type: 'CLEAR_CART' });
        cartData.forEach((item: any) => {
          if (item.products) {
            dispatch({
              type: 'ADD_ITEM',
              payload: {
                id: item.products.id,
                title: item.products.title,
                price: Number(item.products.price),
                image: item.products.image_url,
                creator: item.products.instructor || 'Unknown',
              },
            });
            if (item.quantity > 1) {
              dispatch({
                type: 'UPDATE_QUANTITY',
                payload: { id: item.products.id, quantity: item.quantity },
              });
            }
          }
        });
      }
    };

    syncCartWithDatabase();
  }, []);

  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    // Update local state first for immediate UI feedback
    dispatch({ type: 'ADD_ITEM', payload: item });

    // Sync to database if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    if (!user) {
      console.log('No authenticated user - cart will not persist to database');
      return;
    }

    try {
      // Check if item already exists
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('product_id', item.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching cart item:', fetchError);
        return;
      }

      if (existingItem) {
        // Update quantity if exists
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('user_id', user.id)
          .eq('product_id', item.id);

        if (updateError) {
          console.error('Error updating cart item:', updateError);
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: item.id,
            quantity: 1,
          });

        if (insertError) {
          console.error('Error inserting cart item:', insertError);
        }
      }
    } catch (error) {
      console.error('Unexpected error in addItem:', error);
    }
  };

  const removeItem = async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });

    // Sync to database if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    // Sync to database if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (quantity <= 0) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', id);
      } else {
        await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', user.id)
          .eq('product_id', id);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    // Clear database cart if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
    }
  };

  return (
    <CartContext.Provider value={{ state, dispatch, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
