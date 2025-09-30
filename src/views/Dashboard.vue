<template>
  <div class="dashboard-container">
    <DashboardSidebar 
      :is-collapsed="sidebarCollapsed" 
      @close-sidebar="toggleSidebar" 
    />
    
    <div 
      v-if="!sidebarCollapsed" 
      class="mobile-overlay" 
      @click="toggleSidebar"
    ></div>
    
    <div class="izimza-main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <DashboardHeader 
        :sidebar-collapsed="sidebarCollapsed" 
        @toggle-sidebar="toggleSidebar" 
      />
      
      <div class="dashboard-content">
        <div class="welcome-section">
          <h1 class="welcome-title">
            <i class="pi pi-home"></i>
            Hoş Geldiniz, {{ userInfo.name }}!
          </h1>
          <p class="welcome-subtitle">
            İzİmza Dashboard'unuza hoş geldiniz. Kontör durumunuz ve bekleyen işlemleriniz aşağıda görüntülenmektedir.
          </p>
        </div>

        <div class="dashboard-grid">
          <div class="widget-card izimza-card">
            <div class="widget-header">
              <h3 class="widget-title">
                <i class="pi pi-user"></i>
                Toplam İmzalanan
              </h3>
            </div>
            <div class="user-type-content">
              <div class="credit-main">
                <div class="credit-number">{{ userStats.totalSigned }}</div>
                <div class="credit-label">Toplam İmzalanan</div>
              </div>
            </div>
          </div>
          
          <div class="widget-card izimza-card">
            <div class="widget-header">
              <h3 class="widget-title">
                <i class="pi pi-wallet"></i>
                Kontör Durumu
              </h3>
            </div>
            <div class="credit-content">
              <div class="credit-main">
                <div class="credit-number">{{ creditData.remainingCredits }}</div>
                <div class="credit-label">Kalan Krediler</div>
              </div>
              <div class="credit-details">
                <div class="credit-detail-item">
                  <span class="detail-label">Son İşlem:</span>
                  <span class="detail-value">{{ creditData.lastTransactionDate }}</span>
                </div>
                <div class="credit-detail-item">
                  <span class="detail-label">Birim Fiyat:</span>
                  <span class="detail-value">{{ creditData.unitCreditCost }}₺</span>
                </div>
              </div>
            </div>
            <div class="widget-actions">
              <button class="izimza-btn izimza-btn-primary">
                <i class="pi pi-plus"></i>
                Kontör Yükle
              </button>
            </div>
          </div>

          <div class="widget-card izimza-card">
            <div class="widget-header">
              <h3 class="widget-title">
                <i class="pi pi-file-edit"></i>
                Hızlı Başlat
              </h3>
            </div>
            <div class="quick-start-content">
              <div class="upload-area" @click="triggerFileUpload">
                <i class="pi pi-cloud-upload"></i>
                <p>Belge Yükle ve İmzalama Başlat</p>
                <small>PDF, DOC, DOCX dosyalarını destekler</small>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                @change="handleFileUpload" 
                accept=".pdf,.doc,.docx"
                style="display: none;"
              />
            </div>
          </div>
        </div>

        <div class="pending-section">
          <h2 class="section-title">
            <i class="pi pi-clock"></i>
            Bekleyen İşlemler
          </h2>
          <div class="pending-documents">
            <div 
              v-for="document in pendingDocuments" 
              :key="document.id" 
              class="document-card izimza-card"
            >
              <div class="document-info">
                <h4 class="document-name">{{ document.ad }}</h4>
                <p class="document-sender">
                  <i class="pi pi-user"></i>
                  {{ document.gonderen }}
                </p>
                <p class="document-date">
                  <i class="pi pi-calendar"></i>
                  {{ document.tarih }}
                </p>
              </div>
              <div class="document-status">
                <span 
                  class="status-badge" 
                  :class="document.durum === 'İmzanız Bekleniyor' ? 'status-pending' : 'status-waiting'"
                >
                  {{ document.durum }}
                </span>
                <button class="izimza-btn izimza-btn-primary">
                  <i class="pi pi-eye"></i>
                  İncele
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="userInfo.type === 'Lawyer'" class="stats-section">
          <h2 class="section-title">
            <i class="pi pi-chart-bar"></i>
            İstatistikler
          </h2>
          <div class="stats-grid">
            <div class="stat-card izimza-card">
              <div class="stat-icon">
                <i class="pi pi-file"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">128</div>
                <div class="stat-label">Son 30 Günde İmzalanan</div>
              </div>
            </div>
            <div class="stat-card izimza-card">
              <div class="stat-icon">
                <i class="pi pi-users"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">45</div>
                <div class="stat-label">Aktif Müvekkil</div>
              </div>
            </div>
            <div class="stat-card izimza-card">
              <div class="stat-icon">
                <i class="pi pi-calendar"></i>
              </div>
              <div class="stat-content">
                <div class="stat-number">12</div>
                <div class="stat-label">Bu Hafta Tamamlanan</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import DashboardHeader from '@/components/DashboardHeader.vue';
import DashboardSidebar from '@/components/DashboardSidebar.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const sidebarCollapsed = ref(window.innerWidth <= 768);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const userInfo = computed(() => ({
  name: authStore.user?.name || 'Kullanıcı',
  type: authStore.user?.type || 'Individual',
  email: authStore.user?.email || ''
}));


const creditData = ref({
  remainingCredits: 42,
  lastTransactionDate: '2025-09-25',
  unitCreditCost: 1
});

const userStats = ref({
  totalSigned: 156,
  archived: 89
});


const pendingDocuments = ref([
  { 
    id: 1, 
    ad: 'Sözleşme Taslağı V.2', 
    gonderen: 'Hukuk Birimi', 
    durum: 'İmzanız Bekleniyor', 
    tarih: '2025-09-30' 
  },
  { 
    id: 2, 
    ad: 'Gizlilik Sözleşmesi', 
    gonderen: 'Furkan Yılmaz', 
    durum: 'Diğer İmza Bekleniyor', 
    tarih: '2025-09-29' 
  },
  { 
    id: 3, 
    ad: 'İş Sözleşmesi', 
    gonderen: 'İK Departmanı', 
    durum: 'İmzanız Bekleniyor', 
    tarih: '2025-09-28' 
  }
]);


const fileInput = ref<HTMLInputElement>();


const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    alert(`Dosya yüklendi: ${file.name}`);
    
  }
};



const handleResize = () => {
  if (window.innerWidth <= 768) {
    sidebarCollapsed.value = true;
  } else {
    sidebarCollapsed.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--izimza-gray-50);
}

.izimza-main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.izimza-main-content.sidebar-collapsed {
  margin-left: 0;
}

.dashboard-content {
  padding: var(--izimza-spacing-6);
  width: 100%;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: none;
}

@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
  }
}

.welcome-section {
  margin-bottom: var(--izimza-spacing-8);
  text-align: center;
}

.welcome-title {
  font-size: var(--izimza-font-size-3xl);
  font-weight: 700;
  color: var(--izimza-primary);
  margin-bottom: var(--izimza-spacing-2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--izimza-spacing-3);
}

.welcome-subtitle {
  color: var(--izimza-gray-600);
  font-size: var(--izimza-font-size-lg);
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--izimza-spacing-6);
  margin-bottom: var(--izimza-spacing-8);
}

.widget-card {
  padding: var(--izimza-spacing-6);
  transition: all 0.3s ease;
}

.widget-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--izimza-shadow-xl);
}

.widget-header {
  margin-bottom: var(--izimza-spacing-4);
  border-bottom: 1px solid var(--izimza-gray-200);
  padding-bottom: var(--izimza-spacing-3);
}

.widget-title {
  font-size: var(--izimza-font-size-xl);
  font-weight: 600;
  color: var(--izimza-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
}

.credit-content {
  display: flex;
  flex-direction: column;
  gap: var(--izimza-spacing-4);
}

.credit-main {
  text-align: center;
  padding: var(--izimza-spacing-4);
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-light) 100%);
  border-radius: var(--izimza-radius-lg);
  color: white;
}

.credit-number {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.credit-label {
  font-size: var(--izimza-font-size-sm);
  opacity: 0.9;
  margin-top: var(--izimza-spacing-1);
}

.credit-details {
  display: flex;
  flex-direction: column;
  gap: var(--izimza-spacing-2);
}

.credit-detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--izimza-spacing-2) 0;
  border-bottom: 1px solid var(--izimza-gray-200);
}

.detail-label {
  font-weight: 500;
  color: var(--izimza-gray-600);
}

.detail-value {
  font-weight: 600;
  color: var(--izimza-primary);
}

.quick-start-content {
  text-align: center;
}

.upload-area {
  border: 2px dashed var(--izimza-gray-300);
  border-radius: var(--izimza-radius-lg);
  padding: var(--izimza-spacing-8);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--izimza-gray-50);
}

.upload-area:hover {
  border-color: var(--izimza-primary);
  background: var(--izimza-primary);
  color: white;
}

.upload-area i {
  font-size: 3rem;
  color: var(--izimza-primary);
  margin-bottom: var(--izimza-spacing-3);
  display: block;
}

.upload-area:hover i {
  color: white;
}

.upload-area p {
  font-size: var(--izimza-font-size-lg);
  font-weight: 600;
  margin: var(--izimza-spacing-2) 0;
}

.upload-area small {
  color: var(--izimza-gray-500);
  font-size: var(--izimza-font-size-sm);
}

.upload-area:hover small {
  color: rgba(255, 255, 255, 0.8);
}

.user-type-content {
  text-align: center;
}

.user-type-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
  padding: var(--izimza-spacing-3) var(--izimza-spacing-4);
  border-radius: var(--izimza-radius-lg);
  font-weight: 600;
  font-size: var(--izimza-font-size-lg);
  margin-bottom: var(--izimza-spacing-4);
}

.user-type-badge.bireysel {
  background: linear-gradient(135deg, var(--izimza-secondary) 0%, #10b981 100%);
  color: white;
}

.user-type-badge.avukat {
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-dark) 100%);
  color: white;
}

.user-type-description {
  color: var(--izimza-gray-600);
  margin-bottom: var(--izimza-spacing-4);
  line-height: 1.6;
}

.user-stats {
  display: flex;
  gap: var(--izimza-spacing-4);
  margin-bottom: var(--izimza-spacing-4);
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  padding: var(--izimza-spacing-3);
  background: var(--izimza-gray-50);
  border-radius: var(--izimza-radius-lg);
  border: 1px solid var(--izimza-gray-200);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--izimza-radius-md);
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: var(--izimza-font-size-xl);
  font-weight: 700;
  color: var(--izimza-primary);
  line-height: 1;
}

.stat-label {
  font-size: var(--izimza-font-size-sm);
  color: var(--izimza-gray-600);
  margin-top: var(--izimza-spacing-1);
}

.widget-actions {
  margin-top: var(--izimza-spacing-4);
  text-align: center;
}

.pending-section,
.stats-section {
  margin-bottom: var(--izimza-spacing-8);
}

.section-title {
  font-size: var(--izimza-font-size-2xl);
  font-weight: 600;
  color: var(--izimza-primary);
  margin-bottom: var(--izimza-spacing-6);
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
}

.pending-documents {
  display: flex;
  flex-direction: column;
  gap: var(--izimza-spacing-4);
}

.document-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--izimza-spacing-5);
  transition: all 0.3s ease;
}

.document-card:hover {
  transform: translateX(5px);
  box-shadow: var(--izimza-shadow-lg);
}

.document-info {
  flex: 1;
}

.document-name {
  font-size: var(--izimza-font-size-lg);
  font-weight: 600;
  color: var(--izimza-gray-800);
  margin: 0 0 var(--izimza-spacing-2) 0;
}

.document-sender,
.document-date {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
  color: var(--izimza-gray-600);
  font-size: var(--izimza-font-size-sm);
  margin: var(--izimza-spacing-1) 0;
}

.document-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--izimza-spacing-3);
}

.status-badge {
  padding: var(--izimza-spacing-1) var(--izimza-spacing-3);
  border-radius: var(--izimza-radius-sm);
  font-size: var(--izimza-font-size-xs);
  font-weight: 500;
}

.status-pending {
  background-color: rgb(245 158 11 / 0.1);
  color: var(--izimza-warning);
  border: 1px solid rgb(245 158 11 / 0.2);
}

.status-waiting {
  background-color: rgb(59 130 246 / 0.1);
  color: var(--izimza-info);
  border: 1px solid rgb(59 130 246 / 0.2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--izimza-spacing-6);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-4);
  padding: var(--izimza-spacing-5);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--izimza-radius-lg);
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: var(--izimza-font-size-2xl);
  font-weight: 700;
  color: var(--izimza-primary);
  line-height: 1;
}

.stat-label {
  color: var(--izimza-gray-600);
  font-size: var(--izimza-font-size-sm);
  margin-top: var(--izimza-spacing-1);
}

@media (min-width: 1400px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) and (max-width: 1399px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .izimza-main-content {
    margin-left: 0;
  }
  
  .izimza-main-content.sidebar-collapsed {
    margin-left: 0;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .document-card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--izimza-spacing-4);
  }
  
  .document-status {
    align-items: flex-start;
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
  }
  
  .user-stats {
    flex-direction: column;
    gap: var(--izimza-spacing-3);
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: var(--izimza-spacing-2);
  }
}
</style>
