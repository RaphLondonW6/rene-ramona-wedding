import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/cloudflare'

export const runtime = 'edge'

// Admin-only delete for "oops, wrong photo" situations.
// Usage:
//   curl -X DELETE https://www.ramonapicksrene.com/api/posts/<id> \
//     -H "x-admin-token: <ADMIN_TOKEN>"
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { DB, MEDIA, ADMIN_TOKEN } = env()

  const token = req.headers.get('x-admin-token')
  if (!ADMIN_TOKEN || !token || token !== ADMIN_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const row = await DB.prepare('SELECT media_key FROM posts WHERE id = ?1')
    .bind(params.id)
    .first<{ media_key: string }>()
  if (!row) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  await MEDIA.delete(row.media_key)
  await DB.prepare('DELETE FROM posts WHERE id = ?1').bind(params.id).run()

  return NextResponse.json({ ok: true })
}
