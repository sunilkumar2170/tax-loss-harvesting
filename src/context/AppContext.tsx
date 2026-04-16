import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CapitalGains, Holding, SortColumn, SortOrder } from '../types';
import { fetchCapitalGains, fetchHoldings } from '../api';
import { applyHarvesting, sortHoldings } from '../utils';

interface State {
  baseCapitalGains: CapitalGains | null;
  afterCapitalGains: CapitalGains | null;
  holdings: Holding[];
  selectedIds: Set<string>;
  loading: { gains: boolean; holdings: boolean };
  error: string | null;
  sortColumn: SortColumn;
  sortOrder: SortOrder;
  showAll: boolean;
}

type Action =
  | { type: 'SET_GAINS'; payload: CapitalGains }
  | { type: 'SET_HOLDINGS'; payload: Holding[] }
  | { type: 'TOGGLE_SELECT'; id: string }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_SORT'; column: SortColumn; order: SortOrder }
  | { type: 'SET_LOADING'; key: 'gains' | 'holdings'; value: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'TOGGLE_SHOW_ALL' };

const holdingId = (h: Holding, i: number) => `${h.coin}-${i}`;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_GAINS':
      return {
        ...state,
        baseCapitalGains: action.payload,
        afterCapitalGains: action.payload,
        loading: { ...state.loading, gains: false },
      };
    case 'SET_HOLDINGS':
      return {
        ...state,
        holdings: action.payload,
        selectedIds: new Set(), // ensure nothing is pre-selected
        loading: { ...state.loading, holdings: false },
      };
    case 'TOGGLE_SELECT': {
      const next = new Set(state.selectedIds);
      if (next.has(action.id)) next.delete(action.id);
      else next.add(action.id);
      const selectedHoldings = state.holdings.filter((h, i) =>
        next.has(holdingId(h, i))
      );
      const after = state.baseCapitalGains
        ? applyHarvesting(state.baseCapitalGains, selectedHoldings)
        : null;
      return { ...state, selectedIds: next, afterCapitalGains: after };
    }
    case 'SELECT_ALL': {
      const allIds = new Set(state.holdings.map((h, i) => holdingId(h, i)));
      const after = state.baseCapitalGains
        ? applyHarvesting(state.baseCapitalGains, state.holdings)
        : null;
      return { ...state, selectedIds: allIds, afterCapitalGains: after };
    }
    case 'DESELECT_ALL':
      return {
        ...state,
        selectedIds: new Set(),
        afterCapitalGains: state.baseCapitalGains,
      };
    case 'SET_SORT': {
      const sorted = action.column
        ? sortHoldings(state.holdings, action.column, action.order)
        : state.holdings;
      return {
        ...state,
        holdings: sorted,
        sortColumn: action.column,
        sortOrder: action.order,
      };
    }
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'TOGGLE_SHOW_ALL':
      return { ...state, showAll: !state.showAll };
    default:
      return state;
  }
}

const initialState: State = {
  baseCapitalGains: null,
  afterCapitalGains: null,
  holdings: [],
  selectedIds: new Set(),
  loading: { gains: true, holdings: true },
  error: null,
  sortColumn: null,
  sortOrder: 'desc',
  showAll: false,
};

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  holdingId: (h: Holding, i: number) => string;
}

const AppContext = createContext<ContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchCapitalGains()
      .then(res => dispatch({ type: 'SET_GAINS', payload: res.capitalGains }))
      .catch(() => dispatch({ type: 'SET_ERROR', error: 'Failed to load capital gains.' }));

    fetchHoldings()
      .then(data => dispatch({ type: 'SET_HOLDINGS', payload: data }))
      .catch(() => dispatch({ type: 'SET_ERROR', error: 'Failed to load holdings.' }));
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, holdingId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
