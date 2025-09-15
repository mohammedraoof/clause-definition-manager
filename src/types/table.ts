import type { ClauseDefinition, ClauseState } from "./clause";

export interface ClauseTableProps {
	readonly clauses: ClauseDefinition[];
	readonly isLoading: boolean;
	readonly onCreateClause: () => void;
	readonly onEditClause: (clause: ClauseDefinition) => void;
	readonly onDeleteClause: (id: string) => void;
}

export interface FilterState {
	readonly searchTerm: string;
	readonly selectedStates: ClauseState[];
}

export interface PaginationConfig {
	readonly pageSize: number;
	readonly pageIndex: number;
}

export interface TableState {
	readonly sorting: string[];
	readonly pagination: PaginationConfig;
}
