import fs from 'fs';
import path from 'path';

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const courseSlug = url.searchParams.get('course');
  const format = url.searchParams.get('format') || 'markdown'; // markdown, pdf, code

  if (!courseSlug) {
    return new Response(JSON.stringify({ error: 'Missing course slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      'public',
      'courses',
      `${courseSlug}.${format === 'markdown' ? 'md' : format}`
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new Response(
        JSON.stringify({ error: 'Course material not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Read file
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileSize = Buffer.byteLength(fileContent);

    // Determine content type
    const contentTypes: Record<string, string> = {
      markdown: 'text/markdown; charset=utf-8',
      pdf: 'application/pdf',
      code: 'text/plain; charset=utf-8',
    };

    return new Response(fileContent, {
      status: 200,
      headers: {
        'Content-Type': contentTypes[format] || 'application/octet-stream',
        'Content-Length': fileSize.toString(),
        'Content-Disposition': `attachment; filename="${courseSlug}-guide.${format === 'markdown' ? 'md' : format}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    console.error('Download error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to download course material',
        message: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
