// Unified dashboard button/menu handlers - used by all dashboards (Admin, Resident, Security)
// Include this AFTER your main dashboard script

document.addEventListener('DOMContentLoaded', () => {
  // Profile dropdown - consistent across all dashboards
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  
  if(profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e)=>{ 
      e.stopPropagation();
      profileMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e)=>{ 
      if(!profileMenu.contains(e.target) && e.target !== profileBtn) {
        profileMenu.classList.remove('show');
      }
    });
  }

  // Logout - consistent across all dashboards
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) { 
    logoutBtn.addEventListener('click',(e)=>{ 
      e.preventDefault(); 
      localStorage.removeItem('user'); 
      window.location.href='demo-login.html'; 
    }); 
  }

  // Notification bell
  const notifBtn = document.getElementById('notifBtn');
  if(notifBtn) {
    notifBtn.addEventListener('click', () => {
      alert('You have 2 notifications:\n\n1. Payment reminder\n2. New announcement posted');
    });
  }

  // Sidebar toggle (mobile)
  const sidebarToggle = document.getElementById('sidebarToggle');
  if(sidebarToggle) { 
    sidebarToggle.addEventListener('click', () => { 
      const sidebar = document.querySelector('.sidebar'); 
      if(sidebar) {
        sidebar.classList.toggle('hidden');
      }
    }); 
  }

  // Sidebar nav items
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(ni => ni.classList.remove('active'));
      item.classList.add('active');
    });
  });
});
