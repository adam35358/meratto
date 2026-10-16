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
${escapeHtml(products || 'Smart Casual kiyimlar konsultatsiyasi')}

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
 * 1. Tries the Node.js / Netlify / Vite API endpoint (/api/order)
 * 2. If client environment variables are provided, falls back to direct client-side Telegram API fetch
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

    const result = await apiRes.json().catch(() => null);

    if (apiRes.ok && result && result.success) {
      return { success: true, method: 'backend', messageId: result.messageId };
    }

    if (result && result.error) {
      throw new Error(result.error);
    }

    if (!apiRes.ok) {
      throw new Error(`Server javobi: ${apiRes.status}`);
    }
  } catch (backendErr) {
    console.warn("Backend API orqali yuborishda xatolik:", backendErr);

    // 2. Client-side fallback using VITE_ environment variables if present
    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    if (botToken && !botToken.includes('YOUR_BOT_TOKEN') && chatId && !chatId.includes('YOUR_CHAT_ID')) {
      try {
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

        const resJson = await response.json().catch(() => null);
        if (response.ok && resJson && resJson.ok) {
          return { success: true, method: 'direct' };
        }
        if (resJson && resJson.description) {
          throw new Error(resJson.description);
        }
      } catch (directErr) {
        console.error("Direct Telegram send failed:", directErr);
      }
    }

    // Friendly, professional message for customer
    const userMsg = backendErr.message && !backendErr.message.includes('fetch')
      ? backendErr.message
      : "Buyurtma yuborishda texnik yangilanish ketmoqda. Iltimos, sahifani yangilang yoki to'g'ridan-to'g'ri qo'ng'iroq qiling: +998 98 311 33 37";
    throw new Error(userMsg);
  }
}
