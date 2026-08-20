export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * The production project uses generated Supabase database types.
 * This public portfolio snapshot intentionally omits the production schema.
 * Regenerate this file against your own development Supabase project when running locally.
 */
export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
