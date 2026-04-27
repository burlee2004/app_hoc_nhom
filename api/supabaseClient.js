import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://krelfrgskjrgbxwuobtb.supabase.co'; // your supabase url
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZWxmcmdza2pyZ2J4d3VvYnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1OTI4MDksImV4cCI6MjA1NTE2ODgwOX0.5HPrTckrMB3xPbezMx8_BeoW1-gJqV7dXzvOez6IS68'; // your supabase key

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);