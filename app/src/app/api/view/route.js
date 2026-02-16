import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'bookings.json');

  let content = 'Нет заявок';
  try {
    content = await fs.readFile(filePath, 'utf8');
  } catch (e) {
    // файл не найден — оставляем сообщение
  }

  return new Response(content, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}