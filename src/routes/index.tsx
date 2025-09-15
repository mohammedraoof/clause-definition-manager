import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ClauseForm from "../components/ClauseForm";
import ClauseTable from "../components/ClauseTable";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../components/ui/dialog";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
	createClauseAsync,
	deleteClauseAsync,
	fetchClauses,
	updateClauseAsync,
} from "../store/actions/clausesActions";
import type {
	ClauseDefinition,
	CreateClauseRequest,
	UpdateClauseRequest,
} from "../types";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	const dispatch = useAppDispatch();
	const { items: clauses, isLoading } = useAppSelector(
		(state) => state.clauses,
	);

	// Only show loading for initial fetch, not for optimistic operations
	const isInitialLoading = isLoading && clauses.length === 0;
	const [showForm, setShowForm] = useState(false);
	const [editingClause, setEditingClause] = useState<
		ClauseDefinition | undefined
	>();

	// Load clauses on mount (only if no clauses exist)
	useEffect(() => {
		if (clauses.length === 0) {
			dispatch(fetchClauses());
		}
	}, [dispatch, clauses.length]);

	const handleCreateClause = () => {
		setEditingClause(undefined);
		setShowForm(true);
	};

	const handleEditClause = (clause: ClauseDefinition) => {
		setEditingClause(clause);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingClause(undefined);
	};

	const handleSaveClause = async (
		data: CreateClauseRequest | UpdateClauseRequest,
	) => {
		try {
			if (editingClause) {
				const result = await dispatch(
					updateClauseAsync({
						id: editingClause.id,
						data: data as UpdateClauseRequest,
					}),
				);
				if (updateClauseAsync.fulfilled.match(result)) {
					toast.success("Clause updated successfully");
				} else {
					toast.error("Failed to update clause");
				}
			} else {
				const result = await dispatch(
					createClauseAsync(data as CreateClauseRequest),
				);
				if (createClauseAsync.fulfilled.match(result)) {
					toast.success("Clause created successfully");
				} else {
					toast.error("Failed to create clause");
				}
			}
			handleCloseForm();
		} catch (error) {
			console.error("Failed to save clause:", error);
			toast.error("Failed to save clause");
		}
	};

	const handleDeleteClause = async (id: string) => {
		if (confirm("Are you sure you want to delete this clause?")) {
			try {
				const result = await dispatch(deleteClauseAsync(id));
				if (deleteClauseAsync.fulfilled.match(result)) {
					toast.success("Clause deleted successfully");
				} else {
					toast.error("Failed to delete clause");
				}
			} catch (error) {
				console.error("Failed to delete clause:", error);
				toast.error("Failed to delete clause");
			}
		}
	};

	return (
		<div className="container mx-auto">
			<ClauseTable
				clauses={clauses}
				isLoading={isInitialLoading}
				onCreateClause={handleCreateClause}
				onEditClause={handleEditClause}
				onDeleteClause={handleDeleteClause}
			/>

			<Dialog open={showForm} onOpenChange={setShowForm}>
				<DialogContent className="md:max-w-full md:min-w-4xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingClause ? "Edit Clause" : "Create New Clause"}
						</DialogTitle>
					</DialogHeader>
					<ClauseForm
						clause={editingClause}
						onClose={handleCloseForm}
						onSave={handleSaveClause}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}
