import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Signs in a user with their email and password.
 */
export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

/**
 * Reusable login helper (alias for signIn)
 */
export async function login(email: string, password: string) {
  return await signIn(email, password);
}

/**
 * Signs out the currently authenticated user.
 */
export async function signOut() {
  const supabase = await createClient();
  return await supabase.auth.signOut();
}

/**
 * Reusable logout helper (alias for signOut)
 */
export async function logout() {
  return await signOut();
}

/**
 * Retrieves the current user's session.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    return null;
  }
  return session;
}

/**
 * Reusable getCurrentSession helper (alias for getSession)
 */
export async function getCurrentSession() {
  return await getSession();
}

/**
 * Retrieves the currently authenticated user details.
 * Securely calls getUser() to verify authentication.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }
  return user;
}

/**
 * Route Protection Helper (Server Side)
 * Redirects user to /admin/login if they are not authenticated.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

/**
 * Route Protection Helper Check
 * Returns true if an admin session is active, false otherwise.
 */
export async function isAdmin() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Reusable isAuthenticated helper (alias for isAdmin)
 */
export async function isAuthenticated() {
  return await isAdmin();
}
