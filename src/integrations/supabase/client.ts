// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gvybbofjsvqxebnbameb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eWJib2Zqc3ZxeGVibmJhbWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5Mzc1NTIsImV4cCI6MjA2NDUxMzU1Mn0.kVXxvvrbm0J8jxCMBNwylrMQGVhWJ4dsTB2lO3p09X4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);