import { createClient } from '@supabase/supabase-js';
import { env } from '../constants';

const supabaseUrl = env.SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY || import.meta.env.VITE_SUPABASE_SERVICE_KEY;

export const service = createClient(supabaseUrl, supabaseServiceKey);