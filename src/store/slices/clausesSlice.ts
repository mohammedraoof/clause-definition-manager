import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { ClauseDefinition } from "../../types";
import {
	createClauseAsync,
	deleteClauseAsync,
	fetchClauseById,
	fetchClauses,
	updateClauseAsync,
} from "../actions/clausesActions";

interface ClausesState {
	items: ClauseDefinition[];
	isLoading: boolean;
	error: string | null;
	selectedClause: ClauseDefinition | null;
}

const initialState: ClausesState = {
	items: [],
	isLoading: false,
	error: null,
	selectedClause: null,
};

const clausesSlice = createSlice({
	name: "clauses",
	initialState,
	reducers: {
		setSelectedClause: (
			state,
			action: PayloadAction<ClauseDefinition | null>,
		) => {
			state.selectedClause = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
		// Optimistic update actions
		addClauseOptimistic: (state, action: PayloadAction<ClauseDefinition>) => {
			state.items.unshift(action.payload); // Add to beginning of array
		},
		updateClauseOptimistic: (
			state,
			action: PayloadAction<ClauseDefinition>,
		) => {
			const index = state.items.findIndex(
				(clause) => clause.id === action.payload.id,
			);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
			if (state.selectedClause?.id === action.payload.id) {
				state.selectedClause = action.payload;
			}
		},
		removeClauseOptimistic: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(
				(clause) => clause.id !== action.payload,
			);
			if (state.selectedClause?.id === action.payload) {
				state.selectedClause = null;
			}
		},
		// Rollback actions for failed optimistic updates
		rollbackAddClause: (state, action: PayloadAction<string>) => {
			state.items = state.items.filter(
				(clause) => clause.id !== action.payload,
			);
		},
		rollbackUpdateClause: (state, action: PayloadAction<ClauseDefinition>) => {
			const index = state.items.findIndex(
				(clause) => clause.id === action.payload.id,
			);
			if (index !== -1) {
				state.items[index] = action.payload;
			}
			if (state.selectedClause?.id === action.payload.id) {
				state.selectedClause = action.payload;
			}
		},
		rollbackRemoveClause: (state, action: PayloadAction<ClauseDefinition>) => {
			state.items.unshift(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch clauses
			.addCase(fetchClauses.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchClauses.fulfilled, (state, action) => {
				state.isLoading = false;
				state.items = action.payload;
			})
			.addCase(fetchClauses.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			// Fetch clause by ID
			.addCase(fetchClauseById.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchClauseById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.selectedClause = action.payload;
			})
			.addCase(fetchClauseById.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			// Create clause - no loading state needed for optimistic updates
			.addCase(createClauseAsync.pending, (state) => {
				state.error = null;
			})
			.addCase(createClauseAsync.fulfilled, (state) => {
				// No need to add to items since optimistic update already handled it
				state.error = null;
			})
			.addCase(createClauseAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			})
			// Update clause - no loading state needed for optimistic updates
			.addCase(updateClauseAsync.pending, (state) => {
				state.error = null;
			})
			.addCase(updateClauseAsync.fulfilled, (state) => {
				// No need to update items since optimistic update already handled it
				state.error = null;
			})
			.addCase(updateClauseAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			})
			// Delete clause - no loading state needed for optimistic updates
			.addCase(deleteClauseAsync.pending, (state) => {
				state.error = null;
			})
			.addCase(deleteClauseAsync.fulfilled, (state) => {
				// No need to remove from items since optimistic update already handled it
				state.error = null;
			})
			.addCase(deleteClauseAsync.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const {
	setSelectedClause,
	clearError,
	addClauseOptimistic,
	updateClauseOptimistic,
	removeClauseOptimistic,
	rollbackAddClause,
	rollbackUpdateClause,
	rollbackRemoveClause,
} = clausesSlice.actions;
export default clausesSlice.reducer;
