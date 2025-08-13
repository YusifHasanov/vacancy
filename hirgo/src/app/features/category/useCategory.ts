import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetAllCategoriesQuery, useGetCategoryByIdQuery } from './categoryApi';
import { setCategories, setSelectedCategory, clearCategories } from './categorySlice';
import { CategoryItem } from './categoryApi';
import { useEffect } from 'react';

export const useCategories = () => {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = useGetAllCategoriesQuery();
  const categories = useSelector((state: RootState) => state.category.categories);
  
  // Initialize categories from API if not yet loaded
  useEffect(() => {
    if (data?.data?.categories && !categories.length) {
      dispatch(setCategories(data.data.categories));
    }
  }, [data, dispatch, categories.length]);

  // Select a category
  const selectCategory = (category: CategoryItem | null) => {
    dispatch(setSelectedCategory(category));
  };

  // Clear categories
  const clear = () => {
    dispatch(clearCategories());
  };

  return {
    categories,
    isLoading,
    error,
    refetch,
    selectCategory,
    clear
  };
};

export const useCategoryById = (id: number) => {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = useGetCategoryByIdQuery(id, {
    skip: !id
  });
  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
  
  // Set the selected category when data is fetched
  useEffect(() => {
    if (data?.data) {
      dispatch(setSelectedCategory(data.data));
    }
  }, [data, dispatch]);

  return {
    category: data?.data || selectedCategory,
    isLoading,
    error,
    refetch
  };
}; 