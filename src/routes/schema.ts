/**
 * This file defines the validation schema for the login form.
 * It uses Zod for type-safe runtime validation.
 */

import { z } from "zod";

/**
 * Validation schema for the login form.
 * Defines the shape and constraints of the form data:
 * - username: String with max length of 50 chars (used as email)
 * - password: String with max length of 50 chars
 */
export const formSchema = z.object({
  username: z.string().max(50),
  password: z.string().max(50),
});

/**
 * TypeScript type generated from the schema.
 * Can be used for type-safe access to form data.
 */
export type FormSchema = typeof formSchema;
