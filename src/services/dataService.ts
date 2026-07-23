import type { Business, Category, Product } from '../types';
import businessesData from '../data/businesses.json';
import categoriesData from '../data/categories.json';
import productsData from '../data/products.json';

// Simulate API delay if needed, but since we are completely static and want to be fast, 
// we will just return immediately. This abstraction helps if we move to an API later.

export const getBusinesses = async (): Promise<Business[]> => {
  return businessesData as Business[];
};

export const getBusinessById = async (id: string): Promise<Business | undefined> => {
  return (businessesData as Business[]).find(b => b.id === id);
};

export const getCategoriesByBusiness = async (businessId: string): Promise<Category[]> => {
  return (categoriesData as Category[])
    .filter(c => c.businessId === businessId)
    .sort((a, b) => a.order - b.order);
};

export const getProductsByCategory = async (categoryId: string): Promise<Product[]> => {
  return (productsData as Product[]).filter(p => p.categoryId === categoryId);
};

export const getProductById = async (productId: string): Promise<Product | undefined> => {
  return (productsData as Product[]).find(p => p.id === productId);
};
