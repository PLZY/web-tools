import { generateOGImage } from '@/lib/og-helper';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'zh';
  return generateOGImage('nav.jsonLab', lang as any);
}
