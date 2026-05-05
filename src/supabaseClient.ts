import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfcucrspcyqvosfljulp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmY3VjcnNwY3lxdm9zZmxqdWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjU3MTYsImV4cCI6MjA5MzUwMTcxNn0.A-2Z0AeSmPSVz71v5BPsonLRLMIqMQDT-g1oMQQsCeE';

export const supabase = createClient(supabaseUrl, supabaseKey);
