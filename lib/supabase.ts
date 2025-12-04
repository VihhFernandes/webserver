import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://ffyxbfdnyqwrmlsmpvvl.supabase.co';
const SupabaseAnonKey = 'sb_publishable_PwhUOO2D520qjpE9OMP2Tw_AyWTLcCo';

export const supabase = createClient(supabaseURL, SupabaseAnonKey);