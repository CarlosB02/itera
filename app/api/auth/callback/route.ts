import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = createAdminClient();
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if user exists in custom table
            let { data: userRecord } = await supabase
                .from('user')
                .select('*')
                .eq('id', data.user.id)
                .single();

            // Auto-create with 0 credits if new
            if (!userRecord) {
                await supabase.from('user').insert({
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata?.full_name || '',
                    image: data.user.user_metadata?.avatar_url || '',
                    emailVerified: true,
                    credits: 0
                });
            }

            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
