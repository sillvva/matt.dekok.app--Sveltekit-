import { existsSync } from "fs";
import path from "path";
import { createClient } from '@supabase/supabase-js';
import { env } from '../constants';

const supabaseUrl = env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getContentDir = () => {
  // Local directory
  let dirPath = path.join(process.cwd(), 'src/content');
  // Vercel directory, because the cwd() directory is read-only
  if (!existsSync(dirPath) && existsSync('/tmp')) dirPath = '/tmp';
  return dirPath;
}