/**
 * This is the universal layout loader that runs on both client and server.
 * It handles Supabase client initialization and session management.
 */

import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { LayoutLoad } from './$types'

/**
 * The universal layout load function that runs on both client and server.
 * It's responsible for:
 * 1. Setting up the Supabase client appropriately for browser or server
 * 2. Managing authentication state
 * 3. Providing the Supabase client to the rest of the application
 * 
 * @param {Object} params - The parameters object provided by SvelteKit
 * @param {Object} params.data - Data passed from the server layout loader
 * @param {Function} params.depends - Function to declare dependencies
 * @param {Function} params.fetch - The fetch function to use for requests
 * 
 * @returns {Object} An object containing:
 *   - session: The current auth session
 *   - supabase: The initialized Supabase client
 *   - user: The current user data
 */
export const load: LayoutLoad = async ({ data, depends, fetch }) => {
  // Declare a dependency on auth state
  // This ensures the layout will be re-rendered when auth state changes
  depends('supabase:auth')

  // Initialize the appropriate Supabase client based on environment
  const supabase = isBrowser()
    ? // Browser client with fetch instance
      createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
      })
    : // Server client with fetch instance and cookie handling
      createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
        global: {
          fetch,
        },
        cookies: {
          // Use cookies passed from the server layout
          getAll() {
            return data.cookies
          },
        },
      })

  // Get the current session
  // This is safe because:
  // - On client: getSession is always safe
  // - On server: session comes from safeGetSession in layout.server.ts
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the current user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Return everything needed by the app
  return { session, supabase, user }
}
