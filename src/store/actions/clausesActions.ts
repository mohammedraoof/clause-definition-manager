import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	createClauseService,
	deleteClauseService,
	fetchClauseById as fetchClauseByIdService,
	fetchClauses as fetchClausesService,
	updateClauseService,
} from "../../services/clausesService";
import type {
	ClauseDefinition,
	CreateClauseRequest,
	UpdateClauseRequest,
} from "../../types";
import {
	addClauseOptimistic,
	removeClauseOptimistic,
	rollbackAddClause,
	rollbackRemoveClause,
	rollbackUpdateClause,
	updateClauseOptimistic,
} from "../slices/clausesSlice";

// Async thunks for API calls
export const fetchClauses = createAsyncThunk(
	"clauses/fetchClauses",
	async (_, { rejectWithValue }) => {
		try {
			const clauses = await fetchClausesService();
			return clauses;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : "Failed to fetch clauses",
			);
		}
	},
);

export const fetchClauseById = createAsyncThunk(
	"clauses/fetchClauseById",
	async (id: string, { rejectWithValue }) => {
		try {
			const clause = await fetchClauseByIdService(id);
			return clause;
		} catch (error) {
			return rejectWithValue(
				error instanceof Error ? error.message : "Failed to fetch clause",
			);
		}
	},
);

export const createClauseAsync = createAsyncThunk(
	"clauses/createClause",
	async (data: CreateClauseRequest, { dispatch, rejectWithValue }) => {
		// Generate a temporary ID for optimistic update
		const tempId = `temp-${Date.now()}`;
		const optimisticClause = {
			...data,
			id: tempId,
			version: 1,
			state: "Draft" as const,
			updatedAt: new Date().toISOString(),
		};

		// Dispatch optimistic update immediately
		dispatch(addClauseOptimistic(optimisticClause));

		try {
			const newClause = await createClauseService(data);
			// Replace the optimistic clause with the real one
			dispatch(updateClauseOptimistic(newClause));
			return newClause;
		} catch (error) {
			// Rollback the optimistic update on failure
			dispatch(rollbackAddClause(tempId));
			return rejectWithValue(
				error instanceof Error ? error.message : "Failed to create clause",
			);
		}
	},
);

export const updateClauseAsync = createAsyncThunk(
	"clauses/updateClause",
	async (
		{ id, data }: { id: string; data: UpdateClauseRequest },
		{ dispatch, getState, rejectWithValue },
	) => {
		// Get current state to find the clause being updated
		const state = getState() as { clauses: { items: ClauseDefinition[] } };
		const currentClause = state.clauses.items.find(
			(clause) => clause.id === id,
		);

		if (!currentClause) {
			return rejectWithValue("Clause not found");
		}

		// Create optimistic update
		const optimisticClause = {
			...currentClause,
			...data,
			updatedAt: new Date().toISOString(),
		};

		// Dispatch optimistic update immediately
		dispatch(updateClauseOptimistic(optimisticClause));

		try {
			const updatedClause = await updateClauseService(id, data);
			// Replace with real data from server
			dispatch(updateClauseOptimistic(updatedClause));
			return updatedClause;
		} catch (error) {
			// Rollback to original clause on failure
			dispatch(rollbackUpdateClause(currentClause));
			return rejectWithValue(
				error instanceof Error ? error.message : "Failed to update clause",
			);
		}
	},
);

export const deleteClauseAsync = createAsyncThunk(
	"clauses/deleteClause",
	async (id: string, { dispatch, getState, rejectWithValue }) => {
		// Get current state to find the clause being deleted
		const state = getState() as { clauses: { items: ClauseDefinition[] } };
		const clauseToDelete = state.clauses.items.find(
			(clause) => clause.id === id,
		);

		if (!clauseToDelete) {
			return rejectWithValue("Clause not found");
		}

		// Dispatch optimistic update immediately
		dispatch(removeClauseOptimistic(id));

		try {
			await deleteClauseService(id);
			return id;
		} catch (error) {
			// Rollback by adding the clause back on failure
			dispatch(rollbackRemoveClause(clauseToDelete));
			return rejectWithValue(
				error instanceof Error ? error.message : "Failed to delete clause",
			);
		}
	},
);
