import { useEffect, useCallback, useReducer, useMemo, useRef } from 'react';
import { ActionTypes, createActions } from '../actionHelper';
import { useDebouncedCallback } from './useDebounce';

export interface FetchState<T> {
  data: T;
  isLoading: boolean;
  userData?: Partial<T>;
}

const createFetchSlice = <T>() => {
  const actions = createActions({
    FETCH: () => undefined,
    FETCH_SUCCESS: (data: T) => data,
    FETCH_FAILURE: (error: Error) => error,
    UPDATE: (data: Partial<T>) => data,
    UPDATE_SUCCESS: (data: T) => data,
    UPDATE_FAILURE: (error: Error) => error,
    USER_INPUT: (data: Partial<T>) => data,
  });

  type FetchActions = ActionTypes<typeof actions>;

  const reducer = (state: FetchState<T>, action: FetchActions) => {
    // TODO handle failure
    switch (action.type) {
      case 'FETCH':
        return { ...state, isLoading: true };
      case 'FETCH_SUCCESS':
        return { ...state, isLoading: false, data: action.payload };
      case 'UPDATE':
        return {
          ...state,
          isLoading: true,
          data: { ...state.data, ...state.userData },
          userData: undefined,
        };
      case 'UPDATE_SUCCESS':
        return {
          ...state,
          isLoading: false,
          data: action.payload,
        };
      case 'USER_INPUT':
        return { ...state, userData: { ...state.userData, ...action.payload } };
      default:
        return state;
    }
  };

  return { reducer, actions };
};

export interface UseFetch<T> {
  state: FetchState<T>;
  refresh: () => void;
  update: (data: Partial<T>) => void;
}

export const useFetch = <T>(url: RequestInfo, data: T, refreshInterval?: number): UseFetch<T> => {
  // Create reducer and actions
  const { reducer, actions } = useMemo(() => createFetchSlice<T>(), []);

  // Initialize reducer
  const [state, dispatch] = useReducer(reducer, { isLoading: true, data });

  // Refresh timer
  const [startRefresh, stopRefresh] = useDebouncedCallback(() => fetchData(), refreshInterval);

  // Abort controller to cancel the fetch and update
  const abort = useRef(new AbortController());

  // Fetch data
  const fetchData = useCallback(() => {
    dispatch(actions.FETCH());

    fetch(url, { signal: abort.current.signal })
      .then((res) =>
        res.json().then((json) => {
          dispatch(actions.FETCH_SUCCESS(json));
        }),
      )
      .then(() => startRefresh())
      .catch((error) => {
        if (!abort.current.signal.aborted) {
          dispatch(actions.FETCH_FAILURE(error));
          startRefresh();
        }
      });
  }, [abort]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    return () => abort.current.abort();
  }, [fetchData, abort]);

  // Post the user input
  const [updateData] = useDebouncedCallback((data: Partial<T>) => {
    dispatch(actions.UPDATE(data));

    // Post the updated data
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: abort.current.signal,
    })
      .then((res) =>
        res.json().then((json) => {
          dispatch(actions.UPDATE_SUCCESS(json));
          startRefresh();
        }),
      )
      .catch((error) => {
        if (!abort.current.signal.aborted) {
          dispatch(actions.FETCH_FAILURE(error));
        }
      });
  }, 1000);

  // Update the user input
  const update = (newData: Partial<T>) => {
    stopRefresh();
    dispatch(actions.USER_INPUT(newData));
    updateData({ ...state.data, ...state.userData, ...newData });
  };

  return { state, refresh: fetchData, update };
};
