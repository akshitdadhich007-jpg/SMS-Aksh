// Sample data for Admin UI (demo)
const sample = {
  societyName: 'Greenfield Residency',
  totals: { flats: 120, residents: 305, monthlyCollection: 187500, pendingDues: 27500, expenses: 52000 },
  monthlyCollection: [150000,160000,170000,180000,185000,187500,190000,195000,180000,175000,170000,165000],
  expenseDist: { salaries: 25000, electricity: 12000, maintenance: 10000, others: 5000 },
  payments: [
    {flat:'A-101',name:'Raj Kumar',month:'Feb',amount:2500,status:'Paid'},
    {flat:'A-102',name:'Priya Singh',month:'Feb',amount:2500,status:'Pending'},
    {flat:'B-201',name:'Amit Patel',month:'Jan',amount:2500,status:'Paid'},
    {flat:'C-301',name:'Sneha Rao',month:'Feb',amount:2500,status:'Pending'}
  ],
  complaints: [
    {id:101,flat:'A-102',category:'Water Leakage',status:'Open'},
    {id:102,flat:'B-201',category:'Noise',status:'In Progress'},
    {id:103,flat:'C-301',category:'Electricity',status:'Resolved'}
  ]
};

// Populate header and summary cards
document.getElementById('societyName').textContent = sample.societyName;
document.getElementById('totalFlats').textContent = sample.totals.flats;
document.getElementById('totalResidents').textContent = sample.totals.residents;
document.getElementById('monthlyCollection').textContent = '₹' + sample.totals.monthlyCollection.toLocaleString();
document.getElementById('pendingDues').textContent = '₹' + sample.totals.pendingDues.toLocaleString();
document.getElementById('totalExpenses').textContent = '₹' + sample.totals.expenses.toLocaleString();

// Initialize charts if Chart.js is available
function initCharts(){
  if(typeof Chart === 'undefined') return;
  const barCtx = document.getElementById('barChart').getContext('2d');
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      datasets:[{
        label:'Monthly Collection (₹)',
        data:sample.monthlyCollection,
        backgroundColor:'#3b82f6',
        borderColor:'#1e40af',
        borderWidth:1,
        borderRadius:4,
        hoverBackgroundColor:'#2563eb'
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:true,
      plugins:{
        legend:{display:true, position:'top', labels:{font:{size:12}, color:'#374151'}},
        tooltip:{backgroundColor:'rgba(0,0,0,0.8)', titleFont:{size:12}, bodyFont:{size:11}, padding:10}
      },
      scales:{
        y:{
          beginAtZero:true,
          grid:{drawBorder:false, color:'#f0f0f0'},
          ticks:{
            font:{size:11},
            callback:function(value){return '₹' + (value/1000).toFixed(0) + 'k';}
          }
        },
        x:{
          grid:{display:false},
          ticks:{font:{size:11}}
        }
      }
    }
  });

  const pieCtx = document.getElementById('pieChart').getContext('2d');
  new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Salaries', 'Electricity', 'Maintenance', 'Others'],
      datasets: [{
        data: Object.values(sample.expenseDist),
        backgroundColor:['#10b981','#f59e0b','#ef4444','#60a5fa'],
        borderColor:'#fff',
        borderWidth:2,
        hoverBorderWidth:3
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:true,
      plugins:{
        legend:{display:true, position:'bottom', labels:{font:{size:11}, color:'#374151', padding:15}},
        tooltip:{backgroundColor:'rgba(0,0,0,0.8)', titleFont:{size:12}, bodyFont:{size:11}, padding:10, callbacks:{label:function(ctx){return '₹' + ctx.raw.toLocaleString();}}}
      }
    }
  });
}

// Fill tables
function fillPayments(){
  const tbody = document.querySelector('#paymentsTable tbody');
  sample.payments.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.flat}</td><td>${p.name}</td><td>${p.month}</td><td>₹${p.amount}</td><td>${p.status==='Paid'?"<span class='status-paid'>Paid</span>":"<span class='status-pending'>Pending</span>"}</td>`;
    tbody.appendChild(tr);
  });
}

function fillComplaints(){
  const tbody = document.querySelector('#complaintsTable tbody');
  sample.complaints.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>#${c.id}</td><td>${c.flat}</td><td>${c.category}</td><td>${c.status}</td>`;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initCharts();
  fillPayments();
  fillComplaints();

  // Profile menu toggle
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  
  profileBtn.addEventListener('click', (e)=>{ 
    e.stopPropagation();
    profileMenu.classList.toggle('show');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e)=>{ 
    if(!profileMenu.contains(e.target) && e.target !== profileBtn) {
      profileMenu.classList.remove('show');
    }
  });

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) { 
    logoutBtn.addEventListener('click',(e)=>{ 
      e.preventDefault(); 
      localStorage.removeItem('user'); 
      alert('Logged out successfully');
      window.location.href='demo-login.html'; 
    }); 
  }

  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebarToggle');
  if(sidebarToggle){ 
    sidebarToggle.addEventListener('click',()=>{ 
      const sidebar = document.querySelector('.sidebar'); 
      if(sidebar.style.display==='none' || getComputedStyle(sidebar).display==='none') {
        sidebar.style.display='flex'; 
      } else {
        sidebar.style.display='none';
      }
    }); 
  }

  // Sidebar navigation items - smooth scroll & active state
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active class from all items
      navItems.forEach(ni => ni.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');
      // Show feedback
      const text = item.textContent.trim().split(' ').slice(1).join(' ');
      alert(`Navigating to: ${text}\n(Demo - this section would load real content)`);
    });
  });

  // Notification bell click handler
  const notifBtn = document.getElementById('notifBtn');
  if(notifBtn) {
    notifBtn.addEventListener('click', () => {
      alert('You have 3 notifications:\n\n1. Payment reminder - A-105\n2. New complaint submitted - A-102\n3. Maintenance notice posted');
    });
  }

  // Make cards clickable for demo
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const titles = ['Total Flats', 'Total Residents', 'Monthly Collection', 'Pending Dues', 'Total Expenses'];
      const values = [sample.totals.flats, sample.totals.residents, '₹' + sample.totals.monthlyCollection.toLocaleString(), '₹' + sample.totals.pendingDues.toLocaleString(), '₹' + sample.totals.expenses.toLocaleString()];
      alert(`${titles[index]}: ${values[index]}`);
    });
  });

  // Table row interactions
  const paymentRows = document.querySelectorAll('#paymentsTable tbody tr');
  paymentRows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const cells = row.querySelectorAll('td');
      alert(`Payment Details:\nFlat: ${cells[0].textContent}\nResident: ${cells[1].textContent}\nMonth: ${cells[2].textContent}\nAmount: ${cells[3].textContent}\nStatus: ${cells[4].textContent.trim()}`);
    });
  });

  const complaintRows = document.querySelectorAll('#complaintsTable tbody tr');
  complaintRows.forEach(row => {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      const cells = row.querySelectorAll('td');
      alert(`Complaint Details:\nID: ${cells[0].textContent}\nFlat: ${cells[1].textContent}\nCategory: ${cells[2].textContent}\nStatus: ${cells[3].textContent}`);
    });
  });
});

