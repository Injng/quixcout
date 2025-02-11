/**
 * This is the server-side layout loader for SvelteKit.
 * It runs exclusively on the server and handles session management.
 */

import type { LayoutServerLoad } from './$types'

/**
 * The layout server load function runs on every server-side request.
 * It's responsible for:
 * 1. Getting the user's session safely from the server
 * 2. Collecting all cookies to pass to the client
 * 
 * @param {Object} params - The parameters object provided by SvelteKit
 * @param {Function} params.locals.safeGetSession - A function to safely retrieve the session
 * @param {Object} params.cookies - The cookies object from the request
 * 
 * @returns {Object} An object containing:
 *   - session: The user's session data
 *   - cookies: All cookies from the request
 */
export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  // Safely retrieve the session using the provided function
  // This is done server-side to ensure security
  const { session } = await safeGetSession()

  return {
    session,
    // Get all cookies to pass to the client-side layout
    // This is necessary for maintaining session state across client/server boundary
    cookies: cookies.getAll(),
  }
}
