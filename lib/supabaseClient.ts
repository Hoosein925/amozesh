import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ziehnpkoveeuzvfneokc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZWhucGtvdmVldXp2Zm5lb2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODE0NjQsImV4cCI6MjA3NTk1NzQ2NH0.B1KlaebpyHalfPiw_wNo4H_J1U82nAYgNaWnmOlHvrs'

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and anonymous key are required.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
