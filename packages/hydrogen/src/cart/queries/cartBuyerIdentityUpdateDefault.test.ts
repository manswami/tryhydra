import {describe, it, expect} from 'vitest';
import {CART_ID, mockCreateStorefrontClient} from '../cart-test-helper';
import {cartBuyerIdentityUpdateDefault} from './cartBuyerIdentityUpdateDefault';

describe('cartBuyerIdentityUpdateDefault', () => {
  it('should return a default cart buyer identity update implementation', async () => {
    const cartUpdate = cartBuyerIdentityUpdateDefault({
      storefront: mockCreateStorefrontClient(),
      getCartId: () => CART_ID,
    });

    const result = await cartUpdate({});

    expect(result.cart).toHaveProperty('id', CART_ID);
  });

  it('can override cartFragment', async () => {
    const cartFragment = 'cartFragmentOverride';
    const cartUpdate = cartBuyerIdentityUpdateDefault({
      storefront: mockCreateStorefrontClient(),
      getCartId: () => CART_ID,
      cartFragment,
    });

    const result = await cartUpdate({});

    expect(result.cart).toHaveProperty('id', CART_ID);
    expect(result.userErrors?.[0]).toContain(cartFragment);
  });
});
