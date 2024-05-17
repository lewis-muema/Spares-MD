import { addToCart } from '../reducers/Cart';

export const addItemToCart = (id, item, cart, count) => {
  return async (dispatch) => {
    let cartProducts = [];
    cart.products.forEach((product) => {
      cartProducts.push(product);
    });
    const variant = {
      productId: id,
      variants: [{
        ...item,
        cart: 1,
      }],
    };
    if (cart.products.length === 0) {
      cartProducts.push(variant);
      dispatch(addToCart(cartProducts));
    } else {
      let index;
      cart.products.filter((prd, i) => {
        if (prd.productId === id) {
          index = i;
        }
        return prd.productId === id;
      });
      if (index === undefined) {
        cartProducts.push(variant);
        dispatch(addToCart(cartProducts));
      } else {
        let varIndex;
        cartProducts[index].variants.filter((vrt, i) => {
          if (vrt._id === item._id) {
            varIndex = i;
          }
          return vrt._id === item._id;
        });
        if (varIndex === undefined) {
          cartProducts[index] = {
            ...cartProducts[index],
            variants: [
              ...cartProducts[index].variants,
              variant.variants[0],
            ],
          };
        } else {
          const products = [...cartProducts];
          const variants = [...cartProducts[index].variants];
          const variant = cartProducts[index].variants[varIndex];
          variants[varIndex] = {
            ...variant,
            cart: variant.cart + count,
          };
          products[index] = {
            ...products[index],
            variants,
          };
          cartProducts = products;
        }
        dispatch(addToCart(cartProducts));
      }
    }
  };
};

export const showCount = (id, item, cart) => {
  let cartVal;
  const product = cart.products.filter(prd => prd.productId === id);
  if (product.length) {
    const variant = product[0].variants.filter(vrt => vrt._id === item._id);
    if (variant.length) {
      cartVal = variant[0].cart;
    }
  }
  return cartVal;
};

export const showTotalCount = (cart) => {
  let count = 0;
  cart.products.forEach((product) => {
    product.variants.forEach((variant) => {
      count = variant.cart + count;
    });
  });
  return count;
};
