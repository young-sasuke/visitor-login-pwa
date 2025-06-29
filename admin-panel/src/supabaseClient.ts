import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://thvniwudmtdmfvaaowfy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodm5pd3VkbXRkbWZ2YWFvd2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNjIxMDcsImV4cCI6MjA2NTYzODEwN30.Hw-ExNLa3p2QgsQrCnf8i3dbYTQ4kTkJt748I41Lmw8";

export const supabase = createClient(supabaseUrl, supabaseKey);
