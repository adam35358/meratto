import { getStore } from '@netlify/blobs';
import fallbackProducts from '../../src/data/products.json';
import fallbackSettings from '../../src/data/siteSettings.json';

// Helper to get fallback data from repo
function getFallbackData() {
  return {
    products: Array.isArray(fallbackProducts) ? fallbackProducts : [],
    settings: fallbackSettings || { categories: [], contacts: {} }
  };
}

// Netlify Blob helpers for Products
async function getStoredProducts() {
  try {
    const store = getStore({ name: 'meratto-data', consistency: 'strong' });
    const data = await store.get('products', { type: 'json' });
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.log('[Netlify Function] Blobs products read fallback:', err.message);
  }
  return getFallbackData().products;
}

async function setStoredProducts(items) {
  try {
    const store = getStore({ name: 'meratto-data', consistency: 'strong' });
    await store.setJSON('products', items);
    return true;
  } catch (err) {
    console.error('[Netlify Function] Blobs products write error:', err.message);
    return false;
  }
}

// Netlify Blob helpers for Settings
async function getStoredSettings() {
  try {
    const store = getStore({ name: 'meratto-data', consistency: 'strong' });
    const data = await store.get('settings', { type: 'json' });
    if (data && Array.isArray(data.categories)) {
      return data;
    }
  } catch (err) {
    console.log('[Netlify Function] Blobs settings read fallback:', err.message);
  }
  return getFallbackData().settings;
}

async function setStoredSettings(settings) {
  try {
    const store = getStore({ name: 'meratto-data', consistency: 'strong' });
    await store.setJSON('settings', settings);
    return true;
  } catch (err) {
    console.error('[Netlify Function] Blobs settings write error:', err.message);
    return false;
  }
}

// Cloud Storage Image Uploader
async function uploadImageToCloud(base64, filename) {
  // 1. Check if ImgBB API key is provided
  const imgbbKey = process.env.IMGBB_API_KEY;
  if (imgbbKey) {
    try {
      const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
      const form = new URLSearchParams();
      form.append('image', cleanBase64);
      form.append('name', (filename || 'meratto_img').replace(/[^a-zA-Z0-9_-]/g, '_'));

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        return { success: true, url: data.data.url };
      }
    } catch (err) {
      console.error('[Netlify Function] ImgBB upload error:', err.message);
    }
  }

  // 2. Netlify Blobs storage for images
  try {
    const store = getStore({ name: 'meratto-images', consistency: 'strong' });
    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64, 'base64');
    const ext = matches && matches[1].includes('png') ? 'png' : 'jpg';
    const key = `img_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    await store.set(key, buffer, {
      metadata: { contentType: matches ? matches[1] : 'image/jpeg' }
    });

    return { success: true, url: `/.netlify/functions/api/images/${key}` };
  } catch (blobErr) {
    console.log('[Netlify Function] Blob image write error:', blobErr.message);
  }

  // 3. Fallback: return Base64 Data URL directly
  return { success: true, url: base64 };
}

// Standard Netlify Function Handler
export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const rawPath = event.path || '';
  const pathname = rawPath.replace('/.netlify/functions/api', '/api');
  const method = event.httpMethod.toUpperCase();

  let body = {};
  if (event.body) {
    try {
      body = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body);
    } catch (e) {
      body = {};
    }
  }

  try {
    // 1. Health check
    if (pathname === '/api/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', provider: 'Netlify Serverless', time: new Date().toISOString() })
      };
    }

    // 2. Serve Stored Blob Images: /api/images/:key
    if (pathname.startsWith('/api/images/')) {
      const key = pathname.replace('/api/images/', '');
      try {
        const store = getStore({ name: 'meratto-images', consistency: 'strong' });
        const item = await store.get(key, { type: 'arrayBuffer' });
        if (item) {
          const contentType = key.endsWith('.png') ? 'image/png' : 'image/jpeg';
          return {
            statusCode: 200,
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, immutable'
            },
            isBase64Encoded: true,
            body: Buffer.from(item).toString('base64')
          };
        }
      } catch (imgErr) {
        console.error('Image serve error:', imgErr);
      }
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Image not found' }) };
    }

    // 3. Admin Login
    if (pathname === '/api/admin/login' && method === 'POST') {
      const configuredPassword = process.env.ADMIN_PASSWORD || 'meratto2026';
      if (body.password === configuredPassword) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token: 'meratto_token_' + Buffer.from(Date.now().toString()).toString('base64'),
            role: 'admin'
          })
        };
      }
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: "Parol noto'g'ri! Qaytadan urinib ko'ring." })
      };
    }

    // 4. Products Endpoints (/api/products)
    if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
      if (method === 'GET') {
        const products = await getStoredProducts();
        return { statusCode: 200, headers, body: JSON.stringify(products) };
      }

      if (method === 'POST') {
        const items = await getStoredProducts();
        const newProduct = {
          id: body.id || `p_${Date.now()}`,
          code: body.code || `MRT-${Math.floor(100 + Math.random() * 900)}`,
          category: body.category || 'dvoyka',
          name: typeof body.name === 'object' ? body.name : { uz: body.name || 'Yangi mahsulot', ru: '', en: '' },
          price: Number(body.price) || 0,
          oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
          badge: body.badge || 'New',
          modelCode: body.modelCode || body.code || 'MRT-NEW',
          image: body.image || '/images/products/placeholder.jpg',
          images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [body.image || '/images/products/placeholder.jpg'],
          description: typeof body.description === 'object' ? body.description : { uz: body.description || '', ru: '', en: '' },
          fabric: typeof body.fabric === 'object' ? body.fabric : { uz: body.fabric || 'Premium sifat', ru: '', en: '' },
          sizes: Array.isArray(body.sizes) ? body.sizes : ['M (48)', 'L (50)', 'XL (52)'],
          colors: Array.isArray(body.colors) ? body.colors : ['#101827']
        };

        items.unshift(newProduct);
        await setStoredProducts(items);
        return { statusCode: 201, headers, body: JSON.stringify({ success: true, product: newProduct }) };
      }

      if (method === 'PUT') {
        const idFromPath = pathname.replace('/api/products/', '').replace('/api/products', '');
        const targetId = idFromPath || body.id;
        const items = await getStoredProducts();
        const index = items.findIndex(p => String(p.id) === String(targetId));

        if (index === -1) {
          return { statusCode: 404, headers, body: JSON.stringify({ success: false, error: "Mahsulot topilmadi" }) };
        }

        const existing = items[index];
        const updated = {
          ...existing,
          ...body,
          id: existing.id,
          name: typeof body.name === 'object' ? { ...existing.name, ...body.name } : { ...existing.name, uz: body.name || existing.name?.uz },
          description: typeof body.description === 'object' ? { ...existing.description, ...body.description } : { ...existing.description, uz: body.description || existing.description?.uz },
          fabric: typeof body.fabric === 'object' ? { ...existing.fabric, ...body.fabric } : { ...existing.fabric, uz: body.fabric || existing.fabric?.uz },
          price: body.price !== undefined ? Number(body.price) : existing.price,
          oldPrice: body.oldPrice !== undefined ? (body.oldPrice ? Number(body.oldPrice) : null) : existing.oldPrice,
          image: body.image || existing.image,
          images: Array.isArray(body.images) ? body.images : [body.image || existing.image]
        };

        items[index] = updated;
        await setStoredProducts(items);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, product: updated }) };
      }

      if (method === 'DELETE') {
        const idFromPath = pathname.replace('/api/products/', '').replace('/api/products', '');
        const targetId = idFromPath || body.id;
        const items = await getStoredProducts();
        const filtered = items.filter(p => String(p.id) !== String(targetId));

        await setStoredProducts(filtered);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: "Mahsulot o'chirildi" }) };
      }
    }

    // 5. Settings, Categories & Contacts
    if (pathname === '/api/settings') {
      if (method === 'GET') {
        const settings = await getStoredSettings();
        return { statusCode: 200, headers, body: JSON.stringify(settings) };
      }
      if (method === 'PUT') {
        const current = await getStoredSettings();
        const updated = {
          ...current,
          ...body,
          categories: body.categories || current.categories,
          contacts: body.contacts || current.contacts
        };
        await setStoredSettings(updated);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, settings: updated }) };
      }
    }

    if (pathname === '/api/categories' || pathname.startsWith('/api/categories/')) {
      const settings = await getStoredSettings();
      const categories = settings.categories || [];

      if (method === 'GET') {
        return { statusCode: 200, headers, body: JSON.stringify(categories) };
      }

      if (method === 'POST') {
        const catName = (body.name || '').trim();
        if (!catName) {
          return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Bo'lim nomi bo'sh bo'lishi mumkin emas" }) };
        }
        const slug = body.id || catName.toLowerCase().replace(/[^a-z0-9]/g, '_') || `cat_${Date.now()}`;
        if (categories.some(c => c.id === slug)) {
          return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Bunday bo'lim mavjud" }) };
        }
        const newCat = { id: slug, name: catName };
        categories.push(newCat);
        settings.categories = categories;
        await setStoredSettings(settings);
        return { statusCode: 201, headers, body: JSON.stringify({ success: true, category: newCat, categories }) };
      }

      if (method === 'DELETE') {
        const idFromPath = pathname.replace('/api/categories/', '').replace('/api/categories', '');
        const targetId = idFromPath || body.id;
        settings.categories = categories.filter(c => c.id !== targetId);
        await setStoredSettings(settings);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, categories: settings.categories }) };
      }

      if (method === 'PUT') {
        const idFromPath = pathname.replace('/api/categories/', '').replace('/api/categories', '');
        const targetId = idFromPath || body.id;
        const idx = categories.findIndex(c => c.id === targetId);
        if (idx !== -1) {
          categories[idx].name = body.name || categories[idx].name;
          settings.categories = categories;
          await setStoredSettings(settings);
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, categories }) };
        }
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Bo'lim topilmadi" }) };
      }
    }

    if (pathname === '/api/contacts') {
      const settings = await getStoredSettings();
      if (method === 'GET') {
        return { statusCode: 200, headers, body: JSON.stringify(settings.contacts || {}) };
      }
      if (method === 'PUT' || method === 'POST') {
        settings.contacts = {
          ...settings.contacts,
          ...body
        };
        await setStoredSettings(settings);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, contacts: settings.contacts }) };
      }
    }

    // Branches CRUD (/api/branches)
    if (pathname === '/api/branches' || pathname.startsWith('/api/branches/')) {
      const settings = await getStoredSettings();
      let branches = settings.branches || [];

      if (method === 'GET') {
        return { statusCode: 200, headers, body: JSON.stringify(branches) };
      }

      if (method === 'POST' || method === 'PUT') {
        if (Array.isArray(body)) {
          settings.branches = body;
          await setStoredSettings(settings);
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, branches: settings.branches }) };
        }

        const branchId = body.id || (body.name || '').toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || `branch_${Date.now()}`;
        const branchItem = {
          id: branchId,
          name: body.name || 'Filial',
          brand: body.brand || 'Meratto',
          badge: body.badge || "Do'kon",
          address: body.address || '',
          landmark: body.landmark || '',
          phones: Array.isArray(body.phones) ? body.phones : (body.phones ? [body.phones] : []),
          hours: body.hours || 'Har kuni 10:00 — 23:00',
          status: body.status || 'OCHIQ (10:00 - 22:00)',
          image: body.image || '/images/branches/branch_qoratosh_flagship.jpg',
          mapUrl: body.mapUrl || ''
        };

        const existingIdx = branches.findIndex(b => b.id === branchId);
        if (existingIdx !== -1) {
          branches[existingIdx] = { ...branches[existingIdx], ...branchItem };
        } else {
          branches.push(branchItem);
        }

        settings.branches = branches;
        await setStoredSettings(settings);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, branch: branchItem, branches }) };
      }

      if (method === 'DELETE') {
        const idFromPath = pathname.replace('/api/branches/', '').replace('/api/branches', '');
        const targetId = idFromPath || body.id;
        settings.branches = (settings.branches || []).filter(b => b.id !== targetId);
        await setStoredSettings(settings);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, branches: settings.branches }) };
      }
    }

    // Testimonials CRUD (/api/testimonials)
    if (pathname === '/api/testimonials' || pathname.startsWith('/api/testimonials/')) {
      const settings = await getStoredSettings();
      let testimonials = settings.testimonials || [];

      if (method === 'GET') {
        return { statusCode: 200, headers, body: JSON.stringify(testimonials) };
      }

      if (method === 'POST' || method === 'PUT') {
        if (Array.isArray(body)) {
          settings.testimonials = body;
          await setStoredSettings(settings);
          return { statusCode: 200, headers, body: JSON.stringify({ success: true, testimonials: settings.testimonials }) };
        }

        const testId = body.id || Date.now();
        const testItem = {
          id: testId,
          name: body.name || 'Mijoz',
          city: body.city || 'Toshkent',
          rating: Number(body.rating) || 5,
          date: body.date || 'Bugun',
          outfit: body.outfit || 'Kostyum / Dvoyka',
          avatar: body.avatar || '/images/avatars/avatar_sardor.jpg',
          comment: body.comment || ''
        };

        const existingIdx = testimonials.findIndex(t => String(t.id) === String(testId));
        if (existingIdx !== -1) {
          testimonials[existingIdx] = { ...testimonials[existingIdx], ...testItem };
        } else {
          testimonials.unshift(testItem);
        }

        settings.testimonials = testimonials;
        await setStoredSettings(settings);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, testimonial: testItem, testimonials }) };
      }

      if (method === 'DELETE') {
        const idFromPath = pathname.replace('/api/testimonials/', '').replace('/api/testimonials', '');
        const targetId = idFromPath || body.id;
        settings.testimonials = (settings.testimonials || []).filter(t => String(t.id) !== String(targetId));
        await setStoredSettings(settings);
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, testimonials: settings.testimonials }) };
      }
    }

    // 6. Image Upload (/api/upload)
    if (pathname === '/api/upload' && method === 'POST') {
      const { base64, filename } = body;
      if (!base64) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: "Rasm ma'lumoti yo'q" }) };
      }

      const uploadResult = await uploadImageToCloud(base64, filename);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(uploadResult)
      };
    }

    // 7. Telegram Bot Order Dispatch (/api/order)
    if (pathname === '/api/order' && method === 'POST') {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (!botToken || !chatId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, error: "Telegram Bot Token yoki Chat ID Netlify Environment Variables da ko'rsatilmagan!" })
        };
      }

      const messageText = body.messageHtml || `Yangi buyurtma: ${body.name || ''} - ${body.phone || ''}`;

      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      const tgResult = await tgRes.json();
      if (tgResult.ok) {
        return { statusCode: 200, headers, body: JSON.stringify({ success: true, messageId: tgResult.result?.message_id }) };
      } else {
        return { statusCode: 502, headers, body: JSON.stringify({ success: false, error: tgResult.description || 'Telegram xatosi' }) };
      }
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: 'Endpoint Not Found' }) };
  } catch (err) {
    console.error('[Netlify Function Error]:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
}
