// Demo data and interactions for Resident UI
const residentSample = {
  user: { name: 'Raj Kumar', flat: 'A-101' },
  currentBill: { month: 'Feb 2026', maintenance: 2500, additional: 0, dueDate: '2026-02-15', status: 'Pending' },
  history: [
    { month: 'Jan', amount: 2500, mode: 'UPI', date: '2026-01-10', status: 'Paid' }
  ],
  complaints: [ {id:201, category:'Plumbing', desc:'Leak in bathroom', status:'Resolved'} ],
  announcements: [ {title:'Annual Meeting', date:'2026-02-15', body:'Meeting at 7pm in community hall.'} ]
};

// Populate top info and cards
document.getElementById('topSociety').textContent = residentSample.user.name ? residentSample.user.name + ' — ' + document.getElementById('topSociety').textContent : document.getElementById('topSociety').textContent;
document.getElementById('flatNum').textContent = residentSample.user.flat;
document.getElementById('billMonth').textContent = residentSample.currentBill.month;
document.getElementById('maintCharges').textContent = '₹' + residentSample.currentBill.maintenance;
document.getElementById('addCharges').textContent = '₹' + residentSample.currentBill.additional;
const total = residentSample.currentBill.maintenance + residentSample.currentBill.additional;
document.getElementById('billTotal').textContent = '₹' + total;

document.getElementById('currentDue').textContent = '₹' + (residentSample.currentBill.status==='Pending'? total: 0);
document.getElementById('dueDate').textContent = residentSample.currentBill.dueDate;
document.getElementById('paymentStatus').textContent = residentSample.currentBill.status;
document.getElementById('lastPayment').textContent = residentSample.history.length ? residentSample.history[0].month + ' - ₹' + residentSample.history[0].amount : '-';

// Payment flow
const payNow = document.getElementById('payNow');
const paymentFlow = document.getElementById('paymentFlow');
const confirmPay = document.getElementById('confirmPay');
const payAmount = document.getElementById('payAmount');
const payMethod = document.getElementById('payMethod');

payNow.addEventListener('click', ()=>{ paymentFlow.classList.remove('hidden'); });

// Update selected method text
document.querySelectorAll('input[name="method"]').forEach(el=>el.addEventListener('change', (e)=>{ payMethod.textContent = e.target.value; }));

confirmPay.addEventListener('click', ()=>{
  confirmPay.disabled = true; confirmPay.textContent = 'Processing...';
  setTimeout(()=>{
    // simulate success
    const rec = { month: residentSample.currentBill.month, amount: total, mode: payMethod.textContent, date: new Date().toISOString().split('T')[0], status:'Paid' };
    residentSample.history.unshift(rec);
    residentSample.currentBill.status = 'Paid';
    document.getElementById('paymentResult').innerHTML = '<div style="color:green;margin-top:8px">Payment successful — receipt saved to localStorage</div>';
    // update UI
    document.getElementById('paymentStatus').textContent = 'Paid';
    document.getElementById('currentDue').textContent = '₹0';
    document.getElementById('lastPayment').textContent = rec.month + ' - ₹' + rec.amount;
    fillHistory();
    // save receipt
    localStorage.setItem('lastReceipt', JSON.stringify(rec));
    confirmPay.disabled = false; confirmPay.textContent = 'Confirm Payment';
  }, 1200);
});

// Payment history
function fillHistory(){
  const tbody = document.querySelector('#historyTable tbody'); tbody.innerHTML = '';
  residentSample.history.forEach(h=>{ const tr = document.createElement('tr'); tr.innerHTML = `<td>${h.month}</td><td>₹${h.amount}</td><td>${h.mode}</td><td>${h.date}</td><td>${h.status}</td>`; tbody.appendChild(tr); });
}
fillHistory();

// Complaints
const compForm = document.getElementById('complaintForm');
const compTable = document.querySelector('#complaintsTable tbody');
function fillComplaints(){ compTable.innerHTML=''; residentSample.complaints.forEach(c=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>#${c.id}</td><td>${c.category}</td><td>${c.desc}</td><td>${c.status}</td>`; compTable.appendChild(tr); }); }
fillComplaints();

compForm.addEventListener('submit',(e)=>{ e.preventDefault(); const cat=document.getElementById('complaintCategory').value; const desc=document.getElementById('complaintDesc').value.trim(); if(!desc){ alert('Please add description'); return;} const id = Math.floor(Math.random()*900)+100; residentSample.complaints.unshift({id,category:cat,desc,status:'Submitted'}); fillComplaints(); compForm.reset(); alert('Complaint submitted (demo)'); });

// Announcements
const annList = document.getElementById('annList'); residentSample.announcements.forEach(a=>{ const d=document.createElement('div'); d.className='ann-item'; d.innerHTML=`<strong>${a.title}</strong><div style="font-size:13px;color:#6b7280">${a.date}</div><p style="margin-top:6px">${a.body}</p>`; annList.appendChild(d); });

// Notification bell click handler
const notifBell = document.querySelector('.notif');
notifBell.addEventListener('click', ()=> {
  alert('📬 Notifications\n\n• Your bill for Feb 2026 is due\n• Payment reminder from Society');
});

// Sidebar toggle for mobile (hamburger menu)
document.addEventListener('DOMContentLoaded', ()=> {
  const sidebar = document.querySelector('.sidebar');
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      navItems.forEach(i => i.classList.remove('active'));
      e.target.classList.add('active');
    });
  });
});

// Profile menu toggle & logout
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
document.getElementById('logoutBtn').addEventListener('click',(e)=>{ 
  e.preventDefault(); 
  localStorage.removeItem('user'); 
  window.location.href='demo-login.html'; 
});
