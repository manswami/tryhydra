import {cartMetafieldDeleteDefault} from '@shopify/hydrogen';

const cartDeleteMetafield = cartMetafieldDeleteDefault({
  storefront,
  getCartId,
});

const result = await cartDeleteMetafield('namespace.key');
