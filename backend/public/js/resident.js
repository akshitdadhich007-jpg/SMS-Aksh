document.addEventListener('DOMContentLoaded', ()=>{
  fetch('/api/me').then(r=>r.json()).then(data=>{
    if (!data.loggedIn) { window.location.href = '/'; return; }
    if (data.user.role !== 'resident') { window.location.href = '/'; return; }
    document.getElementById('userName').textContent = 'Welcome, ' + data.user.name;
    if (data.user.flat) document.getElementById('flatNumber').textContent = data.user.flat;

    // load charges and notices
    fetch('/api/resident/charges').then(r=>r.json()).then(ch=>{
      if (ch.success){
        const tbody = document.querySelector('.table tbody');
        if (tbody){
          tbody.innerHTML = ch.charges.map(c=>`<tr><td>${['','January','February','March','April','May','June','July','August','September','October','November','December'][c.month]}</td><td>${c.year}</td><td>₹${Number(c.amount).toFixed(2)}</td><td>${new Date(c.due_date).toLocaleDateString()}</td><td><span class="status-badge ${c.status}">${c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span></td></tr>`).join('');
        }
      }
    }).catch(()=>{});

    fetch('/api/resident/notices').then(r=>r.json()).then(n=>{
      if (n.success){
        const node = document.querySelector('.notices-list');
        if (node) node.innerHTML = n.notices.map(no=>`<div class="notice-item"><h3>${no.title}</h3><p>${no.content}</p><span class="notice-date">${new Date(no.created_at).toLocaleDateString()}</span></div>`).join('');
      }
    }).catch(()=>{});

  }).catch(()=>{ window.location.href = '/'; });
});
