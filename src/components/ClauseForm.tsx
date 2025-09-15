import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import {
	type CreateClauseFormData,
	createClauseSchema,
} from "../lib/validations";
import type {
	ClauseDefinition,
	CreateClauseRequest,
	FieldType,
	UpdateClauseRequest,
} from "../types";
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
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface ClauseFormProps {
	readonly clause?: ClauseDefinition;
	readonly onClose: () => void;
	readonly onSave: (data: CreateClauseRequest | UpdateClauseRequest) => void;
}

export default function ClauseForm({
	clause,
	onClose,
	onSave,
}: ClauseFormProps) {
	const isEditing = !!clause;

	const form = useForm<CreateClauseFormData>({
		resolver: zodResolver(createClauseSchema),
		defaultValues: {
			title: clause?.title || "",
			description: clause?.description || "",
			chainId: clause?.chainId || "",
			templateBody: clause?.templateBody || "",
			fields: clause?.fields.map((f) => ({
				key: f.key,
				label: f.label,
				type: f.type,
				isRequired: f.isRequired,
			})) || [
				{
					key: "",
					label: "",
					type: "Text",
					isRequired: false,
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "fields",
	});

	const onSubmit = async (data: CreateClauseFormData) => {
		try {
			// Add order to fields
			const fieldsWithOrder = data.fields.map((field, index) => ({
				...field,
				order: index + 1,
			}));

			const formData = {
				...data,
				fields: fieldsWithOrder,
			};

			if (isEditing) {
				onSave({ id: clause.id, data: formData });
			} else {
				onSave(formData);
			}
		} catch (error) {
			console.error("Failed to save clause:", error);
		}
	};

	const addField = () => {
		append({
			key: "",
			label: "",
			type: "Text",
			isRequired: false,
		});
	};

	const isLoading = false;
	const getButtonText = () => {
		if (isLoading) return "Saving...";
		return isEditing ? "Update" : "Create";
	};
	const buttonText = getButtonText();

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<Label htmlFor="title" className="text-sm font-medium mb-2 block">
						Title *
					</Label>
					<Input
						id="title"
						{...form.register("title")}
						placeholder="Enter clause title"
						className={form.formState.errors.title ? "border-red-500" : ""}
					/>
					{form.formState.errors.title && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.title.message}
						</p>
					)}
				</div>

				<div>
					<Label htmlFor="chainId" className="text-sm font-medium mb-2 block">
						Chain ID *
					</Label>
					<Input
						id="chainId"
						{...form.register("chainId")}
						placeholder="Enter chain ID"
						className={form.formState.errors.chainId ? "border-red-500" : ""}
					/>
					{form.formState.errors.chainId && (
						<p className="text-red-500 text-sm mt-1">
							{form.formState.errors.chainId.message}
						</p>
					)}
				</div>
			</div>

			<div>
				<Label htmlFor="description" className="text-sm font-medium mb-2 block">
					Description *
				</Label>
				<Input
					id="description"
					{...form.register("description")}
					placeholder="Enter clause description"
					className={form.formState.errors.description ? "border-red-500" : ""}
				/>
				{form.formState.errors.description && (
					<p className="text-red-500 text-sm mt-1">
						{form.formState.errors.description.message}
					</p>
				)}
			</div>

			<div>
				<Label
					htmlFor="templateBody"
					className="text-sm font-medium mb-2 block"
				>
					Template Body *
				</Label>
				<Textarea
					id="templateBody"
					{...form.register("templateBody")}
					placeholder="Enter template body (use @FieldName for placeholders)"
					className={form.formState.errors.templateBody ? "border-red-500" : ""}
					rows={4}
				/>
				{form.formState.errors.templateBody && (
					<p className="text-red-500 text-sm mt-1">
						{form.formState.errors.templateBody.message}
					</p>
				)}
			</div>

			<Separator />

			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="text-base font-semibold">Fields</h3>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									type="button"
									onClick={addField}
									size="icon"
									variant="outline"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Add Field</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>

				<div className="space-y-4">
					{fields.map((field, index) => (
						<div
							key={field.id}
							className="rounded-xl border bg-white/70 backdrop-blur p-4 shadow-sm"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
								<div className="md:col-span-1">
									<Label
										htmlFor={`field-${index}-key`}
										className="text-sm font-medium mb-2 block"
									>
										Key *
									</Label>
									<Input
										id={`field-${index}-key`}
										{...form.register(`fields.${index}.key`)}
										placeholder="Field key (e.g., PartyA)"
										className={
											form.formState.errors.fields?.[index]?.key
												? "border-red-500"
												: ""
										}
									/>
									{form.formState.errors.fields?.[index]?.key && (
										<p className="text-red-500 text-xs mt-1">
											{form.formState.errors.fields[index]?.key?.message}
										</p>
									)}
								</div>
								<div className="md:col-span-1">
									<Label
										htmlFor={`field-${index}-label`}
										className="text-sm font-medium mb-2 block"
									>
										Label *
									</Label>
									<Input
										id={`field-${index}-label`}
										{...form.register(`fields.${index}.label`)}
										placeholder="Field label"
										className={
											form.formState.errors.fields?.[index]?.label
												? "border-red-500"
												: ""
										}
									/>
									{form.formState.errors.fields?.[index]?.label && (
										<p className="text-red-500 text-xs mt-1">
											{form.formState.errors.fields[index]?.label?.message}
										</p>
									)}
								</div>
								<div className="md:col-span-1">
									<Label
										htmlFor={`field-${index}-type`}
										className="text-sm font-medium mb-2 block"
									>
										Type
									</Label>
									<Select
										value={form.watch(`fields.${index}.type`)}
										onValueChange={(value) =>
											form.setValue(`fields.${index}.type`, value as FieldType)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Text">Text</SelectItem>
											<SelectItem value="Date">Date</SelectItem>
											<SelectItem value="Number">Number</SelectItem>
											<SelectItem value="Email">Email</SelectItem>
											<SelectItem value="Phone">Phone</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className="md:col-span-1 flex items-end justify-between">
									<div className="flex items-center gap-3">
										<Switch
											id={`field-${index}-required`}
											checked={form.watch(`fields.${index}.isRequired`)}
											onCheckedChange={(checked) =>
												form.setValue(`fields.${index}.isRequired`, !!checked)
											}
										/>
										<Label
											htmlFor={`field-${index}-required`}
											className="text-sm font-medium cursor-pointer"
										>
											Required
										</Label>
									</div>
									<Button
										type="button"
										onClick={() => fields.length > 1 && remove(index)}
										variant="ghost"
										size="icon"
										className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:pointer-events-none"
										disabled={fields.length === 1}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex justify-end gap-2 pt-4">
				<Button type="button" variant="outline" onClick={onClose}>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading}>
					{buttonText}
				</Button>
			</div>
		</form>
	);
}
