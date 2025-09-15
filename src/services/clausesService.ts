import {
	createClause,
	deleteClause,
	getAllClauses,
	getClauseById,
	updateClause,
} from "../lib/store";
import type {
	ClauseDefinition,
	CreateClauseRequest,
	UpdateClauseRequest,
} from "../types";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch all clauses with simulated API delay
 */
export async function fetchClauses(): Promise<ClauseDefinition[]> {
	await delay(500);
	return getAllClauses();
}

/**
 * Fetch a single clause by ID
 */
export async function fetchClauseById(id: string): Promise<ClauseDefinition> {
	await delay(200);
	const clause = getClauseById(id);
	if (!clause) {
		throw new Error("Clause not found");
	}
	return clause;
}

/**
 * Create a new clause
 */
export async function createClauseService(
	data: CreateClauseRequest,
): Promise<ClauseDefinition> {
	await delay(300);
	return createClause(data);
}

/**
 * Update an existing clause
 */
export async function updateClauseService(
	id: string,
	data: UpdateClauseRequest,
): Promise<ClauseDefinition> {
	await delay(300);
	const updatedClause = updateClause(id, data);
	if (!updatedClause) {
		throw new Error("Clause not found");
	}
	return updatedClause;
}

/**
 * Delete a clause
 */
export async function deleteClauseService(id: string): Promise<void> {
	await delay(200);
	const success = deleteClause(id);
	if (!success) {
		throw new Error("Clause not found");
	}
}
