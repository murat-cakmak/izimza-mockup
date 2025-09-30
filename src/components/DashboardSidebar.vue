<template>
  <div class="izimza-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <button class="sidebar-mobile-close" @click="closeSidebar">
        <i class="pi pi-times"></i>
      </button>
      <div class="sidebar-logo">
        <i class="pi pi-shield"></i>
        <h2 class="sidebar-title">İzİmza</h2>
      </div>
      <p class="sidebar-subtitle">Elektronik İmza Platformu</p>
    </div>

    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <a href="#" class="nav-link active" @click.prevent="navigateTo('dashboard')">
            <i class="pi pi-home"></i>
            <span>Ana Sayfa</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="navigateTo('sign')">
            <i class="pi pi-file-edit"></i>
            <span>Belge İmzalama</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="navigateTo('history')">
            <i class="pi pi-history"></i>
            <span>İşlem Geçmişi</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="navigateTo('wallet')">
            <i class="pi pi-wallet"></i>
            <span>Kontör İşlemleri</span>
          </a>
        </li>
        
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="navigateTo('settings')">
            <i class="pi pi-cog"></i>
            <span>Hesap Ayarları</span>
          </a>
        </li>
        
        <li v-if="userType === 'Lawyer'" class="nav-item">
          <a href="#" class="nav-link" @click.prevent="navigateTo('lawyer')">
            <i class="pi pi-briefcase"></i>
            <span>Avukat Paneli</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info">
        <div class="user-avatar">
          <i class="pi pi-user"></i>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userName }}</div>
          <div class="user-type">{{ userType }}</div>
        </div>
      </div>
      
      <div class="sidebar-actions">
        <button class="sidebar-btn" @click="logout">
          <i class="pi pi-sign-out"></i>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps<{
  isCollapsed: boolean;
}>();

const emit = defineEmits<{
  'close-sidebar': []
}>();

const closeSidebar = () => {
  emit('close-sidebar');
};

const userName = ref('Murat Çakmak');
const userType = ref('Individual');

const navigateTo = (route: string) => {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  (event?.target as HTMLElement)?.closest('.nav-link')?.classList.add('active');
  
  switch (route) {
    case 'dashboard':
      router.push('/dashboard');
      break;
    case 'sign':
      router.push('/sign');
      break;
    case 'history':
      alert('İşlem Geçmişi sayfası yakında eklenecek');
      break;
    case 'wallet':
      alert('Kontör İşlemleri sayfası yakında eklenecek');
      break;
    case 'settings':
      alert('Hesap Ayarları sayfası yakında eklenecek');
      break;
    case 'lawyer':
      alert('Avukat Paneli sayfası yakında eklenecek');
      break;
  }
};

const logout = () => {
  if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
    router.push('/login');
  }
};
</script>

<style scoped>
.izimza-sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-dark) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: var(--izimza-shadow-lg);
  transition: transform 0.3s ease, width 0.3s ease;
}

.izimza-sidebar.collapsed {
  transform: translateX(-100%);
}

.sidebar-header {
  padding: var(--izimza-spacing-6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  position: relative;
}

.sidebar-mobile-close {
  position: absolute;
  top: var(--izimza-spacing-4);
  right: var(--izimza-spacing-4);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--izimza-radius-lg);
  padding: var(--izimza-spacing-2);
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.sidebar-mobile-close:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.sidebar-mobile-close i {
  font-size: 1.1rem;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--izimza-spacing-3);
  margin-bottom: var(--izimza-spacing-2);
}

.sidebar-logo i {
  font-size: 2rem;
  color: white;
}

.sidebar-title {
  font-size: var(--izimza-font-size-2xl);
  font-weight: 700;
  margin: 0;
  color: white;
}

.sidebar-subtitle {
  font-size: var(--izimza-font-size-sm);
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: var(--izimza-spacing-4) 0;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: var(--izimza-spacing-1);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  padding: var(--izimza-spacing-4) var(--izimza-spacing-6);
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: rgba(255, 255, 255, 0.3);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: white;
  font-weight: 600;
}

.nav-link i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-link span {
  font-size: var(--izimza-font-size-base);
}

.sidebar-footer {
  padding: var(--izimza-spacing-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  margin-bottom: var(--izimza-spacing-4);
  padding: var(--izimza-spacing-3);
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: var(--izimza-radius-lg);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: var(--izimza-font-size-sm);
  color: white;
  margin-bottom: var(--izimza-spacing-1);
}

.user-type {
  font-size: var(--izimza-font-size-xs);
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.1);
  padding: var(--izimza-spacing-1) var(--izimza-spacing-2);
  border-radius: var(--izimza-radius-sm);
  display: inline-block;
}

.sidebar-actions {
  width: 100%;
}

.sidebar-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--izimza-spacing-2);
  padding: var(--izimza-spacing-3);
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--izimza-radius-md);
  color: white;
  font-size: var(--izimza-font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.sidebar-btn i {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .izimza-sidebar {
    width: 100%;
    position: fixed;
    min-height: 100vh;
    z-index: 1001;
  }
  
  .izimza-sidebar.collapsed {
    transform: translateX(-100%);
  }
  
  .sidebar-mobile-close {
    display: flex;
  }
  
  .sidebar-header {
    padding: var(--izimza-spacing-4);
  }
  
  .nav-link {
    padding: var(--izimza-spacing-3) var(--izimza-spacing-4);
  }
  
  .sidebar-footer {
    padding: var(--izimza-spacing-3);
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.izimza-sidebar {
  animation: slideInLeft 0.5s ease-out;
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}
</style>
