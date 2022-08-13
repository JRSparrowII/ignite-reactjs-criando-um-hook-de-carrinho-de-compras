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

interface CartItemsAmount {
  [key: number]: number;
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

      const resultadoStock = await api.get('/stock/' + productId) ;
      const estoque = resultadoStock.data;

      // ATUALIZA PRODUTO SE EXISTIR NO CARRINHO
      var resultado = false;   
      var saldoLimite = false;

      const newShopCart = cart.map((item) =>{
        if (item.id === productId) {                    
          if (estoque.amount > item.amount) {
            item.amount = item.amount + 1;  
            resultado = true; 
          } else {
            toast.error('Quantidade solicitada fora de estoque');  
            saldoLimite = true;                      
          }                  
        }              
        return item; 
      })

      if (saldoLimite) {
        return;
      }

      console.log('Sou '+ saldoLimite + ', nao devo entrar aqui se sou true');
    
      //ADICIONA O PRODUTO NO CARRINHO QUANDO NÃO EXISTE
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
        
        if (estoque.amount >= newShopCart.amount ) {
          setCart(saldoCompras => [...saldoCompras, newShopCart]);
        } else {
          toast.error('Quantidade solicitada fora de estoque');
        }        
      } else {
        setCart(newShopCart)
      }  

      // ARMAZENANDO OS ITENS COMPRADOS NO CARRINHO COM ATUALIZAÇÃO DE TELA
      // localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart));
   
    } catch {
      // TODO
      toast.error("Alguma funcionalidade no sistema ficou desativa!")
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

  // ATUALIZANDO AS COMPRAS DO CARRINHO PARA MAIS OU MENOS
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO 
      var saldoAtualizado = amount;

      const resultadoStock = await api.get('/stock/' + productId) ;
      const estoque = resultadoStock.data;

      const newProductAmount = cart.map ((item) => {
        if (item.id === productId) {
          console.log('Qtd q tem no estoque', estoque.amount)
          console.log('valor q estou tentando atualizar', saldoAtualizado)
          if (estoque.amount >= saldoAtualizado) {
            item.amount = saldoAtualizado;
            console.log('Atualizei o estoque')
          }                         
        }              
        return item;
      })  

      setCart(newProductAmount)        

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
