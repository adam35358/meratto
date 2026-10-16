import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, ShieldCheck, MapPin, CreditCard, Truck, Store, Sparkles, AlertCircle, MessageSquare } from 'lucide-react';
import { branches } from '../data/branches';
import { sendTelegramOrder } from '../services/telegram';

export default function OrderForm({ prefillProduct, cart, clearCart, lang, t }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [deliveryType, setDeliveryType] = useState('courier'); // 'courier' | 'branch'
  const [selectedBranch, setSelectedBranch] = useState(branches[0].id);
  const [paymentType, setPaymentType] = useState('door'); // 'door' | 'online' | 'store'
  const [notes, setNotes] = useState('');
  const [customProductText, setCustomProductText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sync with prefilled product
  useEffect(() => {
    if (prefillProduct) {
      const prodName = prefillProduct.name[lang] || prefillProduct.name.uz;
      const sizeText = prefillProduct.selectedSize ? ` [O'lcham: ${prefillProduct.selectedSize}]` : '';
      setCustomProductText(`${prodName}${sizeText}`);
    }
  }, [prefillProduct, lang]);

  const getCartSummaryText = () => {
    if (cart.length > 0) {
      return cart.map(item => `${item.name[lang] || item.name.uz} [${item.selectedSize}] x ${item.quantity}`).join(', ');
    }
    return customProductText || '';
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value;
    if (!val.startsWith('+998')) {
      setPhone('+998 ');
    } else {
      setPhone(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (phone.trim().length < 9) {
      alert("Iltimos, telefon raqamingizni to'liq kiriting!");
      return;
    }

    setIsSubmitting(true);

    let items = [];
    if (cart.length > 0) {
      items = cart.map(item => ({
        id: item.id,
        name: typeof item.name === 'object' ? (item.name[lang] || item.name.uz || item.name.ru) : item.name,
        code: item.code || item.modelCode || '',
        selectedSize: item.selectedSize || '',
        quantity: item.quantity || 1,
        price: Number(item.price) || 0,
        lookItems: item.lookItems || [],
        availableBranches: item.availableBranches || []
      }));
    } else if (prefillProduct) {
      items = [{
        id: prefillProduct.id,
        name: typeof prefillProduct.name === 'object' ? (prefillProduct.name[lang] || prefillProduct.name.uz || prefillProduct.name.ru) : prefillProduct.name,
        code: prefillProduct.code || prefillProduct.modelCode || '',
        selectedSize: prefillProduct.selectedSize || '',
        quantity: 1,
        price: Number(prefillProduct.price) || 0,
        lookItems: prefillProduct.lookItems || [],
        availableBranches: prefillProduct.availableBranches || []
      }];
    }

    const totalSum = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const chosenBranch = branches.find(b => b.id === selectedBranch)?.name || 'Meratto Qoratosh';
    const branchName = deliveryType === 'branch'
      ? chosenBranch
      : (items[0]?.availableBranches?.length > 0 ? items[0].availableBranches.join(', ') : "Meratto Qoratosh, Meratto Chilonzor, De Franko");

    const payload = {
      name: name.trim() || "Mijoz",
      phone: phone.trim(),
      items,
      totalSum,
      branchName,
      products: getCartSummaryText() || "Smart Casual kiyimlar konsultatsiyasi",
      deliveryType: deliveryType === 'courier' ? "Kuryer orqali yetkazish" : `Do'kondan olib ketish (${chosenBranch})`,
      paymentType: paymentType === 'door' ? "Eshik oldida (Naqd/Karta)" : paymentType === 'online' ? "Click / Payme" : "Do'konda to'lash",
      notes: notes.trim(),
      date: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })
    };

    try {
      await sendTelegramOrder(payload);
      setIsSubmitting(false);
      setSubmittedData(payload);
      setIsSuccess(true);
      if (clearCart) clearCart();
    } catch (err) {
      setIsSubmitting(false);
      console.error("Telegram order dispatch failed:", err);
      setErrorMessage(err.message || "Telegram botga buyurtma yuborishda xatolik yuz berdi.");
    }
  };

  return (
    <section id="order" data-reveal="scale" className="py-20 sm:py-28 relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#E5C378]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header in WOUFX Style */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="woufx-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C378]" />
            <span>ORDER EXECUTION TERMINAL</span>
          </div>
          <h2 className="font-display font-light text-3xl sm:text-5xl text-white tracking-[-0.03em]">
            {t.form.title}
          </h2>
          <p className="text-sm sm:text-base text-[#8f96a0] font-normal">
            {t.form.subtitle}
          </p>
        </div>

        {/* Main Terminal Form Card */}
        <div className="p-6 sm:p-10 rounded-2xl woufx-panel-strong shadow-2xl relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error Notification Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setErrorMessage('')} 
                  className="text-rose-400 hover:text-white px-2 py-0.5 text-sm font-bold"
                >
                  &times;
                </button>
              </div>
            )}

            {/* Input Row 1: Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-[10px] text-[#8f96a0] uppercase tracking-[0.16em] mb-2">
                  {t.form.nameLabel} <span className="text-[#E5C378]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.form.namePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-[#07080a] border border-white/10 text-white placeholder-[#5f6671] focus:outline-none focus:border-[#E5C378]/60 transition-colors text-sm font-sans"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#8f96a0] uppercase tracking-[0.16em] mb-2">
                  {t.form.phoneLabel} <span className="text-[#E5C378]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder={t.form.phonePlaceholder}
                  className="w-full px-4 py-3 rounded-xl bg-[#07080a] border border-white/10 text-white placeholder-[#5f6671] focus:outline-none focus:border-[#E5C378]/60 transition-colors text-sm font-mono"
                />
              </div>
            </div>

            {/* Input Row 2: Selected Item(s) */}
            <div>
              <label className="block font-mono text-[10px] text-[#8f96a0] uppercase tracking-[0.16em] mb-2">
                {t.form.selectedProductLabel}
              </label>
              <input
                type="text"
                value={getCartSummaryText()}
                onChange={(e) => setCustomProductText(e.target.value)}
                placeholder={t.form.selectedPlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-[#07080a] border border-white/10 text-[#E5C378] placeholder-[#5f6671] focus:outline-none focus:border-[#E5C378]/60 transition-colors text-sm font-mono font-medium"
              />
              {cart.length > 0 && (
                <div className="font-mono text-[10px] text-[#4fc79a] mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4fc79a]" />
                  <span>Savatdagi {cart.length} ta mahsulot avtomatik kiritildi</span>
                </div>
              )}
            </div>

            {/* Delivery Method Selector (WOUFX segmented cards) */}
            <div>
              <label className="block font-mono text-[10px] text-[#8f96a0] uppercase tracking-[0.16em] mb-2">
                {t.form.deliveryLabel}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryType('courier')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    deliveryType === 'courier'
                      ? 'border-[#E5C378] bg-white/[0.05] text-white shadow-lg shadow-[#E5C378]/10'
                      : 'border-white/10 bg-[#07080a] text-[#8f96a0] hover:border-white/20'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${deliveryType === 'courier' ? 'text-[#E5C378]' : 'text-[#8f96a0]'}`} />
                  <div>
                    <div className="font-display font-medium text-xs text-white">{t.form.deliveryCourier}</div>
                    <div className="font-mono text-[10px] text-[#8f96a0]">{t.form.deliveryCourierSub}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('branch')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    deliveryType === 'branch'
                      ? 'border-[#E5C378] bg-white/[0.05] text-white shadow-lg shadow-[#E5C378]/10'
                      : 'border-white/10 bg-[#07080a] text-[#8f96a0] hover:border-white/20'
                  }`}
                >
                  <Store className={`w-5 h-5 ${deliveryType === 'branch' ? 'text-[#E5C378]' : 'text-[#8f96a0]'}`} />
                  <div>
                    <div className="font-display font-medium text-xs text-white">{t.form.deliveryBranch}</div>
                    <div className="font-mono text-[10px] text-[#8f96a0]">{t.form.deliveryBranchSub}</div>
                  </div>
                </button>
              </div>
            </div>

            {/* If Branch Pickup: Select Branch */}
            {deliveryType === 'branch' && (
              <div className="p-4 rounded-xl bg-[#07080a] border border-white/10 space-y-2 animate-fade-in">
                <label className="block font-mono text-[10px] text-[#8f96a0] uppercase tracking-[0.16em]">
                  {t.form.branchSelectLabel || "Filialni tanlang:"}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {branches.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBranch(b.id)}
                      className={`px-3 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider text-left transition-all border ${
                        selectedBranch === b.id 
                          ? 'border-[#E5C378] text-[#E5C378] bg-white/[0.06]' 
                          : 'border-white/5 text-[#8f96a0] hover:border-white/15'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block font-mono text-[10px] text-[#8f96a0] uppercase tracking-[0.16em] mb-2">
                {t.form.paymentLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentType('door')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentType === 'door'
                      ? 'border-[#E5C378] bg-white/[0.05] text-[#E5C378]'
                      : 'border-white/10 bg-[#07080a] text-[#8f96a0] hover:border-white/20'
                  }`}
                >
                  <div className="font-display font-medium text-xs">{t.form.paymentDoor}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('online')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentType === 'online'
                      ? 'border-[#E5C378] bg-white/[0.05] text-[#E5C378]'
                      : 'border-white/10 bg-[#07080a] text-[#8f96a0] hover:border-white/20'
                  }`}
                >
                  <div className="font-display font-medium text-xs">Click / Payme</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentType('store')}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentType === 'store'
                      ? 'border-[#E5C378] bg-white/[0.05] text-[#E5C378]'
                      : 'border-white/10 bg-[#07080a] text-[#8f96a0] hover:border-white/20'
                  }`}
                >
                  <div className="font-display font-medium text-xs">{t.form.paymentStore}</div>
                </button>
              </div>
            </div>

            {/* Dedicated Izohlar (Order Notes / Instructions) Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs text-[#E5C378] uppercase tracking-[0.16em] flex items-center gap-1.5 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>{t.form.notesLabel || "Izohlar (Yetkazish manzili, vaqti yoki kiyim o'lchami bo'yicha)"}</span>
                </label>
                <span className="text-[10px] font-mono text-[#8f96a0]">(Ixtiyoriy)</span>
              </div>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.form.notesPlaceholder || "Yetkazish manzili, qulay vaqt yoki bo'y-vazn bo'yicha izoh qoldiring..."}
                className="w-full px-4 py-3 rounded-xl bg-[#07080a] border border-white/10 text-white placeholder-[#5f6671] focus:outline-none focus:border-[#E5C378]/60 transition-colors text-sm leading-relaxed resize-none"
              />
              <div className="text-[10px] text-[#8f96a0] mt-1.5 flex items-center gap-1 font-mono">
                <span className="text-[#E5C378]">💡</span>
                <span>Aniq manzil, dom kodi, etaj yoki qulay vaqtni shu yerga yozishingiz mumkin.</span>
              </div>
            </div>

            {/* Submit Button in WOUFX Style */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-woufx-primary w-full py-3.5 text-xs font-mono tracking-[0.14em] uppercase flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>{t.form.submitting || "YUBORILMOQDA..."}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.form.submitBtn || "BUYURTMANI TASDIQLASH"}</span>
                </>
              )}
            </button>

            {/* Security Guarantee Note */}
            <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-[#8f96a0] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#4fc79a]" />
              <span>{t.form.securityNotice || "100% XAVFSIZ VA RASMIY BUYURTMA TERMINALI • TOSHKENT"}</span>
            </div>

          </form>

        </div>

      </div>

      {/* Success Modal in WOUFX Receipt Style */}
      {isSuccess && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="woufx-panel-strong rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#4fc79a]/40 shadow-2xl relative space-y-5">
            <div className="w-12 h-12 rounded-full bg-[#4fc79a]/20 border border-[#4fc79a]/40 flex items-center justify-center mx-auto text-[#4fc79a]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-display font-medium text-xl text-white">
                {t.form.successTitle || "Buyurtmangiz qabul qilindi!"}
              </h3>
              <p className="text-xs text-[#8f96a0]">
                {t.form.successDesc || "Menejerimiz bir necha daqiqa ichida siz bilan bog'lanadi."}
              </p>
            </div>

            <div className="bg-[#07080a] rounded-xl p-4 border border-white/10 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-[#8f96a0]">
                <span>MIJOZ:</span>
                <span className="text-white font-medium">{submittedData.name}</span>
              </div>
              <div className="flex justify-between text-[#8f96a0]">
                <span>TEL:</span>
                <span className="text-[#E5C378] font-medium">{submittedData.phone}</span>
              </div>
              <div className="flex justify-between text-[#8f96a0]">
                <span>MAHSULOT:</span>
                <span className="text-white font-medium text-right line-clamp-1">{submittedData.products}</span>
              </div>
              <div className="flex justify-between text-[#8f96a0]">
                <span>YETKAZISH:</span>
                <span className="text-white">{submittedData.deliveryType}</span>
              </div>
            </div>

            {/* Telegram Instant Dispatch */}
            <a
              href={`https://t.me/meratto?text=${encodeURIComponent(`Salom! Buyurtma rasmiylashtirdim:\nIsm: ${submittedData.name}\nTel: ${submittedData.phone}\nKiyim: ${submittedData.products}\nYetkazish: ${submittedData.deliveryType}\nIzoh: ${submittedData.notes || "Yo'q"}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-woufx-secondary flex items-center justify-center gap-2 py-3 text-xs font-mono uppercase tracking-wider text-[#E5C378] hover:text-white"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.form.telegramDirect || "Telegram orqali tasdiqlash"}</span>
            </a>

            <button
              onClick={() => setIsSuccess(false)}
              className="btn-woufx-primary w-full text-xs font-mono uppercase tracking-wider py-3"
            >
              {t.form.closeBtn || "YOPISH"}
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
