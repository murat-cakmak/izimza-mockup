<template>
  <div class="dashboard-header">
    <div class="header-left">
      <button class="sidebar-toggle-btn" @click="toggleSidebar">
        <i class="pi pi-bars"></i>
      </button>
      <button 
        v-if="!sidebarCollapsed" 
        class="sidebar-close-btn mobile-only" 
        @click="toggleSidebar"
      >
        <i class="pi pi-times"></i>
      </button>
      <div class="page-title">
        <h1>Dashboard</h1>
        <p class="page-subtitle">Kontrol panelinize hoş geldiniz</p>
      </div>
    </div>

    <div class="header-center">
      <div class="search-container">
        <i class="pi pi-search search-icon"></i>
        <input 
          type="text" 
          placeholder="Belge, kullanıcı veya işlem ara..." 
          class="search-input"
          v-model="searchQuery"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <i class="pi pi-search"></i>
        </button>
      </div>
    </div>

    <div class="header-right">
      <div class="notification-container">
        <button class="notification-btn" @click="toggleNotifications">
          <i class="pi pi-bell"></i>
          <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
        </button>
        
        <div v-if="showNotifications" class="notification-dropdown">
          <div class="notification-header">
            <h3>Bildirimler</h3>
            <button class="close-btn" @click="toggleNotifications">
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="notification-list">
            <div 
              v-for="notification in notifications" 
              :key="notification.id" 
              class="notification-item"
            >
              <div class="notification-icon">
                <i :class="notification.icon"></i>
              </div>
              <div class="notification-content">
                <p class="notification-title">{{ notification.title }}</p>
                <p class="notification-time">{{ notification.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="user-menu-container">
        <button class="user-menu-btn" @click="toggleUserMenu">
          <div class="user-avatar">
            <i class="pi pi-user"></i>
          </div>
          <div class="user-info">
            <span class="user-name">{{ userName }}</span>
            <span class="user-role">{{ userRole }}</span>
          </div>
          <i class="pi pi-chevron-down"></i>
        </button>
        
        <div v-if="showUserMenu" class="user-menu-dropdown">
          <div class="user-menu-header">
            <div class="user-avatar-large">
              <i class="pi pi-user"></i>
            </div>
            <div class="user-details">
              <h4>{{ userName }}</h4>
              <p>{{ userEmail }}</p>
            </div>
          </div>
          <div class="user-menu-list">
            <a href="#" class="menu-item" @click.prevent="navigateToProfile">
              <i class="pi pi-user"></i>
              <span>Profil</span>
            </a>
            <a href="#" class="menu-item" @click.prevent="navigateToSettings">
              <i class="pi pi-cog"></i>
              <span>Ayarlar</span>
            </a>
            <a href="#" class="menu-item" @click.prevent="navigateToHelp">
              <i class="pi pi-question-circle"></i>
              <span>Yardım</span>
            </a>
            <hr class="menu-divider">
            <a href="#" class="menu-item logout" @click.prevent="logout">
              <i class="pi pi-sign-out"></i>
              <span>Çıkış Yap</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

defineProps<{
  sidebarCollapsed: boolean;
}>();

const emit = defineEmits<{
  'toggle-sidebar': []
}>();

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const searchQuery = ref('');
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notificationCount = ref(3);

const userName = computed(() => authStore.user?.name || 'Kullanıcı');
const userRole = computed(() => authStore.user?.type === 'Lawyer' ? 'Avukat' : 'Bireysel Kullanıcı');
const userEmail = computed(() => authStore.user?.email || '');

const notifications = ref([
  {
    id: 1,
    title: 'Yeni belge imzalanması bekleniyor',
    time: '5 dakika önce',
    icon: 'pi pi-file-edit'
  },
  {
    id: 2,
    title: 'Kontör yükleme işlemi tamamlandı',
    time: '1 saat önce',
    icon: 'pi pi-check-circle'
  },
  {
    id: 3,
    title: 'Sistem güncellemesi yapıldı',
    time: '2 saat önce',
    icon: 'pi pi-info-circle'
  }
]);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`Arama: ${searchQuery.value}`);
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

const navigateToProfile = () => {
  alert('Profil sayfası yakında eklenecek');
  showUserMenu.value = false;
};

const navigateToSettings = () => {
  alert('Ayarlar sayfası yakında eklenecek');
  showUserMenu.value = false;
};

const navigateToHelp = () => {
  alert('Yardım sayfası yakında eklenecek');
  showUserMenu.value = false;
};

const logout = () => {
  if (confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
    authStore.logout();
    router.push('/login');
  }
  showUserMenu.value = false;
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.notification-container') && !target.closest('.user-menu-container')) {
    showNotifications.value = false;
    showUserMenu.value = false;
  }
};

document.addEventListener('click', handleClickOutside);
</script>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--izimza-spacing-6);
  background: white;
  border-bottom: 1px solid var(--izimza-gray-200);
  box-shadow: var(--izimza-shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-4);
}

.sidebar-toggle-btn {
  background: var(--izimza-gray-100);
  border: 1px solid var(--izimza-gray-300);
  border-radius: var(--izimza-radius-lg);
  padding: var(--izimza-spacing-3);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--izimza-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.sidebar-toggle-btn:hover {
  background: var(--izimza-gray-200);
  color: var(--izimza-primary);
  border-color: var(--izimza-primary);
}

.sidebar-toggle-btn i {
  font-size: 1.2rem;
}

.sidebar-close-btn {
  background: var(--izimza-error);
  border: 1px solid var(--izimza-error);
  border-radius: var(--izimza-radius-lg);
  padding: var(--izimza-spacing-3);
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
  position: relative;
  z-index: 1002;
}

.sidebar-close-btn:hover {
  background: var(--izimza-error-dark, #dc2626);
  border-color: var(--izimza-error-dark, #dc2626);
  transform: scale(1.05);
}

.sidebar-close-btn i {
  font-size: 1.2rem;
}

.mobile-only {
  display: none;
}

.page-title h1 {
  font-size: var(--izimza-font-size-2xl);
  font-weight: 700;
  color: var(--izimza-primary);
  margin: 0 0 var(--izimza-spacing-1) 0;
}

.page-subtitle {
  color: var(--izimza-gray-600);
  font-size: var(--izimza-font-size-sm);
  margin: 0;
}

.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  padding: 0 var(--izimza-spacing-4);
}

.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: var(--izimza-spacing-3) var(--izimza-spacing-4) var(--izimza-spacing-3) 3rem;
  border: 1px solid var(--izimza-gray-300);
  border-radius: var(--izimza-radius-lg);
  font-size: var(--izimza-font-size-base);
  background: var(--izimza-gray-50);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--izimza-primary);
  background: white;
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
}

.search-icon {
  position: absolute;
  left: var(--izimza-spacing-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--izimza-gray-400);
  font-size: 1rem;
}

.search-btn {
  position: absolute;
  right: var(--izimza-spacing-2);
  top: 50%;
  transform: translateY(-50%);
  background: var(--izimza-primary);
  color: white;
  border: none;
  border-radius: var(--izimza-radius-md);
  padding: var(--izimza-spacing-2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: var(--izimza-primary-dark);
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--izimza-spacing-4);
}

.notification-container {
  position: relative;
}

.notification-btn {
  position: relative;
  background: var(--izimza-gray-100);
  border: 1px solid var(--izimza-gray-300);
  border-radius: var(--izimza-radius-lg);
  padding: var(--izimza-spacing-3);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--izimza-gray-600);
}

.notification-btn:hover {
  background: var(--izimza-gray-200);
  color: var(--izimza-primary);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--izimza-error);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--izimza-font-size-xs);
  font-weight: 600;
}

.notification-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: white;
  border: 1px solid var(--izimza-gray-200);
  border-radius: var(--izimza-radius-lg);
  box-shadow: var(--izimza-shadow-xl);
  z-index: 1000;
  margin-top: var(--izimza-spacing-2);
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--izimza-spacing-4);
  border-bottom: 1px solid var(--izimza-gray-200);
}

.notification-header h3 {
  margin: 0;
  font-size: var(--izimza-font-size-lg);
  color: var(--izimza-gray-800);
}

.close-btn {
  background: none;
  border: none;
  color: var(--izimza-gray-400);
  cursor: pointer;
  padding: var(--izimza-spacing-1);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: var(--izimza-spacing-3);
  padding: var(--izimza-spacing-4);
  border-bottom: 1px solid var(--izimza-gray-100);
  transition: background-color 0.2s ease;
}

.notification-item:hover {
  background: var(--izimza-gray-50);
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--izimza-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: var(--izimza-font-size-sm);
  color: var(--izimza-gray-800);
  margin: 0 0 var(--izimza-spacing-1) 0;
  font-weight: 500;
}

.notification-time {
  font-size: var(--izimza-font-size-xs);
  color: var(--izimza-gray-500);
  margin: 0;
}

.user-menu-container {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  background: var(--izimza-gray-100);
  border: 1px solid var(--izimza-gray-300);
  border-radius: var(--izimza-radius-lg);
  padding: var(--izimza-spacing-3);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--izimza-gray-600);
}

.user-menu-btn:hover {
  background: var(--izimza-gray-200);
  color: var(--izimza-primary);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--izimza-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: var(--izimza-font-size-sm);
  font-weight: 600;
  color: var(--izimza-gray-800);
}

.user-role {
  font-size: var(--izimza-font-size-xs);
  color: var(--izimza-gray-500);
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid var(--izimza-gray-200);
  border-radius: var(--izimza-radius-lg);
  box-shadow: var(--izimza-shadow-xl);
  z-index: 1000;
  margin-top: var(--izimza-spacing-2);
}

.user-menu-header {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  padding: var(--izimza-spacing-4);
  border-bottom: 1px solid var(--izimza-gray-200);
  background: var(--izimza-gray-50);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--izimza-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-details h4 {
  margin: 0 0 var(--izimza-spacing-1) 0;
  font-size: var(--izimza-font-size-base);
  color: var(--izimza-gray-800);
}

.user-details p {
  margin: 0;
  font-size: var(--izimza-font-size-sm);
  color: var(--izimza-gray-500);
}

.user-menu-list {
  padding: var(--izimza-spacing-2) 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  padding: var(--izimza-spacing-3) var(--izimza-spacing-4);
  color: var(--izimza-gray-700);
  text-decoration: none;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: var(--izimza-gray-50);
  color: var(--izimza-primary);
}

.menu-item.logout {
  color: var(--izimza-error);
}

.menu-item.logout:hover {
  background: rgb(239 68 68 / 0.1);
  color: var(--izimza-error);
}

.menu-divider {
  border: none;
  border-top: 1px solid var(--izimza-gray-200);
  margin: var(--izimza-spacing-2) 0;
}

@media (max-width: 768px) {
  .dashboard-header {
    z-index: 1003;
    flex-direction: column;
    gap: var(--izimza-spacing-4);
    padding: var(--izimza-spacing-4);
  }
  
  .mobile-only {
    display: flex;
  }
  
  .sidebar-toggle-btn {
    display: none;
  }
  
  .header-center {
    order: -1;
    width: 100%;
    padding: 0;
  }
  
  .search-container {
    max-width: none;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
    gap: var(--izimza-spacing-2);
  }
  
  .notification-btn,
  .user-menu-btn {
    min-width: 44px;
    height: 44px;
    padding: var(--izimza-spacing-2);
  }
  
  .notification-btn i,
  .user-menu-btn i {
    font-size: 1.1rem;
  }
  
  .notification-dropdown,
  .user-menu-dropdown {
    position: fixed;
    top: 80px;
    left: var(--izimza-spacing-4);
    right: var(--izimza-spacing-4);
    width: auto;
    max-width: none;
    margin-top: 0;
    z-index: 1004;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .notification-list {
    max-height: 50vh;
  }
  
  .notification-item {
    padding: var(--izimza-spacing-3);
  }
  
  .notification-header {
    padding: var(--izimza-spacing-3);
  }
}
</style>
