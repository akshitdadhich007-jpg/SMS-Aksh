document.addEventListener('DOMContentLoaded', () => {
  const addFlatForm = document.getElementById('addFlatForm');
  const addResidentForm = document.getElementById('addResidentForm');
  const flatsSelect = document.getElementById('res_flat_id');

  async function loadFlats(){
    try{
      const res = await fetch('/api/admin/flats');
      const data = await res.json();
      if (data.success){
        flatsSelect.innerHTML = '<option value="">Select flat</option>' + data.flats.map(f=>`<option value="${f.id}">${f.flat_number} ${f.block_name?'- '+f.block_name:''}</option>`).join('');
      }
    }catch(e){ console.error(e); }
  }

  addFlatForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      flat_number: document.getElementById('flat_number').value.trim(),
      block_name: document.getElementById('block_name').value.trim(),
      floor_number: document.getElementById('floor_number').value || null,
      owner_name: document.getElementById('owner_name').value.trim() || null
    };
    const res = await fetch('/api/admin/add-flat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const data = await res.json();
    if (data.success){ alert('Flat added'); addFlatForm.reset(); loadFlats(); } else alert(data.message || 'Failed');
  });

  addResidentForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const payload = {
      name: document.getElementById('res_name').value.trim(),
      email: document.getElementById('res_email').value.trim(),
      flat_id: document.getElementById('res_flat_id').value,
      password: document.getElementById('res_password').value
    };
    const res = await fetch('/api/admin/add-resident', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    const data = await res.json();
    if (data.success){ alert('Resident added'); addResidentForm.reset(); } else alert(data.message || 'Failed');
  });

  // Check session and role
  fetch('/api/me').then(r=>r.json()).then(data=>{
    if (!data.loggedIn) { window.location.href = '/'; return; }
    if (data.user.role !== 'admin') { window.location.href = '/'; return; }
    document.getElementById('userName').textContent = 'Welcome, ' + data.user.name;
    loadFlats();
  }).catch(()=>{ window.location.href = '/'; });
});
