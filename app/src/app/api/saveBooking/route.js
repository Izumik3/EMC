import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
  const data = await req.json();

  const {
    phone,
    name,
    vin,
    TOPackages,
    isDiagnostic,
    symptoms,
    totalPrice
  } = data;

  // Проверка обязательных полей
  if (!phone || !name || !vin) {
    return new Response(
      JSON.stringify({
        error: "missing_fields",
        message: "Обязательные поля не заполнены"
      }),
      { status: 400 }
    );
  }

  // Проверка услуг
  const hasPackages = Array.isArray(TOPackages) && TOPackages.length > 0;
  const hasDiagnostic =
    isDiagnostic === true &&
    Array.isArray(symptoms) &&
    symptoms.length > 0;

  if (!hasPackages && !hasDiagnostic) {
    console.log(`[BLOCKED] Попытка создать пустую заявку от ${phone} в ${new Date().toISOString()}`);
    console.log("Данные:", JSON.stringify(data));

    return new Response(
      JSON.stringify({
        error: "empty_services",
        message: "Заявка должна содержать хотя бы одну услугу"
      }),
      { status: 400 }
    );
  }

  // Проверка цены
  if (!totalPrice || totalPrice === "От 0р") {
    return new Response(
      JSON.stringify({
        error: "invalid_price",
        message: "Некорректная стоимость заявки"
      }),
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), 'bookings.json');

  let bookings = [];
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    bookings = fileContent ? JSON.parse(fileContent) : [];
  } catch (e) {}

  bookings.push(data);

  await fs.writeFile(filePath, JSON.stringify(bookings, null, 2), 'utf8');

  return new Response(JSON.stringify({ message: 'Заявка сохранена' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
