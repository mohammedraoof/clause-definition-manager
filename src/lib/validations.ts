import { z } from "zod";

export const fieldSchema = z.object({
	key: z.string().min(1, "Field key is required"),
	label: z.string().min(1, "Field label is required"),
	type: z.enum(["Text", "Date", "Number", "Email", "Phone"]),
	isRequired: z.boolean(),
});

export const createClauseSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	chainId: z.string().min(1, "Chain ID is required"),
	templateBody: z.string().min(1, "Template body is required"),
	fields: z.array(fieldSchema).min(1, "At least one field is required"),
});

export const updateClauseSchema = createClauseSchema.partial();

export type CreateClauseFormData = z.infer<typeof createClauseSchema>;
export type UpdateClauseFormData = z.infer<typeof updateClauseSchema>;
export type FieldFormData = z.infer<typeof fieldSchema>;
