const PRODUCTS = [{"id": 101, "title": "Încărcător rapid 25W", "cat": "accesorii", "price": 99.9, "img": "img/charger.png"}, {"id": 102, "title": "Cablu USB-C 1m", "cat": "accesorii", "price": 29.9, "img": "img/cable.png"}, {"id": 103, "title": "Husă Silicone Clear", "cat": "accesorii", "price": 39.9, "img": "img/case.png"}, {"id": 104, "title": "Power Bank 10000 mAh", "cat": "accesorii", "price": 129.0, "img": "img/powerbank.png"}, {"id": 201, "title": "Display smartphone (compatibil)", "cat": "piese", "price": 249.0, "img": "img/display.png"}, {"id": 202, "title": "Baterie compatibilă 3000mAh", "cat": "piese", "price": 89.9, "img": "img/battery.png"}, {"id": 203, "title": "Difuzor extern (speaker)", "cat": "piese", "price": 69.9, "img": "img/speaker.png"}, {"id": 204, "title": "Conector încărcare (micro USB/USB-C)", "cat": "piese", "price": 49.0, "img": "img/connector.png"}, {"id": 301, "title": "Telefon Nou - Model A (128GB)", "cat": "telefoane", "price": 1499.0, "img": "img/phone1.png"}, {"id": 302, "title": "Telefon Refurbished - Model B (64GB)", "cat": "telefoane", "price": 799.0, "img": "img/phone2.png"}, {"id": 303, "title": "Telefon Nou - Model C (256GB)", "cat": "telefoane", "price": 1999.0, "img": "img/phone3.png"}, {"id": 304, "title": "Smartwatch compatibil", "cat": "accesorii", "price": 249.0, "img": "img/watch.png"}];


// Fixngo Mobile - static demo app (cart in localStorage, prices in RON)
const App = (function() {

  let cart = JSON.parse(localStorage.getItem('fixngo_cart') || '[]');

  function formatRON(v){ return (typeof v === 'number') ? v.toLocaleString('ro-RO',{style:'currency',currency:'RON'}) : v; }

  function saveCart(){ localStorage.setItem('fixngo_cart', JSON.stringify(cart)); renderCartCount(); }

  function renderCartCount(){ const c = cart.reduce((s,i)=>s+i.qty,0); const el = document.getElementById('cartCount'); if(el) el.textContent = c; }

  function addToCart(id){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return alert('Produs negăsit');
    const existing = cart.find(i=>i.id===id);
    if(existing) existing.qty += 1; else cart.push({id:p.id,title:p.title,price:p.price,qty:1,image:p.img});
    saveCart();
    const note = document.createElement('div');
    note.textContent = 'Produs adăugat în coș';
    note.style = 'position:fixed;right:18px;bottom:18px;background:var(--accent);color:white;padding:10px 14px;border-radius:10px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.15)';
    document.body.appendChild(note);
    setTimeout(()=>note.remove(),1600);
  }

  function renderGrid(containerId, filterCat){
    const el = document.getElementById(containerId);
    if(!el) return;
    el.innerHTML = '';
    const list = PRODUCTS.filter(p=>!filterCat || p.cat===filterCat);
    if(list.length===0){ el.innerHTML = '<div class="muted">Nu s-au găsit produse.</div>'; return; }
    list.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb"><img src="${p.img}" alt="${p.title}"></div>
        <div style="margin-top:8px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:800">${p.title}</div>
            <div class="badge">${p.cat === 'telefoane' ? 'Telefon' : (p.cat === 'accesorii' ? 'Accesoriu' : 'Piesă')}</div>
          </div>
          <div class="muted" style="margin-top:6px">Cod: #${p.id}</div>
          <div class="meta">
            <div class="price">${formatRON(p.price)}</div>
            <div class="muted">Stoc: 10+</div>
          </div>
        </div>
        <div style="margin-top:10px;display:flex;gap:8px">
          <button class="btn" onclick="App.openProduct(${p.id})">Detalii</button>
          <button class="btn btn-primary" onclick="App.addToCart(${p.id})">Adaugă în coș</button>
        </div>
      `;
      el.appendChild(card);
    });
  }

  function openProduct(id){
    const p = PRODUCTS.find(x=>x.id===id);
    if(!p) return;
    const container = document.createElement('div');
    container.className = 'modal-backdrop';
    container.style = 'position:fixed;inset:0;background:rgba(7,12,20,0.45);display:flex;align-items:center;justify-content:center;z-index:9999';
    container.innerHTML = `
      <div style="width:min(900px,95%);background:white;padding:18px;border-radius:12px;display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div><div class="thumb" style="height:320px"><img src="${p.img}" alt="${p.title}"></div></div>
        <div>
          <div style="display:flex;justify-content:space-between"><div style="font-weight:800;font-size:20px">${p.title}</div><button onclick="document.body.removeChild(document.querySelector('.modal-backdrop'))" style="border:0;background:transparent;font-size:20px;cursor:pointer">✕</button></div>
          <div class="muted" style="margin-top:8px">Specificații exemplu pentru produs.</div>
          <div style="margin-top:12px;font-weight:800">${formatRON(p.price)}</div>
          <div style="margin-top:12px">
            <p class="small-muted">Specificații</p>
            <ul class="muted"><li>Model: Demo</li><li>Garantie: 12 luni</li></ul>
          </div>
          <div style="margin-top:14px;display:flex;gap:8px">
            <button class="btn btn-primary" onclick="App.addToCart(${p.id}); document.body.removeChild(document.querySelector('.modal-backdrop'))">Adaugă în coș</button>
            <button class="btn" onclick="alert('Solicitare service trimisă (demo)')">Solicită reparație</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    container.addEventListener('click', (e)=>{ if(e.target===container) container.remove(); });
  }

  function getCartItems(){ return cart; }
  function getCartTotal(){ return cart.reduce((s,i)=>s + i.price * i.qty, 0); }

  function openCartPage(){
    const el = document.getElementById('orderSummary');
    if(!el) return;
    if(cart.length === 0){ el.innerHTML = '<div class="muted">Coșul este gol.</div>'; return; }
    const html = cart.map(it=>`
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px dashed #eee">
        <div><strong>${it.title}</strong><div class="muted">${it.qty} × ${formatRON(it.price)}</div></div>
        <div style="font-weight:800">${formatRON(it.price * it.qty)}</div>
      </div>
    `).join('');
    const total = getCartTotal();
    el.innerHTML = html + `<div style="margin-top:12px;display:flex;justify-content:space-between"><div class="muted">Total</div><div style="font-weight:900">${formatRON(total)}</div></div>`;
  }

  function changeQty(id, delta){ const it = cart.find(i=>i.id===id); if(!it) return; it.qty += delta; if(it.qty<=0) cart = cart.filter(x=>x.id!==it.id); saveCart(); openCartPage(); renderCartCount(); }

  function removeItem(id){ cart = cart.filter(x=>x.id !== id); saveCart(); openCartPage(); }

  function clearCart(){ cart = []; saveCart(); openCartPage(); }

  function init(){
    const search = document.getElementById('searchInput');
    if(search) search.addEventListener('input', (e)=>{ const q = e.target.value.toLowerCase(); document.querySelectorAll('#grid .card').forEach(card=>{ const t = card.textContent.toLowerCase(); if(!t.includes(q)) card.style.display = 'none'; else card.style.display = ''; }); });
    renderCartCount();
  }

  return {{ init, renderGrid, addToCart, openProduct, getCartItems, getCartTotal, openCartPage, changeQty, removeItem, clearCart }};
})();

document.addEventListener('DOMContentLoaded', ()=>{ App.init(); });
