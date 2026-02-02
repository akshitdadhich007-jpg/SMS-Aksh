// Simple storage and rendering for security dashboard
const storageKey = 'security_demo';
const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
if(!data.visitors) data.visitors = [];
if(!data.vehicles) data.vehicles = [];
if(!data.deliveries) data.deliveries = [];
if(!data.emergencies) data.emergencies = [];
localStorage.setItem(storageKey, JSON.stringify(data));

function renderTable(id, rows){ const tbody = document.querySelector(id+' tbody'); tbody.innerHTML=''; rows.slice().reverse().forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML = Object.values(r).map(v=>`<td>${v}</td>`).join(''); tbody.appendChild(tr); }); }

// load
renderTable('#visitorTable', data.visitors.map(v=>({name:v.name,purpose:v.purpose,flat:v.flat,time:v.time||'-'})));
renderTable('#vehicleTable', data.vehicles.map(v=>({num:v.number,type:v.type,auth:v.auth?'Yes':'No',time:v.time||'-'})));
renderTable('#deliveryTable', data.deliveries.map(d=>({courier:d.courier,flat:d.flat,status:d.status||'At Security',time:d.time||'-'})));
renderTable('#emTable', data.emergencies.map(e=>({time:e.time||'-',incident:e.title,desc:e.desc})));

// forms
document.getElementById('visitorForm').addEventListener('submit', (e)=>{ e.preventDefault(); const v={name:document.getElementById('vName').value, purpose:document.getElementById('vPurpose').value, flat:document.getElementById('vFlat').value, time:document.getElementById('vTime').value||new Date().toLocaleString()}; data.visitors.push(v); localStorage.setItem(storageKey, JSON.stringify(data)); renderTable('#visitorTable', data.visitors); e.target.reset(); });

document.getElementById('vehicleForm').addEventListener('submit',(e)=>{ e.preventDefault(); const v={number:document.getElementById('vehNumber').value, type:document.getElementById('vehType').value, auth:document.getElementById('vehAuth').checked, time:new Date().toLocaleString()}; data.vehicles.push(v); localStorage.setItem(storageKey, JSON.stringify(data)); renderTable('#vehicleTable', data.vehicles); e.target.reset(); });

document.getElementById('deliveryForm').addEventListener('submit',(e)=>{ e.preventDefault(); const d={courier:document.getElementById('courier').value, flat:document.getElementById('delFlat').value, status:'At Security', time:new Date().toLocaleString()}; data.deliveries.push(d); localStorage.setItem(storageKey, JSON.stringify(data)); renderTable('#deliveryTable', data.deliveries); e.target.reset(); });

document.getElementById('emergencyForm').addEventListener('submit',(e)=>{ e.preventDefault(); const em={title:document.getElementById('emTitle').value, desc:document.getElementById('emDesc').value, time:new Date().toLocaleString()}; data.emergencies.push(em); localStorage.setItem(storageKey, JSON.stringify(data)); renderTable('#emTable', data.emergencies); e.target.reset(); alert('Emergency logged. Notify authorities if needed.'); });

// quick actions
document.querySelectorAll('.qa').forEach(b=>b.addEventListener('click',(e)=>{ const a=e.currentTarget.dataset.action; document.querySelector('#'+a+' input, #'+a+' textarea')?.focus(); window.location.hash = a; }));

// Notification bell click handler
const notifBell = document.querySelector('.notif');
if (notifBell) {
  notifBell.addEventListener('click', ()=> {
    alert('📬 Notifications\n\n• Vehicle entry registered\n• Visitor entry completed');
  });
}

// Sidebar toggle for mobile
document.addEventListener('DOMContentLoaded', ()=> {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(i => i.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
});

// profile menu
const profileBtn = document.getElementById('profileBtn'); 
const profileMenu = document.getElementById('profileMenu'); 
profileBtn.addEventListener('click',(e)=>{ 
  e.stopPropagation(); 
  profileMenu.classList.toggle('show'); 
}); 
document.addEventListener('click', (e)=>{ 
  if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
    profileMenu.classList.remove('show');
  }
});

// logout
document.getElementById('logoutBtn').addEventListener('click',(e)=>{ 
  e.preventDefault(); 
  localStorage.removeItem('user'); 
  window.location.href='demo-login.html'; 
});
