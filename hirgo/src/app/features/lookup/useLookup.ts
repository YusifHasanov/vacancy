import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { useGetLookupsByTypeQuery } from './lookupApi';
import { setLookups, addLookup, removeLookup, clearLookups } from './lookupSlice';
import { LookupItem, LookupType } from './lookupApi';
import { useEffect } from 'react';

export const useLookup = (type: LookupType) => {
  const dispatch = useDispatch();
  const { data, isLoading, error, refetch } = useGetLookupsByTypeQuery(type);
  const lookups = useSelector((state: RootState) => state.lookup.selectedLookups[type]);
  
  // Initialize lookups from API if not yet loaded
  useEffect(() => {
    if (data?.data && !lookups.length) {
      dispatch(setLookups({ type, lookups: data.data }));
    }
  }, [data, dispatch, lookups.length, type]);

  // Functions to manipulate lookups
  const add = (lookup: LookupItem) => {
    dispatch(addLookup({ type, lookup }));
  };

  const remove = (id: number) => {
    dispatch(removeLookup({ type, id }));
  };

  const clear = () => {
    dispatch(clearLookups(type));
  };

  return {
    lookups,
    isLoading,
    error,
    refetch,
    add,
    remove,
    clear,
  };
};

export const useAllLookups = () => {
  const dispatch = useDispatch();
  const lookupState = useSelector((state: RootState) => state.lookup);
  
  // Reset all lookups
  const clearAll = () => {
    dispatch(clearLookups());
  };

  return {
    lookupState,
    clearAll,
  };
}; 