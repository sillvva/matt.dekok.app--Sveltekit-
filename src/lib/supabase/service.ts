import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const envSchema = z.object({
	SUPABASE_SERVICE_KEY: z.string(),
  SUPABASE_URL: z.string().url(),
});

const envCheck = envSchema.safeParse({
	SUPABASE_SERVICE_KEY: process.env.VITE_SUPABASE_SERVICE_KEY ?? import.meta.env.VITE_SUPABASE_SERVICE_KEY,
  SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL,
});

if (!envCheck.success) {
	console.error(
		'❌ Invalid environment variables:',
		JSON.stringify(envCheck.error.format(), null, 4)
	);
	process.exit(1);
}

const supabaseUrl = envCheck.data.SUPABASE_URL;
const supabaseServiceKey = envCheck.data.SUPABASE_SERVICE_KEY;

export const service = createClient(supabaseUrl, supabaseServiceKey);