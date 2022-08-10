import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = localStorage.getItem('@RocketShoes:cart');//Buscar dados do localStorage   
    
    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  // useEffect(() => {
  //   console.log('cart', cart)
  //   console.log('storagedCart', localStorage.getItem('@RocketShoes:cart'))
  // }, [cart]);


  // ADICIONANDO PRODUTOS NO CARRINHO
  const addProduct = async (productId: number) => {
    try {
      // TODO
      if (!productId) {
        // alert('Informe a sua atividade');
        return;
      }
      
      var resultado = false;   

      // FAZENDO A VERIFICAÇÃO DO ID
      const newShopCart = cart.map((item) =>{
        if (item.id === productId) {
          item.amount = item.amount + 1;
          resultado = true;          
        }              
        return item; 
      })

      if (resultado === false) {
        const response = await api.get('/products/' + productId)  

        const { data } = response;

        const newShopCart = {
          id: productId,
          title: data.title,
          price: data.price,
          image: data.image,
          amount: 1,
        }
        setCart(saldoCompras => [...saldoCompras, newShopCart]);
      } else {
        setCart(newShopCart)
      }  

      // ARMAZENANDO OS ITENS COMPRADOS NO CARRINHO COM ATUALIZAÇÃO DE TELA
      // localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
   
    } catch {
      // TODO
      alert("Alguma funcionalidade no sistema ficou desativa!")
    }
  };

  // REMOVENDO UM PRODUTO DO CARRINHO
  const removeProduct = (productId: number) => {
    try {
      // TODO     
      const productDeleted = cart.filter(item =>{
        return item.id !== productId;
      })
      setCart(productDeleted)
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      
      // const newCart = cart.map { item
      //   if item.id === productId {
      //     item.amount = amount
      //   }
      //   return item
      // }

      // setCart(newCart);

      // const newShopCart = cart.map((item) =>{
      //   if (item.id === productId) {
      //     item.amount = item.amount + 1;
      //     resultado = true;          
      //   }              
      //   return item; 
      // })
     


    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
