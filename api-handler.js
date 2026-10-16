import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PRODUCTS_FILE = path.join(__dirname, 'src', 'data', 'products.json');
const SETTINGS_FILE = path.join(__dirname, 'src', 'data', 'siteSettings.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Read settings helper
export function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf8');
      return JSON.parse(raw || '{}');
    }
  } catch (err) {
    console.error('[API] Error reading siteSettings.json:', err.message);
  }
  return {
    categories: [
      { id: 'dvoyka', name: 'Dvoykalar' },
      { id: 'costume', name: 'Kostyumlar' },
      { id: 'casual', name: 'Smart Casual' },
      { id: 'accessories', name: 'Aksessuarlar' }
    ],
    contacts: { mainPhone: '+998 98 311 33 37', branches: [] }
  };
}

// Write settings helper
export function writeSettings(settings) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[API] Error writing siteSettings.json:', err.message);
    return false;
  }
}

// Read products list from JSON
export function readProducts() {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
      return JSON.parse(raw || '[]');
    }
  } catch (err) {
    console.error('[API] Error reading products.json:', err.message);
  }
  return [];
}

// Write products list to JSON
export function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('[API] Error writing products.json:', err.message);
    return false;
  }
}

// Read body helper
export function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        resolve(json);
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

// Send JSON response helper
export function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
}

/**
 * Main API Handler
 * Returns true if the request was handled, false otherwise.
 */
export async function handleApiRequest(req, res, env = {}) {
  const url = new URL(req.url, 'http://localhost');
  const pathname = url.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return true;
  }

  // 1. Health check
  if (pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok', time: new Date().toISOString() });
    return true;
  }

  // 2. Admin Login
  if (pathname === '/api/admin/login' && method === 'POST') {
    const body = await readBody(req);
    const configuredPassword = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'meratto2026';
    
    if (body.password === configuredPassword) {
      sendJson(res, 200, {
        success: true,
        token: 'meratto_token_' + Buffer.from(Date.now().toString()).toString('base64'),
        role: 'admin'
      });
    } else {
      sendJson(res, 401, {
        success: false,
        error: "Parol noto'g'ri! Qaytadan urinib ko'ring."
      });
    }
    return true;
  }

  // 3. Products Endpoints
  if (pathname === '/api/products' || pathname.startsWith('/api/products/')) {
    // GET: List all products
    if (method === 'GET') {
      const items = readProducts();
      sendJson(res, 200, items);
      return true;
    }

    // POST: Create product
    if (method === 'POST') {
      const body = await readBody(req);
      const items = readProducts();
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
      writeProducts(items);
      sendJson(res, 201, { success: true, product: newProduct });
      return true;
    }

    // PUT: Update product
    if (method === 'PUT') {
      const body = await readBody(req);
      const idFromPath = pathname.replace('/api/products/', '').replace('/api/products', '');
      const targetId = idFromPath || body.id;

      if (!targetId) {
        sendJson(res, 400, { success: false, error: "Mahsulot ID si ko'rsatilmadi" });
        return true;
      }

      const items = readProducts();
      const index = items.findIndex(p => String(p.id) === String(targetId));

      if (index === -1) {
        sendJson(res, 404, { success: false, error: "Mahsulot topilmadi" });
        return true;
      }

      // Merge fields carefully
      const existing = items[index];
      const updated = {
        ...existing,
        ...body,
        id: existing.id, // preserve immutable ID
        name: typeof body.name === 'object' ? { ...existing.name, ...body.name } : { ...existing.name, uz: body.name || existing.name?.uz },
        description: typeof body.description === 'object' ? { ...existing.description, ...body.description } : { ...existing.description, uz: body.description || existing.description?.uz },
        fabric: typeof body.fabric === 'object' ? { ...existing.fabric, ...body.fabric } : { ...existing.fabric, uz: body.fabric || existing.fabric?.uz },
        price: body.price !== undefined ? Number(body.price) : existing.price,
        oldPrice: body.oldPrice !== undefined ? (body.oldPrice ? Number(body.oldPrice) : null) : existing.oldPrice,
        image: body.image || existing.image,
        images: Array.isArray(body.images) ? body.images : [body.image || existing.image]
      };

      items[index] = updated;
      writeProducts(items);
      sendJson(res, 200, { success: true, product: updated });
      return true;
    }

    // DELETE: Remove product
    if (method === 'DELETE') {
      const idFromPath = pathname.replace('/api/products/', '').replace('/api/products', '');
      const idFromQuery = url.searchParams.get('id');
      const body = await readBody(req);
      const targetId = idFromPath || idFromQuery || body.id;

      if (!targetId) {
        sendJson(res, 400, { success: false, error: "O'chirish uchun mahsulot ID si kerak" });
        return true;
      }

      const items = readProducts();
      const filtered = items.filter(p => String(p.id) !== String(targetId));

      if (filtered.length === items.length) {
        sendJson(res, 404, { success: false, error: "Mahsulot topilmadi" });
        return true;
      }

      writeProducts(filtered);
      sendJson(res, 200, { success: true, message: "Mahsulot o'chirildi" });
      return true;
    }
  }

  // 4. Site Settings & Dynamic Categories & Phone Numbers
  if (pathname === '/api/settings') {
    if (method === 'GET') {
      sendJson(res, 200, readSettings());
      return true;
    }
    if (method === 'PUT') {
      const body = await readBody(req);
      const current = readSettings();
      const updated = {
        ...current,
        ...body,
        categories: body.categories || current.categories,
        contacts: body.contacts || current.contacts
      };
      writeSettings(updated);
      sendJson(res, 200, { success: true, settings: updated });
      return true;
    }
  }

  // Categories CRUD (/api/categories)
  if (pathname === '/api/categories' || pathname.startsWith('/api/categories/')) {
    if (method === 'GET') {
      const settings = readSettings();
      sendJson(res, 200, settings.categories || []);
      return true;
    }

    if (method === 'POST') {
      const body = await readBody(req);
      const catName = (body.name || '').trim();
      if (!catName) {
        sendJson(res, 400, { success: false, error: "Bo'lim nomi bo'sh bo'lishi mumkin emas" });
        return true;
      }

      const settings = readSettings();
      const categories = settings.categories || [];
      const slug = body.id || catName.toLowerCase().replace(/[^a-z0-9]/g, '_') || `cat_${Date.now()}`;

      if (categories.some(c => c.id === slug)) {
        sendJson(res, 400, { success: false, error: "Bunday bo'lim allaqachon mavjud" });
        return true;
      }

      const newCategory = { id: slug, name: catName };
      categories.push(newCategory);
      settings.categories = categories;
      writeSettings(settings);
      sendJson(res, 201, { success: true, category: newCategory, categories });
      return true;
    }

    if (method === 'DELETE') {
      const idFromPath = pathname.replace('/api/categories/', '').replace('/api/categories', '');
      const idFromQuery = url.searchParams.get('id');
      const body = await readBody(req);
      const targetId = idFromPath || idFromQuery || body.id;

      if (!targetId) {
        sendJson(res, 400, { success: false, error: "O'chirish uchun bo'lim ID si kerak" });
        return true;
      }

      const settings = readSettings();
      const categories = (settings.categories || []).filter(c => c.id !== targetId);
      settings.categories = categories;
      writeSettings(settings);
      sendJson(res, 200, { success: true, message: "Bo'lim o'chirildi", categories });
      return true;
    }

    if (method === 'PUT') {
      const idFromPath = pathname.replace('/api/categories/', '').replace('/api/categories', '');
      const body = await readBody(req);
      const targetId = idFromPath || body.id;

      const settings = readSettings();
      const categories = settings.categories || [];
      const idx = categories.findIndex(c => c.id === targetId);

      if (idx === -1) {
        sendJson(res, 404, { success: false, error: "Bo'lim topilmadi" });
        return true;
      }

      categories[idx] = {
        ...categories[idx],
        name: body.name || categories[idx].name
      };
      settings.categories = categories;
      writeSettings(settings);
      sendJson(res, 200, { success: true, categories });
      return true;
    }
  }

  // Contacts & Phone Numbers Update (/api/contacts)
  if (pathname === '/api/contacts') {
    if (method === 'GET') {
      const settings = readSettings();
      sendJson(res, 200, settings.contacts || {});
      return true;
    }
    if (method === 'PUT' || method === 'POST') {
      const body = await readBody(req);
      const settings = readSettings();
      settings.contacts = {
        ...settings.contacts,
        ...body
      };
      writeSettings(settings);
      sendJson(res, 200, { success: true, contacts: settings.contacts });
      return true;
    }
  }

  // Branches Management (/api/branches)
  if (pathname === '/api/branches' || pathname.startsWith('/api/branches/')) {
    if (method === 'GET') {
      const settings = readSettings();
      sendJson(res, 200, settings.branches || []);
      return true;
    }

    if (method === 'POST' || method === 'PUT') {
      const body = await readBody(req);
      const settings = readSettings();
      let branches = settings.branches || [];

      // Bulk replace if array
      if (Array.isArray(body)) {
        settings.branches = body;
        writeSettings(settings);
        sendJson(res, 200, { success: true, branches: settings.branches });
        return true;
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
      writeSettings(settings);
      sendJson(res, 200, { success: true, branch: branchItem, branches });
      return true;
    }

    if (method === 'DELETE') {
      const idFromPath = pathname.replace('/api/branches/', '').replace('/api/branches', '');
      const idFromQuery = url.searchParams.get('id');
      const body = await readBody(req);
      const targetId = idFromPath || idFromQuery || body.id;

      if (!targetId) {
        sendJson(res, 400, { success: false, error: "O'chirish uchun filial ID si kerak" });
        return true;
      }

      const settings = readSettings();
      settings.branches = (settings.branches || []).filter(b => b.id !== targetId);
      writeSettings(settings);
      sendJson(res, 200, { success: true, message: "Filial o'chirildi", branches: settings.branches });
      return true;
    }
  }

  // Testimonials / Reviews Management (/api/testimonials)
  if (pathname === '/api/testimonials' || pathname.startsWith('/api/testimonials/')) {
    if (method === 'GET') {
      const settings = readSettings();
      sendJson(res, 200, settings.testimonials || []);
      return true;
    }

    if (method === 'POST' || method === 'PUT') {
      const body = await readBody(req);
      const settings = readSettings();
      let testimonials = settings.testimonials || [];

      // Bulk replace if array
      if (Array.isArray(body)) {
        settings.testimonials = body;
        writeSettings(settings);
        sendJson(res, 200, { success: true, testimonials: settings.testimonials });
        return true;
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
        testimonials.unshift(testItem); // add to top
      }

      settings.testimonials = testimonials;
      writeSettings(settings);
      sendJson(res, 200, { success: true, testimonial: testItem, testimonials });
      return true;
    }

    if (method === 'DELETE') {
      const idFromPath = pathname.replace('/api/testimonials/', '').replace('/api/testimonials', '');
      const idFromQuery = url.searchParams.get('id');
      const body = await readBody(req);
      const targetId = idFromPath || idFromQuery || body.id;

      if (!targetId) {
        sendJson(res, 400, { success: false, error: "O'chirish uchun fikr ID si kerak" });
        return true;
      }

      const settings = readSettings();
      settings.testimonials = (settings.testimonials || []).filter(t => String(t.id) !== String(targetId));
      writeSettings(settings);
      sendJson(res, 200, { success: true, message: "Fikr o'chirildi", testimonials: settings.testimonials });
      return true;
    }
  }

  // 5. File / Image Upload
  if (pathname === '/api/upload' && method === 'POST') {
    try {
      const body = await readBody(req);
      const { base64, filename } = body;

      if (!base64) {
        sendJson(res, 400, { success: false, error: "Rasm ma'lumoti (base64) topilmadi" });
        return true;
      }

      // Check if Cloud Storage (ImgBB) is enabled
      const imgbbKey = env.IMGBB_API_KEY || process.env.IMGBB_API_KEY;
      if (imgbbKey) {
        try {
          const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
          const form = new URLSearchParams();
          form.append('image', cleanBase64);
          form.append('name', (filename || 'meratto_img').replace(/[^a-zA-Z0-9_-]/g, '_'));

          const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
            method: 'POST',
            body: form
          });
          const imgbbData = await imgbbRes.json();
          if (imgbbData.success && imgbbData.data?.url) {
            sendJson(res, 200, {
              success: true,
              url: imgbbData.data.url,
              filename: imgbbData.data.title || filename
            });
            return true;
          }
        } catch (cloudErr) {
          console.error('[API] Cloud upload failed, falling back to local:', cloudErr.message);
        }
      }

      // Extract clean data & extension for local fallback
      const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let buffer;
      let ext = '.jpg';

      if (matches && matches.length === 3) {
        const mime = matches[1];
        if (mime.includes('png')) ext = '.png';
        else if (mime.includes('webp')) ext = '.webp';
        else if (mime.includes('gif')) ext = '.gif';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(base64, 'base64');
      }

      const cleanName = (filename || 'image')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .substring(0, 30);
      const uniqueFilename = `img_${Date.now()}_${cleanName}${ext}`;
      const targetPath = path.join(UPLOADS_DIR, uniqueFilename);

      fs.writeFileSync(targetPath, buffer);

      const publicUrl = `/uploads/${uniqueFilename}`;
      sendJson(res, 200, {
        success: true,
        url: publicUrl,
        filename: uniqueFilename
      });
      return true;
    } catch (uploadErr) {
      console.error('[API] Upload error:', uploadErr);
      sendJson(res, 500, { success: false, error: "Rasmni yuklashda xatolik: " + uploadErr.message });
      return true;
    }
  }

  // 5. Telegram Order API
  if (pathname === '/api/order' && method === 'POST') {
    try {
      const botToken = env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
      const chatId = env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

      if (!botToken || botToken.includes('YOUR_BOT_TOKEN') || !chatId || chatId.includes('YOUR_CHAT_ID')) {
        sendJson(res, 400, {
          success: false,
          error: "Telegram Bot Token yoki Chat ID .env faylida ko'rsatilmagan!"
        });
        return true;
      }

      const data = await readBody(req);
      const messageText = data.messageHtml || `Yangi buyurtma: ${data.name || ''} - ${data.phone || ''}`;

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
        sendJson(res, 200, { success: true, messageId: tgResult.result?.message_id });
      } else {
        sendJson(res, 502, { success: false, error: tgResult.description || 'Telegram xatosi' });
      }
      return true;
    } catch (e) {
      sendJson(res, 500, { success: false, error: e.message });
      return true;
    }
  }

  return false;
}
