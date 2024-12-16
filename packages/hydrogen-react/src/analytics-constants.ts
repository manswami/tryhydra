export const AnalyticsEventName = {
  PAGE_VIEW: 'PAGE_VIEW',
  ADD_TO_CART: 'ADD_TO_CART',
  PAGE_VIEW_2: 'PAGE_VIEW_2',
  COLLECTION_VIEW: 'COLLECTION_VIEW',
  PRODUCT_VIEW: 'PRODUCT_VIEW',
  SEARCH_VIEW: 'SEARCH_VIEW',
} as const;

export const AnalyticsPageType: AnalyticsPageType = {
  article: 'article',
  blog: 'blog',
  captcha: 'captcha',
  cart: 'cart',
  collection: 'collection',
  customersAccount: 'customers/account',
  customersActivateAccount: 'customers/activate_account',
  customersAddresses: 'customers/addresses',
  customersLogin: 'customers/login',
  customersOrder: 'customers/order',
  customersRegister: 'customers/register',
  customersResetPassword: 'customers/reset_password',
  giftCard: 'gift_card',
  home: 'index',
  listCollections: 'list-collections',
  forbidden: '403',
  notFound: '404',
  page: 'page',
  password: 'password',
  product: 'product',
  policy: 'policy',
  search: 'search',
} as const;

export const ShopifySalesChannel: ShopifySalesChannel = {
  hydrogen: 'hydrogen',
  headless: 'headless',
} as const;

export const ShopifyAppId = {
  hydrogen: '6167201',
  headless: '12875497473',
} as const;

/**
 * These duplicated interface declaration is so that we can generate proper documentation
 * for these public facing constants
 */
export interface AnalyticsEventName {
  /** Page view */
  PAGE_VIEW: 'PAGE_VIEW';
  /** Add to cart */
  ADD_TO_CART: 'ADD_TO_CART';
}

export interface AnalyticsPageType {
  article: 'article';
  blog: 'blog';
  captcha: 'captcha';
  cart: 'cart';
  collection: 'collection';
  customersAccount: 'customers/account';
  customersActivateAccount: 'customers/activate_account';
  customersAddresses: 'customers/addresses';
  customersLogin: 'customers/login';
  customersOrder: 'customers/order';
  customersRegister: 'customers/register';
  customersResetPassword: 'customers/reset_password';
  giftCard: 'gift_card';
  home: 'index';
  listCollections: 'list-collections';
  forbidden: '403';
  notFound: '404';
  page: 'page';
  password: 'password';
  product: 'product';
  policy: 'policy';
  search: 'search';
}

export interface ShopifySalesChannel {
  /** Shopify Hydrogen sales channel */
  hydrogen: 'hydrogen';
  /** Shopify Headless sales channel */
  headless: 'headless';
}
