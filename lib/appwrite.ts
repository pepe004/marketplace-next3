import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_APPWRITE_PROJECT_ID'); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Database and collection IDs
export const PRODUCTS_COLLECTION_ID = 'products';
export const ORDERS_COLLECTION_ID = 'orders';
export const AFFILIATES_COLLECTION_ID = 'affiliates';
export const PROMOTIONS_COLLECTION_ID = 'promotions';
export const CATEGORIES_COLLECTION_ID = 'categories';
export const REVIEWS_COLLECTION_ID = 'reviews';
export const WISHLIST_COLLECTION_ID = 'wishlists';

export { client };