/**
 * Meratto & De Franko — Telegram Bot Service
 * Formats order payloads into high-status Telegram HTML messages and dispatches via API
 */

export const formatTelegramOrderMessage = (data) => {
  const { name, phone, products, deliveryType, paymentType, notes, date } = data;

  const cleanPhone = phone ? phone.replace(/[^\d+]/g, '') : '';
  const now = date || new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  return `
👑 <b>YANGI BUYURTMA // MERATTO &amp; DE FRANKO</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 <b>Mijoz:</b> ${escapeHtml(name || "Noma'lum xaridor")}
📞 <b>Telefon:</b> <a href="tel:${cleanPhone}">${cleanPhone || phone}</a>
⏰ <b>Vaqt:</b> ${now}

📦 <b>BUYURTMA TARKIBI:</b>
${products || 'Smart Casual kiyimlar konsultatsiyasi'}

🚚 <b>Yetkazish:</b> ${escapeHtml(deliveryType || "Ko'rsatilmadi")}
💳 <b>To'lov turi:</b> ${escapeHtml(paymentType || "Ko'rsatilmadi")}
${notes ? `📝 <b>Izoh / Manzil:</b> <i>${escapeHtml(notes)}</i>` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>🏛 Toshkent Boutique // Meratto &amp; De Franko Web Terminal</i>
`.trim();
};

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Dispatches the order to Telegram:
 * 1. Tries the Node.js / Express / Vite proxy endpoint (/api/order)
 * 2. If backend endpoint is unavailable, falls back to direct client-side Telegram API fetch using VITE_ env variables
 */
export async function sendTelegramOrder(payload) {
  const messageHtml = formatTelegramOrderMessage(payload);

  // 1. Try sending via Backend API Endpoint (/api/order)
  try {
    const apiRes = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        messageHtml
      })
    });

    if (apiRes.ok) {
      const result = await apiRes.json();
      if (result.success) {
        return { success: true, method: 'backend' };
      }
    }
  } catch (backendErr) {
    console.warn("Backend API endpoint mavjud emas, to'g'ridan-to'g'ri Telegram API ga o'tilmoqda...", backendErr);
  }

  // 2. Client-side fallback using VITE_ environment variables
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || botToken.includes('YOUR_BOT_TOKEN') || !chatId || chatId.includes('YOUR_CHAT_ID')) {
    // If not configured, throw descriptive error so the user can see in UI
    throw new Error("Telegram bot tokeni yoki Chat ID kiritilmagan. Iltimos, .env faylida VITE_TELEGRAM_BOT_TOKEN va VITE_TELEGRAM_CHAT_ID ni to'ldiring.");
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const response = await fetch(telegramUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: messageHtml,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  const resJson = await response.json();

  if (!response.ok || !resJson.ok) {
    throw new Error(resJson.description || "Telegram Bot API ga yuborishda xatolik yuz berdi.");
  }

  return { success: true, method: 'direct' };
}
