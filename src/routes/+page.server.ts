/**
 * This is the server-side page handler for the login page.
 * It handles form validation and authentication attempts.
 */

import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

/**
 * The page's server-side load function.
 * Initializes the login form with validation.
 * 
 * @returns {Object} An object containing:
 *   - form: A validated form instance using superforms
 */
export const load: PageServerLoad = async () => {
  return {
    // Initialize a new superforms instance with our Zod schema
    form: await superValidate(zod(formSchema)),
  };
};

/**
 * Server-side actions that handle form submissions.
 * Currently implements:
 * - login: Handles user login attempts
 */
export const actions: Actions = {
  /**
   * Handles the login form submission.
   * Validates the form data and attempts to authenticate the user.
   * 
   * @param {Object} event - The request event from SvelteKit
   * @returns {Object|void} 
   *   - On validation failure: Returns a 400 with form errors
   *   - On auth failure: Returns form with password error
   *   - On success: Returns nothing (redirects via Supabase)
   */
  login: async (event) => {
    // Validate the submitted form data against our schema
    const form = await superValidate(event, zod(formSchema));
    
    // If validation fails, return 400 with form errors
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    // Extract credentials from the validated form data
    const email: string = form.data.username;
    const password: string = form.data.password;
    
    // Attempt to authenticate with Supabase
    const { error } = await event.locals.supabase.auth.signInWithPassword({ 
      email, 
      password 
    })

    // If authentication fails, set an error on the password field
    if (error) {
      return setError(form, 'password', "Username or password is incorrect.");
    }

    // On success, Supabase will handle the redirect
  },
};
