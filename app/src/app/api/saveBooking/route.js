import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  const data = await req.json();

  const filePath = path.join(process.cwd(), 'bookings.json');

  let bookings = [];
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    bookings = fileContent ? JSON.parse(fileContent) : [];
  } catch (e) {

  }

  bookings.push(data);

  await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf8');

  return new Response(JSON.stringify({ message: 'Заявка сохранена' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}