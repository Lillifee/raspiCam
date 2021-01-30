import { useEffect, useCallback, useReducer, useMemo, useRef } from 'react';
import { ActionTypes, createActions } from '../actionHelper';
import { useDebounce } from './useDebounce';
import { useTimer } from './useTimer';

export interface FetchState<T> {
  data: T;
  isLoading: boolean;
  isUpdating: boolean;
  input?: Partial<T>;
}

/**
 * Create fetch and update reducer with typed actions
 * @template T Type of request data
 */
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
        return { ...state, data: action.payload, isLoading: false };
      case 'UPDATE':
        return {
          ...state,
          data: { ...state.data, ...state.input },
          input: undefined,
          isUpdating: true,
        };
      case 'UPDATE_SUCCESS':
        return {
          ...state,
          data: action.payload,
          isUpdating: false,
        };
      case 'USER_INPUT':
        return { ...state, input: { ...state.input, ...action.payload }, isUpdating: true };
      default:
        return state;
    }
  };

  return { reducer, actions };
};

export interface UseFetch<T> {
  state: FetchState<T>;
  update: (data: Partial<T>) => void;
}

export const useFetch = <T>(url: RequestInfo, data: T, refreshInterval?: number): UseFetch<T> => {
  // Create and initialize reducer and actions
  const { reducer, actions } = useMemo(() => createFetchSlice<T>(), []);
  const [state, dispatch] = useReducer(reducer, { isLoading: true, isUpdating: false, data });

  // Abort controller to cancel the fetch and update
  const abortFetch = useRef(new AbortController());
  const abortUpdate = useRef(new AbortController());

  // Fetch data callback
  const fetchData = useCallback(async () => {
    abortFetch.current = new AbortController();
    dispatch(actions.FETCH());

    return fetch(url, { signal: abortFetch.current.signal })
      .then((res) => res.json())
      .then((json) => dispatch(actions.FETCH_SUCCESS(json)))
      .catch((error) => {
        if (!abortFetch.current.signal.aborted) {
          dispatch(actions.FETCH_FAILURE(error));
        }
      });
  }, [url, actions]);

  // Refresh timer
  const [startRefresh, stopRefresh] = useTimer(fetchData, refreshInterval);

  // Post the user input
  const postData = useCallback(
    (data: Partial<T>) => {
      abortUpdate.current = new AbortController();
      dispatch(actions.UPDATE(data));

      // Post the updated data
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: abortUpdate.current.signal,
      })
        .then((res) => res.json())
        .then((json) => {
          dispatch(actions.UPDATE_SUCCESS(json));
        })
        .catch((error) => {
          if (!abortUpdate.current.signal.aborted) {
            dispatch(actions.UPDATE_FAILURE(error));
          }
        })
        .finally(startRefresh);
    },
    [url, actions, startRefresh],
  );

  // Debounce the update
  const [updateDebounced] = useDebounce(postData, 300);

  // Update the user input
  const update = (newInput: Partial<T>) => {
    stopRefresh();
    abortFetch.current.abort();
    abortUpdate.current.abort();
    dispatch(actions.USER_INPUT(newInput));
    updateDebounced({ ...state.data, ...state.input, ...newInput });
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
    startRefresh();

    // Abort fetch on unload
    return () => {
      abortUpdate.current.abort();
      abortFetch.current.abort();
    };
  }, [fetchData, startRefresh]);

  return { state, update };
};
