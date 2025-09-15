import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ClauseState } from "../../types";

interface TableState {
	// Persisted state
	sorting: Array<{ id: string; desc: boolean }>;
	pageSize: number;

	// Non-persisted state (always reset to defaults)
	pageIndex: number;
	searchTerm: string;
	selectedStates: ClauseState[];
}

const initialState: TableState = {
	// Persisted state
	sorting: [],
	pageSize: 10,

	// Non-persisted state
	pageIndex: 0,
	searchTerm: "",
	selectedStates: [],
};

const tableSlice = createSlice({
	name: "table",
	initialState,
	reducers: {
		// Sorting actions
		setSorting: (
			state,
			action: PayloadAction<Array<{ id: string; desc: boolean }>>,
		) => {
			state.sorting = action.payload;
		},
		clearSorting: (state) => {
			state.sorting = [];
		},

		// Pagination actions
		setPageSize: (state, action: PayloadAction<number>) => {
			state.pageSize = action.payload;
			state.pageIndex = 0; // Reset to first page when page size changes
		},
		setPageIndex: (state, action: PayloadAction<number>) => {
			state.pageIndex = action.payload;
		},
		resetPagination: (state) => {
			state.pageIndex = 0;
		},

		// Filter actions (non-persisted)
		setSearchTerm: (state, action: PayloadAction<string>) => {
			state.searchTerm = action.payload;
			state.pageIndex = 0; // Reset to first page when search changes
		},
		setSelectedStates: (state, action: PayloadAction<ClauseState[]>) => {
			state.selectedStates = action.payload;
			state.pageIndex = 0; // Reset to first page when filters change
		},
		clearFilters: (state) => {
			state.searchTerm = "";
			state.selectedStates = [];
			state.pageIndex = 0;
		},

		// Reset all non-persisted state
		resetNonPersistedState: (state) => {
			state.pageIndex = 0;
			state.searchTerm = "";
			state.selectedStates = [];
		},
	},
});

export const {
	setSorting,
	clearSorting,
	setPageSize,
	setPageIndex,
	resetPagination,
	setSearchTerm,
	setSelectedStates,
	clearFilters,
	resetNonPersistedState,
} = tableSlice.actions;

export default tableSlice.reducer;
