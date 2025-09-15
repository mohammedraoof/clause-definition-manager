import type {
	ClauseDefinition,
	CreateClauseRequest,
	UpdateClauseRequest,
} from "../types";

// Simple in-memory store
const clauses: ClauseDefinition[] = [
	{
		id: "8f14e45f-ea02-4b5c-9d3a-123456789001",
		title: "Non-Disclosure Agreement",
		description: "Confidentiality obligations for both parties.",
		version: 1,
		chainId: "11111111-1111-1111-1111-111111111111",
		state: "Draft",
		updatedAt: "2025-08-01T10:30:00Z",
		templateBody:
			"This NDA is made between @PartyA and @PartyB effective @EffectiveDate.",
		fields: [
			{
				id: "a1111111-1111-1111-1111-111111111111",
				clauseId: "8f14e45f-ea02-4b5c-9d3a-123456789001",
				order: 1,
				key: "PartyA",
				label: "First Party Name",
				type: "Text",
				isRequired: true,
			},
			{
				id: "a2222222-2222-2222-2222-222222222222",
				clauseId: "8f14e45f-ea02-4b5c-9d3a-123456789001",
				order: 2,
				key: "PartyB",
				label: "Second Party Name",
				type: "Text",
				isRequired: true,
			},
			{
				id: "a3333333-3333-3333-3333-333333333333",
				clauseId: "8f14e45f-ea02-4b5c-9d3a-123456789001",
				order: 3,
				key: "EffectiveDate",
				label: "Effective Date",
				type: "Date",
				isRequired: true,
			},
		],
	},
	{
		id: "9f14e45f-ea02-4b5c-9d3a-123456789002",
		title: "Employment Contract",
		description: "Standard employee agreement with company.",
		version: 3,
		chainId: "22222222-2222-2222-2222-222222222222",
		state: "Published",
		updatedAt: "2025-07-15T14:10:00Z",
		templateBody:
			"Employee @EmployeeName will join on @StartDate with salary @Salary SAR/month.",
		fields: [
			{
				id: "b1111111-1111-1111-1111-111111111111",
				clauseId: "9f14e45f-ea02-4b5c-9d3a-123456789002",
				order: 1,
				key: "EmployeeName",
				label: "Employee Full Name",
				type: "Text",
				isRequired: true,
			},
			{
				id: "b2222222-2222-2222-2222-222222222222",
				clauseId: "9f14e45f-ea02-4b5c-9d3a-123456789002",
				order: 2,
				key: "StartDate",
				label: "Start Date",
				type: "Date",
				isRequired: true,
			},
			{
				id: "b3333333-3333-3333-3333-333333333333",
				clauseId: "9f14e45f-ea02-4b5c-9d3a-123456789002",
				order: 3,
				key: "Salary",
				label: "Monthly Salary",
				type: "Number",
				isRequired: true,
			},
		],
	},
];

// Simple store functions
export function getAllClauses(): ClauseDefinition[] {
	return [...clauses];
}

export function getClauseById(id: string): ClauseDefinition | undefined {
	return clauses.find((clause) => clause.id === id);
}

export function createClause(data: CreateClauseRequest): ClauseDefinition {
	const id = crypto.randomUUID();
	const now = new Date().toISOString();

	const newClause: ClauseDefinition = {
		id,
		version: 1,
		state: "Draft",
		updatedAt: now,
		...data,
		fields: data.fields.map((field, index) => ({
			...field,
			id: crypto.randomUUID(),
			clauseId: id,
			order: index + 1,
		})),
	};

	clauses.push(newClause);
	return newClause;
}

export function updateClause(
	id: string,
	data: UpdateClauseRequest,
): ClauseDefinition | undefined {
	const index = clauses.findIndex((clause) => clause.id === id);
	if (index === -1) return undefined;

	const existingClause = clauses[index];
	const now = new Date().toISOString();

	const updatedClause: ClauseDefinition = {
		...existingClause,
		...data.data,
		version: data.data.fields
			? existingClause.version + 1
			: existingClause.version,
		updatedAt: now,
		fields: data.data.fields
			? data.data.fields.map((field, fieldIndex) => ({
					...field,
					id: crypto.randomUUID(),
					clauseId: id,
					order: fieldIndex + 1,
				}))
			: existingClause.fields,
	};

	clauses[index] = updatedClause;
	return updatedClause;
}

export function deleteClause(id: string): boolean {
	const index = clauses.findIndex((clause) => clause.id === id);
	if (index === -1) return false;

	clauses.splice(index, 1);
	return true;
}
