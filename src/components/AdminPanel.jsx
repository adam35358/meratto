import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, Unlock, LogOut, Plus, Edit3, Trash2, Upload, Image as ImageIcon, 
  ExternalLink, Check, X, Search, Filter, Sparkles, Save, RefreshCw, 
  AlertCircle, Eye, EyeOff, Layers, Tag, ArrowLeft, Phone, MapPin, 
  FolderPlus, Settings, ShoppingBag, Hash, Star, MessageSquare, Clock, Building, User, Quote
} from 'lucide-react';

export default function AdminPanel({ onBackToSite, onProductsUpdated, onSettingsUpdated }) {
  // Navigation Tabs State: 'products' | 'categories' | 'branches' | 'testimonials' | 'contacts'
  const [activeTab, setActiveTab] = useState('products');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories & Contacts Settings State
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState({ mainPhone: '+998 98 311 33 37' });

  // Branches State & Modals
  const [branches, setBranches] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [branchSaving, setBranchSaving] = useState(false);
  const [branchImageLoading, setBranchImageLoading] = useState(false);
  const branchFileInputRef = useRef(null);

  // Testimonials State & Modals
  const [testimonials, setTestimonials] = useState([]);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [avatarImageLoading, setAvatarImageLoading] = useState(false);
  const avatarFileInputRef = useRef(null);

  // Edit / Add Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Category Add / Edit State
  const [newCatName, setNewCatName] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [editingCat, setEditingCat] = useState(null);
  const [catActionLoading, setCatActionLoading] = useState(false);

  // Contacts Form State
  const [contactsSaving, setContactsSaving] = useState(false);

  // Success Toast
  const [toastMessage, setToastMessage] = useState('');
  const fileInputRef = useRef(null);

  // Check existing session on load
  useEffect(() => {
    const token = localStorage.getItem('meratto_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchProducts();
      fetchSettings();
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. Authentication Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('meratto_admin_token', data.token);
        setIsAuthenticated(true);
        fetchProducts();
        fetchSettings();
      } else {
        setAuthError(data.error || "Parol noto'g'ri!");
      }
    } catch (err) {
      setAuthError("Server bilan aloqa uzildi: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('meratto_admin_token');
    setIsAuthenticated(false);
    setPassword('');
  };

  // 2. Fetch Data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        if (onProductsUpdated) onProductsUpdated(data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
        if (data.contacts) {
          setContacts(data.contacts);
        }
        if (Array.isArray(data.branches)) {
          setBranches(data.branches);
        }
        if (Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
        if (onSettingsUpdated) onSettingsUpdated(data);
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    }
  };

  // 3. Category Management Handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setCatActionLoading(true);
    try {
      const slug = (newCatId.trim() || newCatName.trim())
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');

      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), id: slug })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories);
        setNewCatName('');
        setNewCatId('');
        showToast("Yangi bo'lim muvaffaqiyatli qo'shildi!");
        fetchSettings();
      } else {
        alert(data.error || "Bo'lim qo'shishda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi: " + err.message);
    } finally {
      setCatActionLoading(false);
    }
  };

  const handleUpdateCategory = async (id, newName) => {
    if (!newName.trim()) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories);
        setEditingCat(null);
        showToast("Bo'lim nomi yangilandi!");
        fetchSettings();
      } else {
        alert(data.error || "Yangilashda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi: " + err.message);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    const productsInCat = products.filter(p => p.category === catId).length;
    let confirmMsg = `Haqiqatan ham "${catName}" bo'limini o'chirmoqchimisiz?`;
    if (productsInCat > 0) {
      confirmMsg += `\nDiqqat: Ushbu bo'limda ${productsInCat} ta tovar mavjud!`;
    }

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/categories/${catId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(data.categories);
        if (selectedCategory === catId) setSelectedCategory('all');
        showToast("Bo'lim muvaffaqiyatli o'chirildi!");
        fetchSettings();
      } else {
        alert(data.error || "O'chirishda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi: " + err.message);
    }
  };

  // 4. Contacts & Phone Numbers Save Handler
  const handleSaveContacts = async (e) => {
    e.preventDefault();
    setContactsSaving(true);
    try {
      const res = await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contacts)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContacts(data.contacts);
        showToast("Telefon raqamlari muvaffaqiyatli saqlandi!");
        fetchSettings();
      } else {
        alert("Saqlashda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi: " + err.message);
    } finally {
      setContactsSaving(false);
    }
  };

  const updateBranchPhone = (branchIndex, phoneIndex, val) => {
    const updatedBranches = [...contacts.branches];
    const updatedPhones = [...(updatedBranches[branchIndex].phones || [])];
    updatedPhones[phoneIndex] = val;
    updatedBranches[branchIndex].phones = updatedPhones;
    setContacts({ ...contacts, branches: updatedBranches });
  };

  // 4a. Branches Handlers
  const handleOpenBranchCreate = () => {
    setEditingBranch({
      id: '',
      name: '',
      brand: 'Meratto',
      badge: "Do'kon",
      address: '',
      landmark: '',
      phones: ['+998 98 311 33 37'],
      hours: 'Har kuni 10:00 — 23:00',
      status: 'OCHIQ (10:00 - 22:00)',
      image: '/images/branches/branch_qoratosh_flagship.jpg',
      mapUrl: ''
    });
    setIsBranchModalOpen(true);
  };

  const handleOpenBranchEdit = (branch) => {
    setEditingBranch({
      ...branch,
      address: typeof branch.address === 'object' ? (branch.address.uz || '') : (branch.address || ''),
      landmark: typeof branch.landmark === 'object' ? (branch.landmark.uz || '') : (branch.landmark || ''),
      phones: Array.isArray(branch.phones) && branch.phones.length > 0 ? [...branch.phones] : ['+998 98 311 33 37']
    });
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!editingBranch.name.trim()) return alert("Do'kon nomini kiriting");
    setBranchSaving(true);
    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBranch)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBranches(data.branches);
        setIsBranchModalOpen(false);
        showToast("Filial muvaffaqiyatli saqlandi!");
        fetchSettings();
      } else {
        alert(data.error || "Filialni saqlashda xatolik");
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    } finally {
      setBranchSaving(false);
    }
  };

  const handleDeleteBranch = async (branchId) => {
    if (!window.confirm("Haqiqatan ham ushbu filialni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/branches?id=${branchId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setBranches(data.branches);
        showToast("Filial o'chirildi!");
        fetchSettings();
      } else {
        alert(data.error || "O'chirishda xatolik");
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  const handleBranchImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBranchImageLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, filename: file.name })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setEditingBranch(prev => ({ ...prev, image: data.url }));
          showToast("Do'kon rasmi muvaffaqiyatli yuklandi!");
        } else {
          setEditingBranch(prev => ({ ...prev, image: base64 }));
        }
      } catch (err) {
        setEditingBranch(prev => ({ ...prev, image: base64 }));
      } finally {
        setBranchImageLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 4b. Testimonials Handlers
  const handleOpenTestimonialCreate = () => {
    setEditingTestimonial({
      id: '',
      name: '',
      city: 'Toshkent',
      rating: 5,
      date: 'Bugun',
      outfit: 'Smart Casual / Dvoyka',
      avatar: '/images/avatars/avatar_sardor.jpg',
      comment: ''
    });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenTestimonialEdit = (item) => {
    const commentStr = typeof item.comment === 'object' && item.comment !== null
      ? (item.comment.uz || Object.values(item.comment)[0] || '')
      : (item.comment || '');
    setEditingTestimonial({
      ...item,
      comment: commentStr
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!editingTestimonial.name.trim()) return alert("Mijoz ismini kiriting");
    if (!editingTestimonial.comment.trim()) return alert("Fikr matnini kiriting");
    setTestimonialSaving(true);
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials(data.testimonials);
        setIsTestimonialModalOpen(false);
        showToast("Mijoz fikri muvaffaqiyatli saqlandi!");
        fetchSettings();
      } else {
        alert(data.error || "Fikrni saqlashda xatolik");
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    } finally {
      setTestimonialSaving(false);
    }
  };

  const handleDeleteTestimonial = async (testId) => {
    if (!window.confirm("Ushbu fikrni o'chirib tashlamoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/testimonials?id=${testId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials(data.testimonials);
        showToast("Fikr o'chirildi!");
        fetchSettings();
      } else {
        alert(data.error || "O'chirishda xatolik");
      }
    } catch (err) {
      alert("Xatolik: " + err.message);
    }
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarImageLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ base64, filename: file.name })
        });
        const data = await res.json();
        if (res.ok && data.url) {
          setEditingTestimonial(prev => ({ ...prev, avatar: data.url }));
          showToast("Mijoz rasmi muvaffaqiyatli yuklandi!");
        } else {
          setEditingTestimonial(prev => ({ ...prev, avatar: base64 }));
        }
      } catch (err) {
        setEditingTestimonial(prev => ({ ...prev, avatar: base64 }));
      } finally {
        setAvatarImageLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // 5. Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Haqiqatan ham "${name}" mahsulotini o'chirmoqchimisiz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Mahsulot muvaffaqiyatli o'chirildi!");
        fetchProducts();
      } else {
        alert("O'chirishda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi: " + err.message);
    }
  };

  // 6. Modal Open for Create / Edit
  const handleOpenEdit = (product) => {
    setEditingProduct({
      ...product,
      nameUz: product.name?.uz || (typeof product.name === 'string' ? product.name : ''),
      nameRu: product.name?.ru || '',
      descUz: product.description?.uz || (typeof product.description === 'string' ? product.description : ''),
      descRu: product.description?.ru || '',
      fabricUz: product.fabric?.uz || (typeof product.fabric === 'string' ? product.fabric : ''),
      sizesStr: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      price: product.price || 0,
      oldPrice: product.oldPrice || '',
      badge: product.badge || '',
      category: product.category || (categories[0]?.id || 'dvoyka'),
      image: product.image || ''
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingProduct({
      id: '',
      code: `MRT-${Math.floor(100 + Math.random() * 900)}`,
      nameUz: '',
      nameRu: '',
      descUz: '',
      descRu: '',
      fabricUz: 'Premium sifatli to\'qima',
      sizesStr: 'M (48), L (50), XL (52)',
      price: 950000,
      oldPrice: '',
      badge: 'New 2026',
      category: categories[0]?.id || 'dvoyka',
      image: ''
    });
    setModalError('');
    setIsModalOpen(true);
  };

  // 7. Image Upload via Base64
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadLoading(true);
    setModalError('');

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64: base64Data,
            filename: file.name
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setEditingProduct(prev => ({
            ...prev,
            image: data.url,
            images: [data.url, ...(prev.images || [])]
          }));
          showToast("Rasm muvaffaqiyatli yuklandi!");
        } else {
          setModalError(data.error || "Rasmni yuklashda xatolik yuz berdi");
        }
        setImageUploadLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setModalError("Faylni o'qishda xatolik: " + err.message);
      setImageUploadLoading(false);
    }
  };

  // 8. Save Product Changes
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setModalSaving(true);
    setModalError('');

    if (!editingProduct.nameUz.trim()) {
      setModalError("Mahsulot nomini kiritish shart!");
      setModalSaving(false);
      return;
    }

    if (!editingProduct.image.trim()) {
      setModalError("Iltimos, rasm yuklang yoki rasm havolasini kiriting!");
      setModalSaving(false);
      return;
    }

    const payload = {
      id: editingProduct.id || undefined,
      code: editingProduct.code || `MRT-${Math.floor(100 + Math.random() * 900)}`,
      category: editingProduct.category || 'dvoyka',
      name: {
        uz: editingProduct.nameUz,
        ru: editingProduct.nameRu || editingProduct.nameUz,
        en: editingProduct.nameUz
      },
      price: Number(editingProduct.price) || 0,
      oldPrice: editingProduct.oldPrice ? Number(editingProduct.oldPrice) : null,
      badge: editingProduct.badge || '',
      image: editingProduct.image,
      images: [editingProduct.image],
      description: {
        uz: editingProduct.descUz,
        ru: editingProduct.descRu || editingProduct.descUz,
        en: editingProduct.descUz
      },
      fabric: {
        uz: editingProduct.fabricUz,
        ru: editingProduct.fabricUz,
        en: editingProduct.fabricUz
      },
      sizes: editingProduct.sizesStr.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const isEdit = Boolean(editingProduct.id);
      const url = isEdit ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        showToast(isEdit ? "O'zgarishlar saqlandi!" : "Yangi mahsulot qo'shildi!");
        fetchProducts();
      } else {
        setModalError(data.error || "Saqlashda xatolik yuz berdi");
      }
    } catch (err) {
      setModalError("Server xatoligi: " + err.message);
    } finally {
      setModalSaving(false);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const nameStr = (p.name?.uz || (typeof p.name === 'string' ? p.name : '')).toLowerCase();
    const codeStr = (p.code || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery = !query || nameStr.includes(query) || codeStr.includes(query);
    return matchesCategory && matchesQuery;
  });

  // ==========================================================
  // VIEW 1: LOGIN CARD
  // ==========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080a] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#E5C378]/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md bg-[#0e1015]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E5C378]/10 border border-[#E5C378]/25 text-[#E5C378] mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-display text-2xl font-medium text-white tracking-wide">
              Meratto &amp; De Franko
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#E5C378] mt-1 font-mono">
              Admin Boshqaruv Paneli
            </p>
            <p className="text-sm text-[#8f96a0] mt-2">
              Mahsulotlar, bo'limlar va telefon raqamlarni boshqarish uchun parolni kiriting.
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-2">
                Admin Paroli
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Maxfiy parolni kiriting..."
                  required
                  autoFocus
                  className="w-full bg-[#16181f] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] transition-all pr-12 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8f96a0] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-[#6b7280] mt-1.5">
                Maxfiy admin parolini kiriting
              </p>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#c29e50] text-[#07080a] font-semibold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Panelga Kirish</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 text-xs text-[#8f96a0] hover:text-[#E5C378] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Saytning bosh sahifasiga qaytish</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // VIEW 2: AUTHENTICATED DASHBOARD
  // ==========================================================
  return (
    <div className="min-h-screen bg-[#07080a] text-white font-sans pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#16181f] border border-[#E5C378]/50 text-white px-5 py-3.5 rounded-xl shadow-2xl animate-fade-in backdrop-blur-md">
          <div className="w-6 h-6 rounded-full bg-[#E5C378]/20 flex items-center justify-center text-[#E5C378]">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0e1015]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 flex items-center justify-center text-[#E5C378]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-medium text-lg text-white">Meratto Admin</h1>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#4fc79a]/15 text-[#4fc79a] border border-[#4fc79a]/30">
                  Online
                </span>
              </div>
              <p className="text-xs text-[#8f96a0]">Tovarlar, bo'limlar va telefonlar boshqaruvi</p>
            </div>
          </div>

          {/* Navigation Tabs (Products / Categories / Branches / Testimonials / Contacts) */}
          <div className="flex items-center gap-1 bg-[#16181f] p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'products'
                  ? 'bg-[#E5C378] text-[#07080a] shadow-sm font-semibold'
                  : 'text-[#8f96a0] hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Mahsulotlar ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'categories'
                  ? 'bg-[#E5C378] text-[#07080a] shadow-sm font-semibold'
                  : 'text-[#8f96a0] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bo'limlar ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('branches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'branches'
                  ? 'bg-[#E5C378] text-[#07080a] shadow-sm font-semibold'
                  : 'text-[#8f96a0] hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Filiallar ({branches.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'testimonials'
                  ? 'bg-[#E5C378] text-[#07080a] shadow-sm font-semibold'
                  : 'text-[#8f96a0] hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mijozlar fikrlari ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'contacts'
                  ? 'bg-[#E5C378] text-[#07080a] shadow-sm font-semibold'
                  : 'text-[#8f96a0] hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Aloqa</span>
            </button>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2">
            {activeTab === 'products' && (
              <button
                onClick={handleOpenCreate}
                className="py-2 px-3.5 rounded-xl bg-[#E5C378] text-[#07080a] font-semibold text-xs tracking-wide hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Tovar</span>
              </button>
            )}

            {activeTab === 'branches' && (
              <button
                onClick={handleOpenBranchCreate}
                className="py-2 px-3.5 rounded-xl bg-[#E5C378] text-[#07080a] font-semibold text-xs tracking-wide hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Filial</span>
              </button>
            )}

            {activeTab === 'testimonials' && (
              <button
                onClick={handleOpenTestimonialCreate}
                className="py-2 px-3.5 rounded-xl bg-[#E5C378] text-[#07080a] font-semibold text-xs tracking-wide hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Fikr</span>
              </button>
            )}

            <button
              onClick={onBackToSite}
              className="py-2 px-3 rounded-xl bg-[#16181f] border border-white/10 text-[#8f96a0] hover:text-white text-xs transition-all flex items-center gap-1.5"
              title="Saytga o'tish"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saytni Ko'rish</span>
            </button>

            <button
              onClick={handleLogout}
              className="py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs transition-all flex items-center gap-1.5"
              title="Chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">

        {/* ==========================================================
            TAB 1: PRODUCTS TAB
            ========================================================== */}
        {activeTab === 'products' && (
          <div>
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#0e1015] border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-[#8f96a0] uppercase font-mono">Jami Mahsulotlar</p>
                <p className="text-2xl font-display font-medium text-white mt-1">{products.length} ta</p>
              </div>
              <div className="bg-[#0e1015] border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-[#8f96a0] uppercase font-mono">Bo'limlar Soni</p>
                <p className="text-2xl font-display font-medium text-[#E5C378] mt-1">
                  {categories.length} ta bo'lim
                </p>
              </div>
              <div className="bg-[#0e1015] border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-[#8f96a0] uppercase font-mono">Asosiy Telefon</p>
                <p className="text-base font-mono font-medium text-white mt-2 truncate">
                  {contacts.mainPhone}
                </p>
              </div>
              <div className="bg-[#0e1015] border border-white/5 rounded-2xl p-4">
                <p className="text-xs text-[#8f96a0] uppercase font-mono">Filiallar</p>
                <p className="text-2xl font-display font-medium text-white mt-1">
                  {contacts.branches?.length || 3} ta filial
                </p>
              </div>
            </div>

            {/* Filter & Dynamic Categories Bar (Image in user's prompt!) */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search input */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f96a0]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nomi yoki model kodi bo'yicha qidiruv..."
                  className="w-full bg-[#16181f] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#E5C378]"
                />
              </div>

              {/* Dynamic Categories Tabs with Add / Manage Button */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-[#E5C378] text-[#07080a]'
                      : 'bg-[#16181f] text-[#8f96a0] hover:text-white'
                  }`}
                >
                  Barchasi
                </button>

                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#E5C378] text-[#07080a]'
                        : 'bg-[#16181f] text-[#8f96a0] hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}

                {/* Quick Add / Manage Category Button right on the bar */}
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-2.5 py-1.5 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 text-[#E5C378] hover:bg-[#E5C378]/20 text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1"
                  title="Bo'limlarni qo'shish yoki o'chirish"
                >
                  <Plus className="w-3 h-3" />
                  <span>Bo'lim sozlash</span>
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="p-2 rounded-xl bg-[#16181f] border border-white/10 text-[#8f96a0] hover:text-white transition-all disabled:opacity-50 shrink-0"
                title="Yangilash"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="py-20 text-center text-[#8f96a0] space-y-3">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#E5C378]" />
                <p className="text-sm">Mahsulotlar yuklanmoqda...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-[#0e1015] border border-white/5 rounded-2xl p-8">
                <p className="text-base text-white">Hech qanday mahsulot topilmadi</p>
                <p className="text-xs text-[#8f96a0] mt-1">Ushbu bo'limda hali tovar yo'q yoki qidiruv so'zini o'zgartiring</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const name = p.name?.uz || (typeof p.name === 'string' ? p.name : 'Nomsiz tovar');
                  const desc = p.description?.uz || (typeof p.description === 'string' ? p.description : '');
                  const formattedPrice = (Number(p.price) || 0).toLocaleString('uz-UZ') + " so'm";
                  const formattedOldPrice = p.oldPrice ? (Number(p.oldPrice) || 0).toLocaleString('uz-UZ') + " so'm" : null;
                  const categoryName = categories.find(c => c.id === p.category)?.name || p.category;

                  return (
                    <div 
                      key={p.id}
                      className="bg-[#0e1015] border border-white/10 rounded-2xl overflow-hidden group hover:border-[#E5C378]/40 transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] bg-[#16181f] overflow-hidden">
                        {p.image ? (
                          <img 
                            src={p.image} 
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#555a64]">
                            <ImageIcon className="w-10 h-10" />
                          </div>
                        )}

                        {p.badge && (
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#07080a]/80 backdrop-blur-md border border-[#E5C378]/30 text-[#E5C378] text-[10px] font-mono font-medium uppercase">
                            {p.badge}
                          </div>
                        )}

                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#07080a]/80 backdrop-blur-md text-[#8f96a0] text-[10px] font-mono">
                          {p.code || 'NO-CODE'}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-baseline justify-between gap-2 mb-2">
                            <span className="text-[11px] font-mono text-[#E5C378] uppercase px-2 py-0.5 rounded bg-[#E5C378]/10 border border-[#E5C378]/20">
                              {categoryName}
                            </span>
                            <div className="text-right">
                              <span className="text-base font-semibold text-white">
                                {formattedPrice}
                              </span>
                              {formattedOldPrice && (
                                <span className="block text-[11px] text-[#6b7280] line-through">
                                  {formattedOldPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <h3 className="font-medium text-sm text-white line-clamp-1 mb-1.5" title={name}>
                            {name}
                          </h3>

                          <p className="text-xs text-[#8f96a0] line-clamp-2 leading-relaxed mb-3">
                            {desc || "Tavsif mavjud emas."}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                          <div className="text-[11px] text-[#6b7280] truncate">
                            {Array.isArray(p.sizes) ? p.sizes.join(' · ') : ''}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-2 rounded-xl bg-[#16181f] text-[#E5C378] hover:bg-[#E5C378] hover:text-[#07080a] transition-all"
                              title="Tahrirlash (Rasm va Yozuvlarni o'zgartirish)"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id, name)}
                              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================
            TAB 2: CATEGORIES (BO'LIMLAR) MANAGEMENT
            ========================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            {/* Header info */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-medium text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#E5C378]" />
                  <span>Katalog Bo'limlari (Kategoriyalar)</span>
                </h2>
                <p className="text-xs text-[#8f96a0] mt-1">
                  Saytdagi katalog filterlarida ko'rinadigan bo'limlarni qo'shing, nomini o'zgartiring yoki o'chiring.
                </p>
              </div>

              <span className="text-xs font-mono text-[#E5C378] px-3 py-1.5 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30">
                Jami: {categories.length} ta faol bo'lim
              </span>
            </div>

            {/* Add New Category Card */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6">
              <h3 className="font-medium text-sm text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#E5C378]" />
                <span>Yangi Bo'lim Qo'shish</span>
              </h3>

              <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Bo'lim nomi (Masalan: Sport Kostyumlar, Palto, Aksessuarlar)..."
                    required
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                <div className="w-full sm:w-56">
                  <input
                    type="text"
                    value={newCatId}
                    onChange={(e) => setNewCatId(e.target.value)}
                    placeholder="ID (Ixtiyoriy, masalan: sport_dvoyka)"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#E5C378] font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={catActionLoading || !newCatName.trim()}
                  className="py-2.5 px-5 rounded-xl bg-[#E5C378] text-[#07080a] font-semibold text-xs tracking-wide hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Bo'limni Qo'shish</span>
                </button>
              </form>
            </div>

            {/* Existing Categories Table */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8f96a0]">
                  Mavjud Bo'limlar Ro'yxati
                </span>
                <span className="text-xs text-[#8f96a0]">
                  O'chirilganda katalogdan avtomatik olib tashlanadi
                </span>
              </div>

              <div className="divide-y divide-white/5">
                {categories.map((cat, idx) => {
                  const count = products.filter(p => p.category === cat.id).length;
                  const isEditing = editingCat?.id === cat.id;

                  return (
                    <div key={cat.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#16181f] text-[#8f96a0] font-mono text-xs flex items-center justify-center border border-white/5">
                          {idx + 1}
                        </span>

                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingCat.name}
                              onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                              className="bg-[#16181f] border border-[#E5C378] rounded-lg px-3 py-1 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdateCategory(cat.id, editingCat.name)}
                              className="p-1.5 rounded-lg bg-[#4fc79a] text-black"
                              title="Saqlash"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingCat(null)}
                              className="p-1.5 rounded-lg bg-white/10 text-white"
                              title="Bekor qilish"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-white">{cat.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#8f96a0] border border-white/5">
                                id: {cat.id}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#6b7280] block mt-0.5">
                              Ushbu bo'limda {count} ta tovar bor
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {!isEditing && (
                          <button
                            onClick={() => setEditingCat({ id: cat.id, name: cat.name })}
                            className="p-2 rounded-xl bg-[#16181f] text-[#8f96a0] hover:text-[#E5C378] hover:bg-[#E5C378]/10 transition-all"
                            title="Nomini o'zgartirish"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                          title="Bo'limni o'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 3: CONTACTS & PHONE NUMBERS MANAGEMENT
            ========================================================== */}
        {activeTab === 'contacts' && (
          <form onSubmit={handleSaveContacts} className="space-y-8">
            {/* Header info */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-medium text-white flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#E5C378]" />
                  <span>Telefon Raqamlari va Aloqa Sozlamalari</span>
                </h2>
                <p className="text-xs text-[#8f96a0] mt-1">
                  Saytning bosh menyusida (Header), filiallar bo'limida va footerda ko'rinadigan barcha raqamlarni yangilang.
                </p>
              </div>

              <button
                type="submit"
                disabled={contactsSaving}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#c29e50] text-[#07080a] font-semibold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {contactsSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Raqamlarni Saqlash</span>
                  </>
                )}
              </button>
            </div>

            {/* Main Primary Phone Card */}
            <div className="bg-[#0e1015] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#E5C378]/10 text-[#E5C378] flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-white">Asosiy Telefon Raqam</h3>
                  <p className="text-[11px] text-[#8f96a0]">
                    Saytning yuqori bosh menyusida (Header) turuvchi tezkor qo'ng'iroq raqami
                  </p>
                </div>
              </div>

              <div className="max-w-md">
                <input
                  type="text"
                  value={contacts.mainPhone}
                  onChange={(e) => setContacts({ ...contacts, mainPhone: e.target.value })}
                  placeholder="+998 98 311 33 37"
                  required
                  className="w-full bg-[#16181f] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-[#6b7280] focus:outline-none focus:border-[#E5C378]"
                />
              </div>
            </div>

            {/* Branches Phone Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(contacts.branches || []).map((branch, bIdx) => (
                <div key={branch.id} className="bg-[#0e1015] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-[#4fc79a]" />
                      <h4 className="font-medium text-sm text-white">{branch.name}</h4>
                    </div>
                    <p className="text-[11px] text-[#8f96a0] mb-4">{branch.address}</p>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8f96a0] mb-1">
                          1-Telefon Raqam (Asosiy)
                        </label>
                        <input
                          type="text"
                          value={branch.phones?.[0] || ''}
                          onChange={(e) => updateBranchPhone(bIdx, 0, e.target.value)}
                          placeholder="+998 98 311 33 37"
                          required
                          className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E5C378]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono uppercase text-[#8f96a0] mb-1">
                          2-Telefon Raqam (Qo'shimcha)
                        </label>
                        <input
                          type="text"
                          value={branch.phones?.[1] || ''}
                          onChange={(e) => updateBranchPhone(bIdx, 1, e.target.value)}
                          placeholder="+998 99 866 52 25"
                          className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E5C378]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/5 text-[10px] text-[#6b7280]">
                    Footer &amp; Filiallar bo'limida avtomatik yangilanadi
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Save Action */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={contactsSaving}
                className="py-3 px-8 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#c29e50] text-[#07080a] font-semibold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {contactsSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>O'zgarishlarni Saqlash</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ==========================================================
            VIEW: BRANCHES MANAGEMENT
            ========================================================== */}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e1015] border border-white/10 rounded-2xl p-6">
              <div>
                <h2 className="font-display text-lg font-medium text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#E5C378]" />
                  <span>Toshkentdagi Filiallar &amp; Do'konlar ({branches.length})</span>
                </h2>
                <p className="text-xs text-[#8f96a0] mt-1">
                  Har bir filialning rasmi, manzili, mo'ljali, ish vaqti va telefonlarini o'zgartiring
                </p>
              </div>
              <button
                onClick={handleOpenBranchCreate}
                className="py-2.5 px-4 rounded-xl bg-[#E5C378] text-[#07080a] font-semibold text-xs tracking-wide hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Filial Qo'shish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((b, idx) => (
                <div key={b.id || idx} className="bg-[#0e1015] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all">
                  <div>
                    {/* Branch Image */}
                    <div className="relative aspect-[16/10] bg-black/60 overflow-hidden">
                      <img src={b.image} alt={b.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/70 border border-white/10 font-mono text-[9px] uppercase tracking-wider text-[#E5C378]">
                        NODE 0{idx + 1} // {b.badge}
                      </div>
                      <div className="absolute bottom-2.5 right-3 font-mono text-[9px] text-[#4fc79a] bg-black/70 px-2 py-0.5 rounded-full border border-white/10">
                        {b.status || 'OCHIQ'}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-display font-medium text-base text-white">{b.name}</h3>
                        <span className="text-[11px] text-[#E5C378] font-mono">{b.brand || 'Meratto'}</span>
                      </div>

                      <div className="space-y-1.5 text-xs text-[#8f96a0]">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#E5C378] shrink-0 mt-0.5" />
                          <div>
                            <div className="text-white">{typeof b.address === 'object' ? b.address.uz : b.address}</div>
                            <div className="text-[11px] text-[#8f96a0] mt-0.5">{typeof b.landmark === 'object' ? b.landmark.uz : b.landmark}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-[#E5C378] shrink-0" />
                          <span>{b.hours || 'Har kuni 10:00 — 23:00'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 space-y-1">
                        <div className="text-[10px] font-mono text-[#8f96a0] uppercase">Telefonlar:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(b.phones) ? b.phones : []).map((ph, pIdx) => (
                            <span key={pIdx} className="px-2 py-0.5 rounded-md bg-[#16181f] border border-white/5 font-mono text-[11px] text-[#eef0f3]">
                              {ph}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2 bg-[#12141a]">
                    <button
                      onClick={() => handleOpenBranchEdit(b)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium transition-all flex items-center justify-center gap-1.5 border border-white/5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>Tahrirlash</span>
                    </button>
                    {branches.length > 1 && (
                      <button
                        onClick={() => handleDeleteBranch(b.id)}
                        className="py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all border border-red-500/20"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================================
            VIEW: TESTIMONIALS / REVIEWS MANAGEMENT
            ========================================================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0e1015] border border-white/10 rounded-2xl p-6">
              <div>
                <h2 className="font-display text-lg font-medium text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#E5C378]" />
                  <span>Mijozlar Fikrlari &amp; Sharhlari ({testimonials.length})</span>
                </h2>
                <p className="text-xs text-[#8f96a0] mt-1">
                  Saytdagi mijozlar taassurotlarini tahrirlang, yangi xaridlar fikrini qo'shing yoki o'chiring
                </p>
              </div>
              <button
                onClick={handleOpenTestimonialCreate}
                className="py-2.5 px-4 rounded-xl bg-[#E5C378] text-[#07080a] font-semibold text-xs tracking-wide hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Fikr Qo'shish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => {
                const commentStr = typeof t.comment === 'object' && t.comment !== null
                  ? (t.comment.uz || Object.values(t.comment)[0] || '')
                  : (t.comment || '');

                return (
                  <div key={t.id || idx} className="bg-[#0e1015] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all relative">
                    <Quote className="absolute top-5 right-5 w-6 h-6 text-white/5 pointer-events-none" />

                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(Math.max(1, Math.min(5, Number(t.rating) || 5)))].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#E5C378] text-[#E5C378]" />
                        ))}
                        <span className="text-[11px] font-mono text-[#8f96a0] ml-1.5">{t.rating || 5}.0</span>
                      </div>

                      {/* Comment */}
                      <p className="text-xs text-[#eef0f3] leading-relaxed mb-4 italic">
                        "{commentStr}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar || '/images/avatars/avatar_sardor.jpg'}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-md shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-display font-medium text-sm text-white truncate">{t.name}</h4>
                          <div className="text-[11px] text-[#8f96a0] truncate">{t.city}</div>
                          {t.outfit && <div className="text-[10px] text-[#E5C378] font-mono truncate">{t.outfit}</div>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono text-[#6b7280]">{t.date || 'Sana'}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenTestimonialEdit(t)}
                            className="py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[11px] transition-all flex items-center gap-1 border border-white/5"
                          >
                            <Edit3 className="w-3 h-3 text-[#E5C378]" />
                            <span>Tahrirlash</span>
                          </button>
                          <button
                            onClick={() => handleDeleteTestimonial(t.id)}
                            className="py-1 px-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] transition-all border border-red-500/20"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ==========================================================
          MODAL: EDIT / ADD PRODUCT (Image & Captions Manager)
          ========================================================== */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0e1015] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-display text-xl font-medium text-white">
                  {editingProduct.id ? "Tovarni Tahrirlash" : "Yangi Tovar Qo'shish"}
                </h2>
                <p className="text-xs text-[#8f96a0] mt-0.5">
                  Rasmni yangilang va uning ostidagi barcha yozuvlarni o'zgartiring
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-[#8f96a0] hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* SECTION 1: IMAGE UPLOADER */}
              <div className="bg-[#16181f] border border-white/5 rounded-2xl p-4 sm:p-5">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#E5C378] mb-3">
                  📸 Tovar Rasmi
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-36 h-36 rounded-xl bg-[#0e1015] border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {editingProduct.image ? (
                      <img 
                        src={editingProduct.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-[#555a64]">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-[10px] block">Rasm yo'q</span>
                      </div>
                    )}

                    {imageUploadLoading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-[#E5C378]" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploadLoading}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#E5C378]/10 border border-[#E5C378]/30 hover:bg-[#E5C378]/20 text-[#E5C378] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Kompyuterdan Rasm Yuklash</span>
                      </button>
                    </div>

                    <div className="relative">
                      <span className="text-[10px] text-[#8f96a0] block mb-1">
                        Yoki to'g'ridan-to'g'ri rasm havolasini (URL) kiriting:
                      </span>
                      <input
                        type="text"
                        value={editingProduct.image}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        placeholder="/images/products/suit.jpg yoki https://..."
                        className="w-full bg-[#0e1015] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRODUCT TEXTS & CAPTIONS */}
              <div className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                    Mahsulot Nomi (Sarlavha) *
                  </label>
                  <input
                    type="text"
                    value={editingProduct.nameUz}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameUz: e.target.value })}
                    placeholder="Masalan: Meratto Sport-Chic Qora Dvoyka"
                    required
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                    Mahsulot Tavsifi (Rasm ostidagi matn)
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.descUz}
                    onChange={(e) => setEditingProduct({ ...editingProduct, descUz: e.target.value })}
                    placeholder="Kiyim haqida batafsil ma'lumot, bichimi, kimlar uchun mosligi..."
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378] leading-relaxed resize-none"
                  />
                </div>

                {/* Fabric Material */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                    Mato Tarkibi
                  </label>
                  <input
                    type="text"
                    value={editingProduct.fabricUz}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabricUz: e.target.value })}
                    placeholder="Masalan: 78% Virgin Wool, 18% Viskoza, 4% Elastan"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                {/* Grid: Price, Old Price, Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                      Narxi (so'm) *
                    </label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      placeholder="950000"
                      required
                      className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                      Eski Narxi (so'm)
                    </label>
                    <input
                      type="number"
                      value={editingProduct.oldPrice}
                      onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value })}
                      placeholder="1150000"
                      className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                      Kategoriya (Bo'lim) *
                    </label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Grid: Badge & Sizes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                      Belgi / Badge (Masalan: Bestseller, New 2026)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.badge}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      placeholder="New 2026"
                      className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0] mb-1.5">
                      O'lchamlar (Vergul bilan ajrating)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sizesStr}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sizesStr: e.target.value })}
                      placeholder="M (48), L (50), XL (52)"
                      className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#555a64] focus:outline-none focus:border-[#E5C378]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-5 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#16181f] text-[#8f96a0] hover:text-white text-xs transition-colors"
                >
                  Bekor qilish
                </button>

                <button
                  type="submit"
                  disabled={modalSaving || imageUploadLoading}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#c29e50] text-[#07080a] font-semibold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {modalSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>O'zgarishlarni Saqlash</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL: EDIT / ADD BRANCH
          ========================================================== */}
      {isBranchModalOpen && editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0e1015] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-display text-xl font-medium text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#E5C378]" />
                  <span>{editingBranch.id ? "Filialni Tahrirlash" : "Yangi Filial Qo'shish"}</span>
                </h2>
                <p className="text-xs text-[#8f96a0] mt-0.5">
                  Do'kon rasmi, manzili, ish vaqti va telefonlarini kiriting
                </p>
              </div>
              <button
                onClick={() => setIsBranchModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#8f96a0] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-6">
              {/* Branch Image Preview & Upload */}
              <div className="p-4 rounded-xl bg-[#16181f] border border-white/10 space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8f96a0]">
                  Do'kon / Filial Fotosurati
                </label>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-48 aspect-[16/10] rounded-xl bg-black/60 border border-white/10 overflow-hidden relative shrink-0">
                    <img 
                      src={editingBranch.image || '/images/branches/branch_qoratosh_flagship.jpg'} 
                      alt="Branch preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      ref={branchFileInputRef}
                      onChange={handleBranchImageFile}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={branchImageLoading}
                      onClick={() => branchFileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium transition-all flex items-center justify-center gap-2"
                    >
                      {branchImageLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#E5C378]" /> : <Upload className="w-4 h-4 text-[#E5C378]" />}
                      <span>{branchImageLoading ? "Yuklanmoqda..." : "Kompyuterdan Rasm Yuklash"}</span>
                    </button>

                    <input
                      type="text"
                      value={editingBranch.image || ''}
                      onChange={(e) => setEditingBranch({ ...editingBranch, image: e.target.value })}
                      placeholder="Yoki rasm URL manzilini kiriting..."
                      className="w-full bg-[#0e1015] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#E5C378]"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Do'kon Nomi *
                  </label>
                  <input
                    type="text"
                    value={editingBranch.name || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    placeholder="Masalan: Meratto Qoratosh"
                    required
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Brend
                  </label>
                  <select
                    value={editingBranch.brand || 'Meratto'}
                    onChange={(e) => setEditingBranch({ ...editingBranch, brand: e.target.value })}
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  >
                    <option value="Meratto">Meratto</option>
                    <option value="De Franko">De Franko</option>
                  </select>
                </div>
              </div>

              {/* Badge & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Belgisi (Badge)
                  </label>
                  <input
                    type="text"
                    value={editingBranch.badge || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, badge: e.target.value })}
                    placeholder="Masalan: Bosh do'kon yoki Eksklyuziv butik"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Status Belgisi
                  </label>
                  <input
                    type="text"
                    value={editingBranch.status || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, status: e.target.value })}
                    placeholder="Masalan: OCHIQ (10:00 - 22:00)"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>
              </div>

              {/* Address & Landmark */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Aniq Manzil
                  </label>
                  <input
                    type="text"
                    value={editingBranch.address || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                    placeholder="Masalan: Qoratosh ko'chasi, 5B-uy"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Mo'ljal
                  </label>
                  <input
                    type="text"
                    value={editingBranch.landmark || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, landmark: e.target.value })}
                    placeholder="Masalan: Samarqand Darvoza savdo markazidan o'tganda"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>
              </div>

              {/* Hours & Yandex Maps Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Ish Vaqti
                  </label>
                  <input
                    type="text"
                    value={editingBranch.hours || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, hours: e.target.value })}
                    placeholder="Har kuni 10:00 — 23:00"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Yandex Xarita Havolasi
                  </label>
                  <input
                    type="text"
                    value={editingBranch.mapUrl || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, mapUrl: e.target.value })}
                    placeholder="https://yandex.uz/maps/..."
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>
              </div>

              {/* Phones List */}
              <div className="p-4 rounded-xl bg-[#16181f] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Filial Telefon Raqamlari
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingBranch({
                      ...editingBranch,
                      phones: [...(editingBranch.phones || []), '+998 ']
                    })}
                    className="text-[11px] text-[#E5C378] hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Raqam Qo'shish</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingBranch.phones || []).map((ph, phIdx) => (
                    <div key={phIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={ph}
                        onChange={(e) => {
                          const newPhones = [...editingBranch.phones];
                          newPhones[phIdx] = e.target.value;
                          setEditingBranch({ ...editingBranch, phones: newPhones });
                        }}
                        placeholder="+998 90 123 45 67"
                        className="flex-1 bg-[#0e1015] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#E5C378]"
                      />
                      {editingBranch.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newPhones = editingBranch.phones.filter((_, i) => i !== phIdx);
                            setEditingBranch({ ...editingBranch, phones: newPhones });
                          }}
                          className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#16181f] text-[#8f96a0] hover:text-white text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={branchSaving || branchImageLoading}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#c29e50] text-[#07080a] font-semibold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {branchSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{branchSaving ? "Saqlanmoqda..." : "Filialni Saqlash"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL: EDIT / ADD TESTIMONIAL
          ========================================================== */}
      {isTestimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0e1015] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div>
                <h2 className="font-display text-xl font-medium text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#E5C378]" />
                  <span>{editingTestimonial.id ? "Fikrni Tahrirlash" : "Yangi Fikr Qo'shish"}</span>
                </h2>
                <p className="text-xs text-[#8f96a0] mt-0.5">
                  Mijoz ismi, bahosi, kiygan kiyimi va sharhini kiriting
                </p>
              </div>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[#8f96a0] hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-5">
              {/* Client Avatar Upload */}
              <div className="p-4 rounded-xl bg-[#16181f] border border-white/10 flex items-center gap-4">
                <img
                  src={editingTestimonial.avatar || '/images/avatars/avatar_sardor.jpg'}
                  alt="Avatar preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#E5C378]/50 shadow-md shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    onChange={handleAvatarFile}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={avatarImageLoading}
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs transition-all flex items-center gap-2"
                  >
                    {avatarImageLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E5C378]" /> : <Upload className="w-3.5 h-3.5 text-[#E5C378]" />}
                    <span>{avatarImageLoading ? "Yuklanmoqda..." : "Rasm Yuklash"}</span>
                  </button>
                  <input
                    type="text"
                    value={editingTestimonial.avatar || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, avatar: e.target.value })}
                    placeholder="Yoki avatar URL manzili..."
                    className="w-full bg-[#0e1015] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-[#6b7280] focus:outline-none focus:border-[#E5C378]"
                  />
                </div>
              </div>

              {/* Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Mijoz Ismi *
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="Masalan: Sardor Mirzayev"
                    required
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Shahar / Filial
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.city || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, city: e.target.value })}
                    placeholder="Masalan: Toshkent (Qoratosh filiali)"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>
              </div>

              {/* Rating & Purchased Outfit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Baho (Yulduzlar)
                  </label>
                  <div className="flex items-center gap-2 bg-[#16181f] border border-white/10 rounded-xl px-3 py-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= (editingTestimonial.rating || 5)
                              ? 'fill-[#E5C378] text-[#E5C378]'
                              : 'text-white/20'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-mono text-[#E5C378] ml-2">
                      {editingTestimonial.rating || 5}.0
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                    Xarid Qilingan Kiyim (Outfit)
                  </label>
                  <input
                    type="text"
                    value={editingTestimonial.outfit || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, outfit: e.target.value })}
                    placeholder="Masalan: Smart Casual Dvoyka"
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                  />
                </div>
              </div>

              {/* Comment Text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                  Mijoz Fikri (Izoh) *
                </label>
                <textarea
                  rows={4}
                  value={editingTestimonial.comment || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                  placeholder="Mijozning samimiy fikrini yozing..."
                  required
                  className="w-full bg-[#16181f] border border-white/10 rounded-xl p-3.5 text-xs text-white leading-relaxed focus:outline-none focus:border-[#E5C378]"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase text-[#8f96a0]">
                  Sana
                </label>
                <input
                  type="text"
                  value={editingTestimonial.date || 'Bugun'}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, date: e.target.value })}
                  placeholder="Masalan: 15 Oktabr, 2026"
                  className="w-full bg-[#16181f] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#E5C378]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-[#16181f] text-[#8f96a0] hover:text-white text-xs transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={testimonialSaving || avatarImageLoading}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#E5C378] to-[#c29e50] text-[#07080a] font-semibold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {testimonialSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{testimonialSaving ? "Saqlanmoqda..." : "Fikrni Saqlash"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
