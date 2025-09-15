export type FieldType = "Text" | "Date" | "Number" | "Email" | "Phone";

export type ClauseState = "Draft" | "Published" | "Archived";

export interface Field {
	id: string;
	clauseId: string;
	order: number;
	key: string;
	label: string;
	type: FieldType;
	isRequired: boolean;
}

export interface ClauseDefinition {
	id: string;
	title: string;
	description: string;
	version: number;
	chainId: string;
	state: ClauseState;
	updatedAt: string;
	templateBody: string;
	fields: Field[];
}

export interface CreateClauseRequest {
	title: string;
	description: string;
	chainId: string;
	templateBody: string;
	fields: Omit<Field, "id" | "clauseId">[];
}

export interface UpdateClauseRequest {
	id: string;
	data: {
		title?: string;
		description?: string;
		state?: ClauseState;
		templateBody?: string;
		fields?: Omit<Field, "id" | "clauseId">[];
	};
}

export interface ApiResponse<T> {
	data: T;
	success: boolean;
	message?: string;
}

export interface ApiError {
	success: false;
	message: string;
	code?: string;
}
