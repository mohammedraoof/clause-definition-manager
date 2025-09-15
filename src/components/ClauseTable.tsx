import {
	type Column,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Search,
	X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
	clearFilters,
	resetNonPersistedState,
	setPageIndex,
	setPageSize,
	setSearchTerm,
	setSelectedStates,
	setSorting,
} from "../store/slices/tableSlice";
import type { ClauseDefinition, ClauseState, ClauseTableProps } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Skeleton } from "./ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

const columnHelper = createColumnHelper<ClauseDefinition>();

const getStateColor = (state: string) => {
	switch (state) {
		case "Published":
			return "bg-green-100 text-green-800";
		case "Draft":
			return "bg-yellow-100 text-yellow-800";
		case "Archived":
			return "bg-gray-100 text-gray-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getSortingIcon = (column: Column<ClauseDefinition, unknown>) => {
	const sorted = column.getIsSorted();
	if (sorted === "asc") {
		return <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />;
	}
	if (sorted === "desc") {
		return <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />;
	}
	return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
};

const getSortingButtonClass = (column: Column<ClauseDefinition, unknown>) => {
	const sorted = column.getIsSorted();
	const baseClass = "h-auto p-0 font-medium hover:bg-gray-100";
	if (sorted) {
		return `${baseClass} bg-blue-50 text-blue-700`;
	}
	return baseClass;
};

export default function ClauseTable({
	clauses,
	isLoading,
	onCreateClause,
	onEditClause,
	onDeleteClause,
}: Readonly<ClauseTableProps>) {
	const dispatch = useAppDispatch();
	const { sorting, pageSize, pageIndex, searchTerm, selectedStates } =
		useAppSelector((state) => state.table);
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

	// Debounce search term
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchTerm(searchTerm);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// Reset non-persisted state on mount
	useEffect(() => {
		dispatch(resetNonPersistedState());
	}, [dispatch]);

	// Filter functions
	const handleSearchChange = useCallback(
		(value: string) => {
			dispatch(setSearchTerm(value));
		},
		[dispatch],
	);

	const handleStateFilterChange = useCallback(
		(states: string[]) => {
			dispatch(setSelectedStates(states as ClauseState[]));
		},
		[dispatch],
	);

	const handleClearFilters = useCallback(() => {
		dispatch(clearFilters());
		setDebouncedSearchTerm("");
	}, [dispatch]);

	const hasActiveFilters = searchTerm || selectedStates.length > 0;

	// Memoize filtered data to prevent unnecessary re-renders
	const filteredData = useMemo(() => {
		return clauses.filter((clause) => {
			// Apply search filter using debounced term
			const searchValue = debouncedSearchTerm.toLowerCase();
			const matchesSearch =
				!searchValue ||
				clause.title.toLowerCase().includes(searchValue) ||
				clause.description.toLowerCase().includes(searchValue) ||
				clause.chainId.toLowerCase().includes(searchValue);

			// Apply status filter
			const matchesStatus =
				selectedStates.length === 0 || selectedStates.includes(clause.state);

			return matchesSearch && matchesStatus;
		});
	}, [clauses, debouncedSearchTerm, selectedStates]);

	const columns = useMemo(
		() => [
			columnHelper.accessor("title", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className={getSortingButtonClass(column)}
					>
						Title
						{getSortingIcon(column)}
					</Button>
				),
				cell: ({ row }) => (
					<div>
						<div className="font-medium text-gray-900">
							{row.original.title}
						</div>
						<div className="text-sm text-gray-500">
							{row.original.description}
						</div>
					</div>
				),
			}),
			columnHelper.accessor("version", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className={getSortingButtonClass(column)}
					>
						Version
						{getSortingIcon(column)}
					</Button>
				),
				cell: ({ getValue }) => (
					<div className="text-sm text-gray-900">{getValue()}</div>
				),
			}),
			columnHelper.accessor("chainId", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className={getSortingButtonClass(column)}
					>
						Chain ID
						{getSortingIcon(column)}
					</Button>
				),
				cell: ({ getValue }) => (
					<div className="text-sm text-gray-900 font-mono">
						{getValue().substring(0, 8)}...
					</div>
				),
			}),
			columnHelper.accessor("state", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className={getSortingButtonClass(column)}
					>
						State
						{getSortingIcon(column)}
					</Button>
				),
				cell: ({ getValue }) => (
					<span
						className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(getValue())}`}
					>
						{getValue()}
					</span>
				),
			}),
			columnHelper.accessor("updatedAt", {
				header: ({ column }) => (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						className={getSortingButtonClass(column)}
					>
						Updated At
						{getSortingIcon(column)}
					</Button>
				),
				cell: ({ getValue }) => (
					<div className="text-sm text-gray-900">
						{new Date(getValue()).toLocaleDateString()}
					</div>
				),
			}),
			columnHelper.display({
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onEditClause(row.original)}
						>
							Edit
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onDeleteClause(row.original.id)}
						>
							Delete
						</Button>
					</div>
				),
			}),
		],
		[onEditClause, onDeleteClause],
	);

	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updaterOrValue) => {
			const newSorting =
				typeof updaterOrValue === "function"
					? updaterOrValue(sorting)
					: updaterOrValue;
			dispatch(setSorting(newSorting));
		},
		onPaginationChange: (updaterOrValue) => {
			const newPagination =
				typeof updaterOrValue === "function"
					? updaterOrValue({ pageIndex, pageSize })
					: updaterOrValue;
			dispatch(setPageIndex(newPagination.pageIndex));
			dispatch(setPageSize(newPagination.pageSize));
		},
		state: {
			sorting,
			pagination: {
				pageIndex,
				pageSize,
			},
		},
	});

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="border rounded-lg">
					<Skeleton className="h-12 w-full" />
					{Array.from({ length: 3 }, (_, i) => (
						<Skeleton
							key={`skeleton-row-${i}-${Date.now()}`}
							className="h-16 w-full border-t"
						/>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Clause Definitions</h2>
				<Button onClick={onCreateClause}>Create New Clause</Button>
			</div>

			{/* Filters */}
			<div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
				{/* Search Input */}
				<div className="flex-1">
					<Label htmlFor="search" className="sr-only">
						Search clauses
					</Label>
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							id="search"
							type="text"
							placeholder="Search by title, description, or chain ID..."
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="pl-10"
						/>
					</div>
				</div>

				{/* Status Filter */}
				<div className="sm:w-48">
					<Label htmlFor="status-filter" className="sr-only">
						Filter by status
					</Label>
					<Select
						value={selectedStates.length > 0 ? selectedStates[0] : "all"}
						onValueChange={(value) => {
							if (value === "all") {
								handleStateFilterChange([]);
							} else {
								handleStateFilterChange([value as ClauseState]);
							}
						}}
					>
						<SelectTrigger className="w-full" id="status-filter">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Statuses</SelectItem>
							<SelectItem value="Draft">Draft</SelectItem>
							<SelectItem value="Published">Published</SelectItem>
							<SelectItem value="Archived">Archived</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Clear Filters */}
				<div className="flex items-center">
					<Button
						variant="outline"
						onClick={handleClearFilters}
						className={`flex items-center gap-2 transition-opacity duration-200 ${
							hasActiveFilters ? "opacity-100" : "opacity-0 pointer-events-none"
						}`}
					>
						<X className="h-4 w-4" />
						Clear Filters
					</Button>
				</div>
			</div>

			{/* Active Filters Indicator */}
			{hasActiveFilters && (
				<div className="flex flex-wrap gap-2">
					{searchTerm && (
						<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
							Search: "{searchTerm}"
						</span>
					)}
					{selectedStates.map((state) => (
						<span
							key={state}
							className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
						>
							Status: {state}
						</span>
					))}
				</div>
			)}

			{/* Table */}
			<div className="border rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="text-left">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No clauses found. Create your first clause to get started.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Controls */}
			{filteredData.length > 0 && (
				<div className="space-y-4">
					{/* Mobile Layout - Stacked */}
					<div className="flex flex-col space-y-3 sm:hidden">
						{/* Results info */}
						<div className="text-center px-2">
							<p className="text-xs sm:text-sm text-gray-700">
								Showing {pageIndex * pageSize + 1} to{" "}
								{Math.min((pageIndex + 1) * pageSize, filteredData.length)} of{" "}
								{filteredData.length} results
							</p>
						</div>

						{/* Page info and navigation */}
						<div className="flex items-center justify-between px-2">
							<span className="text-xs sm:text-sm text-gray-700 font-medium">
								Page {pageIndex + 1} of {table.getPageCount()}
							</span>
							<div className="flex items-center space-x-1">
								<Button
									variant="outline"
									size="sm"
									onClick={() => dispatch(setPageIndex(pageIndex - 1))}
									disabled={pageIndex === 0}
									className="h-8 w-8 p-0"
								>
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Previous</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => dispatch(setPageIndex(pageIndex + 1))}
									disabled={pageIndex >= table.getPageCount() - 1}
									className="h-8 w-8 p-0"
								>
									<span className="sr-only">Next</span>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Rows per page */}
						<div className="flex items-center justify-center space-x-2 px-2">
							<p className="text-xs sm:text-sm text-gray-700">Rows per page:</p>
							<Select
								value={`${pageSize}`}
								onValueChange={(value) => {
									dispatch(setPageSize(Number(value)));
								}}
							>
								<SelectTrigger className="h-8 w-[60px] text-xs">
									<SelectValue placeholder={pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 25, 50, 100].map((pageSize) => (
										<SelectItem
											key={pageSize}
											value={`${pageSize}`}
											className="text-xs"
										>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Desktop Layout - Horizontal */}
					<div className="hidden sm:flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center space-x-2 min-w-0 flex-1">
							<p className="text-sm text-gray-700 truncate">
								Showing {pageIndex * pageSize + 1} to{" "}
								{Math.min((pageIndex + 1) * pageSize, filteredData.length)} of{" "}
								{filteredData.length} results
							</p>
						</div>
						<div className="flex items-center space-x-2 flex-shrink-0">
							<p className="text-sm text-gray-700">Rows per page:</p>
							<Select
								value={`${pageSize}`}
								onValueChange={(value) => {
									dispatch(setPageSize(Number(value)));
								}}
							>
								<SelectTrigger className="h-8 w-[70px]">
									<SelectValue placeholder={pageSize} />
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 25, 50, 100].map((pageSize) => (
										<SelectItem key={pageSize} value={`${pageSize}`}>
											{pageSize}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center space-x-2 flex-shrink-0">
							<Button
								variant="outline"
								size="sm"
								onClick={() => dispatch(setPageIndex(pageIndex - 1))}
								disabled={pageIndex === 0}
								className="hidden md:inline-flex"
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => dispatch(setPageIndex(pageIndex - 1))}
								disabled={pageIndex === 0}
								className="md:hidden h-8 w-8 p-0"
							>
								<ChevronLeft className="h-4 w-4" />
								<span className="sr-only">Previous</span>
							</Button>
							<div className="flex items-center space-x-1">
								<span className="text-sm text-gray-700">
									Page {pageIndex + 1} of {table.getPageCount()}
								</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => dispatch(setPageIndex(pageIndex + 1))}
								disabled={pageIndex >= table.getPageCount() - 1}
								className="hidden md:inline-flex"
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => dispatch(setPageIndex(pageIndex + 1))}
								disabled={pageIndex >= table.getPageCount() - 1}
								className="md:hidden h-8 w-8 p-0"
							>
								<span className="sr-only">Next</span>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
