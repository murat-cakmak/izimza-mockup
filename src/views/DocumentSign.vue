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
      
      <div class="document-sign-content">
        <div class="page-header">
          <h1 class="page-title">
            <i class="pi pi-file-edit"></i>
            Belge İmzalama
          </h1>
          <p class="page-description">
            Elektronik imzanızla belgelerinizi güvenli bir şekilde imzalayın
          </p>
        </div>

        <div class="sign-content">
          <div class="upload-section">
            <div class="upload-card" :class="{ 'dragover': isDragOver }">
              <div class="upload-area" @drop="handleDrop" @dragover="handleDragOver" @dragleave="handleDragLeave">
                <div v-if="!uploadedFile" class="upload-placeholder">
                  <div class="upload-icon">
                    <i class="pi pi-cloud-upload"></i>
                  </div>
                  <h3>Belge Yükleyin</h3>
                  <p>Dosyanızı buraya sürükleyip bırakın veya seçmek için tıklayın</p>
                  <div class="file-types">
                    <span class="file-type">PDF</span>
                    <span class="file-type">DOC</span>
                    <span class="file-type">DOCX</span>
                  </div>
                  <input 
                    ref="fileInput" 
                    type="file" 
                    @change="handleFileSelect" 
                    accept=".pdf,.doc,.docx"
                    style="display: none"
                  />
                  <button class="upload-btn" @click="triggerFileInput">
                    <i class="pi pi-plus"></i>
                    Dosya Seç
                  </button>
                </div>
                
                <div v-if="uploadedFile" class="uploaded-file">
                  <div class="file-info">
                    <div class="file-icon">
                      <i class="pi pi-file-pdf" v-if="uploadedFile.type.includes('pdf')"></i>
                      <i class="pi pi-file-word" v-else-if="uploadedFile.type.includes('word')"></i>
                      <i class="pi pi-file" v-else></i>
                    </div>
                    <div class="file-details">
                      <h4>{{ uploadedFile.name }}</h4>
                      <p>{{ formatFileSize(uploadedFile.size) }}</p>
                      <div class="upload-progress" v-if="uploadProgress < 100">
                        <div class="progress-bar">
                          <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                        </div>
                        <span class="progress-text">{{ uploadProgress }}%</span>
                      </div>
                      <div v-else class="upload-success">
                        <i class="pi pi-check-circle"></i>
                        <span>Yükleme tamamlandı</span>
                      </div>
                    </div>
                  </div>
                  <div class="file-actions">
                    <button class="action-btn remove-btn" @click="removeFile">
                      <i class="pi pi-trash"></i>
                    </button>
                    <button class="action-btn preview-btn" @click="previewFile">
                      <i class="pi pi-eye"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="uploadedFile && uploadProgress === 100" class="sign-settings">
            <div class="settings-card">
              <h3>
                <i class="pi pi-cog"></i>
                İmzalama Ayarları
              </h3>
              
              <div class="settings-content">
                <div class="setting-group">
                  <label class="setting-label">İmza Tipi</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input type="radio" v-model="signType" value="digital" />
                      <span class="radio-custom"></span>
                      <div class="radio-content">
                        <strong>Elektronik İmza</strong>
                        <small>Güvenli dijital imza</small>
                      </div>
                    </label>
                    <label class="radio-item">
                      <input type="radio" v-model="signType" value="advanced" />
                      <span class="radio-custom"></span>
                      <div class="radio-content">
                        <strong>Gelişmiş İmza</strong>
                        <small>Yasal geçerlilik garantisi</small>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="setting-group">
                  <label class="setting-label">İmza Pozisyonu</label>
                  <div class="position-options">
                    <button 
                      class="position-btn" 
                      :class="{ active: signPosition === 'bottom-right' }"
                      @click="signPosition = 'bottom-right'"
                    >
                      <i class="pi pi-arrow-down-right"></i>
                      Alt Sağ
                    </button>
                    <button 
                      class="position-btn" 
                      :class="{ active: signPosition === 'bottom-left' }"
                      @click="signPosition = 'bottom-left'"
                    >
                      <i class="pi pi-arrow-down-left"></i>
                      Alt Sol
                    </button>
                    <button 
                      class="position-btn" 
                      :class="{ active: signPosition === 'center' }"
                      @click="signPosition = 'center'"
                    >
                      <i class="pi pi-circle"></i>
                      Orta
                    </button>
                  </div>
                </div>

                <div class="setting-group">
                  <label class="setting-label">Ek Bilgiler</label>
                  <textarea 
                    v-model="additionalInfo" 
                    class="info-textarea"
                    placeholder="İmza ile ilgili ek notlarınızı buraya yazabilirsiniz..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div v-if="uploadedFile && uploadProgress === 100" class="sign-actions">
            <button 
              class="sign-btn" 
              :class="{ loading: isSigning }"
              :disabled="isSigning"
              @click="signDocument"
            >
              <i class="pi pi-pen" v-if="!isSigning"></i>
              <i class="pi pi-spin pi-spinner" v-else></i>
              {{ isSigning ? 'İmzalanıyor...' : 'Belgeyi İmzala' }}
            </button>
            
            <button class="cancel-btn" @click="resetForm">
              <i class="pi pi-times"></i>
              İptal Et
            </button>
          </div>
        </div>

        <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
          <div class="success-modal" @click.stop>
            <div class="success-icon">
              <i class="pi pi-check-circle"></i>
            </div>
            <h3>İmzalama Başarılı!</h3>
            <p>Belgeniz başarıyla imzalandı ve güvenli bir şekilde saklandı.</p>
            <div class="modal-actions">
              <button class="btn-primary" @click="downloadSignedDocument">
                <i class="pi pi-download"></i>
                İmzalı Belgeyi İndir
              </button>
              <button class="btn-secondary" @click="closeSuccessModal">
                Tamam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import DashboardHeader from '@/components/DashboardHeader.vue';
import DashboardSidebar from '@/components/DashboardSidebar.vue';

useRouter();

const sidebarCollapsed = ref(window.innerWidth <= 768);

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const fileInput = ref<HTMLInputElement>();
const uploadedFile = ref<File | null>(null);
const uploadProgress = ref(0);
const isDragOver = ref(false);
const isSigning = ref(false);
const showSuccessModal = ref(false);

const signType = ref('digital');
const signPosition = ref('bottom-right');
const additionalInfo = ref('');
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (isValidFileType(file)) {
      processFile(file);
    } else {
      alert('Lütfen PDF, DOC veya DOCX formatında bir dosya seçin.');
    }
  }
};

const isValidFileType = (file?: File): boolean => {
  if (!file) return false;
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  return validTypes.includes(file.type) || 
         file.name.toLowerCase().endsWith('.pdf') ||
         file.name.toLowerCase().endsWith('.doc') ||
         file.name.toLowerCase().endsWith('.docx');
};

const processFile = (file?: File) => {
  if (!file || !isValidFileType(file)) {
    alert('Lütfen PDF, DOC veya DOCX formatında bir dosya seçin.');
    return;
  }

  uploadedFile.value = file;
  uploadProgress.value = 0;
  
  
  const interval = setInterval(() => {
    uploadProgress.value += Math.random() * 30;
    if (uploadProgress.value >= 100) {
      uploadProgress.value = 100;
      clearInterval(interval);
    }
  }, 200);
};

const removeFile = () => {
  uploadedFile.value = null;
  uploadProgress.value = 0;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const formatFileSize = (bytes?: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const previewFile = () => {
  if (uploadedFile.value) {
    const url = URL.createObjectURL(uploadedFile.value);
    window.open(url, '_blank');
  }
};


const signDocument = async () => {
  if (!uploadedFile.value) return;
  
  isSigning.value = true;
  
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  isSigning.value = false;
  showSuccessModal.value = true;
};

const downloadSignedDocument = () => {
  
  alert('İmzalı belge indiriliyor...');
  closeSuccessModal();
};

const closeSuccessModal = () => {
  showSuccessModal.value = false;
};

const resetForm = () => {
  uploadedFile.value = null;
  uploadProgress.value = 0;
  signType.value = 'digital';
  signPosition.value = 'bottom-right';
  additionalInfo.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
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

.document-sign-content {
  flex: 1;
  padding: var(--izimza-spacing-6);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: var(--izimza-spacing-8);
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--izimza-spacing-3);
  font-size: var(--izimza-font-size-4xl);
  font-weight: 700;
  color: var(--izimza-primary);
  margin-bottom: var(--izimza-spacing-3);
}

.page-title i {
  font-size: 2.5rem;
}

.page-description {
  font-size: var(--izimza-font-size-lg);
  color: var(--izimza-text-secondary);
  margin: 0;
}

.upload-section {
  margin-bottom: var(--izimza-spacing-8);
}

.upload-card {
  background: white;
  border-radius: var(--izimza-radius-xl);
  box-shadow: var(--izimza-shadow-lg);
  border: 2px dashed var(--izimza-border-light);
  transition: all 0.3s ease;
  overflow: hidden;
}

.upload-card.dragover {
  border-color: var(--izimza-primary);
  background-color: var(--izimza-primary-light);
}

.upload-area {
  padding: var(--izimza-spacing-8);
  text-align: center;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  width: 100%;
}

.upload-icon {
  font-size: 4rem;
  color: var(--izimza-primary);
  margin-bottom: var(--izimza-spacing-4);
}

.upload-placeholder h3 {
  font-size: var(--izimza-font-size-2xl);
  font-weight: 600;
  color: var(--izimza-text-primary);
  margin-bottom: var(--izimza-spacing-2);
}

.upload-placeholder p {
  color: var(--izimza-text-secondary);
  margin-bottom: var(--izimza-spacing-6);
}

.file-types {
  display: flex;
  justify-content: center;
  gap: var(--izimza-spacing-3);
  margin-bottom: var(--izimza-spacing-6);
}

.file-type {
  background-color: var(--izimza-primary-light);
  color: var(--izimza-primary);
  padding: var(--izimza-spacing-2) var(--izimza-spacing-4);
  border-radius: var(--izimza-radius-md);
  font-weight: 600;
  font-size: var(--izimza-font-size-sm);
}

.upload-btn {
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-dark) 100%);
  color: white;
  border: none;
  padding: var(--izimza-spacing-4) var(--izimza-spacing-6);
  border-radius: var(--izimza-radius-lg);
  font-size: var(--izimza-font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--izimza-shadow-lg);
}

.uploaded-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--izimza-background-light);
  padding: var(--izimza-spacing-6);
  border-radius: var(--izimza-radius-lg);
  border: 2px solid var(--izimza-success);
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-4);
  flex: 1;
}

.file-icon {
  font-size: 3rem;
  color: var(--izimza-danger);
}

.file-details h4 {
  font-size: var(--izimza-font-size-lg);
  font-weight: 600;
  color: var(--izimza-text-primary);
  margin: 0 0 var(--izimza-spacing-1) 0;
}

.file-details p {
  color: var(--izimza-text-secondary);
  margin: 0 0 var(--izimza-spacing-2) 0;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
}

.progress-bar {
  width: 200px;
  height: 8px;
  background-color: var(--izimza-border-light);
  border-radius: var(--izimza-radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--izimza-primary) 0%, var(--izimza-primary-dark) 100%);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: var(--izimza-font-size-sm);
  font-weight: 600;
  color: var(--izimza-primary);
}

.upload-success {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
  color: var(--izimza-success);
  font-weight: 600;
}

.upload-success i {
  font-size: 1.2rem;
}

.file-actions {
  display: flex;
  gap: var(--izimza-spacing-2);
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--izimza-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn {
  background-color: var(--izimza-danger-light);
  color: var(--izimza-danger);
}

.remove-btn:hover {
  background-color: var(--izimza-danger);
  color: white;
}

.preview-btn {
  background-color: var(--izimza-primary-light);
  color: var(--izimza-primary);
}

.preview-btn:hover {
  background-color: var(--izimza-primary);
  color: white;
}

.sign-settings {
  margin-bottom: var(--izimza-spacing-8);
}

.settings-card {
  background: white;
  border-radius: var(--izimza-radius-xl);
  box-shadow: var(--izimza-shadow-lg);
  padding: var(--izimza-spacing-6);
}

.settings-card h3 {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  font-size: var(--izimza-font-size-xl);
  font-weight: 600;
  color: var(--izimza-text-primary);
  margin-bottom: var(--izimza-spacing-6);
}

.settings-card h3 i {
  color: var(--izimza-primary);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--izimza-spacing-6);
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: var(--izimza-spacing-3);
}

.setting-label {
  font-size: var(--izimza-font-size-lg);
  font-weight: 600;
  color: var(--izimza-text-primary);
}

.radio-group {
  display: flex;
  gap: var(--izimza-spacing-4);
}

.radio-item {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  cursor: pointer;
  padding: var(--izimza-spacing-4);
  border: 2px solid var(--izimza-border-light);
  border-radius: var(--izimza-radius-lg);
  transition: all 0.3s ease;
  flex: 1;
}

.radio-item:hover {
  border-color: var(--izimza-primary-light);
}

.radio-item input[type="radio"] {
  display: none;
}

.radio-custom {
  width: 20px;
  height: 20px;
  border: 2px solid var(--izimza-border);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.radio-item input[type="radio"]:checked + .radio-custom {
  border-color: var(--izimza-primary);
  background-color: var(--izimza-primary);
}

.radio-item input[type="radio"]:checked + .radio-custom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
}

.radio-content strong {
  display: block;
  font-weight: 600;
  color: var(--izimza-text-primary);
  margin-bottom: var(--izimza-spacing-1);
}

.radio-content small {
  color: var(--izimza-text-secondary);
}

.position-options {
  display: flex;
  gap: var(--izimza-spacing-3);
}

.position-btn {
  flex: 1;
  padding: var(--izimza-spacing-4);
  border: 2px solid var(--izimza-border-light);
  border-radius: var(--izimza-radius-lg);
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--izimza-spacing-2);
}

.position-btn:hover {
  border-color: var(--izimza-primary-light);
}

.position-btn.active {
  border-color: var(--izimza-primary);
  background-color: var(--izimza-primary-light);
  color: var(--izimza-primary);
}

.position-btn i {
  font-size: 1.5rem;
}

.info-textarea {
  width: 100%;
  padding: var(--izimza-spacing-4);
  border: 2px solid var(--izimza-border-light);
  border-radius: var(--izimza-radius-lg);
  font-size: var(--izimza-font-size-base);
  resize: vertical;
  transition: border-color 0.3s ease;
}

.info-textarea:focus {
  outline: none;
  border-color: var(--izimza-primary);
}

.sign-actions {
  display: flex;
  justify-content: center;
  gap: var(--izimza-spacing-4);
}

.sign-btn {
  background: linear-gradient(135deg, var(--izimza-success) 0%, #059669 100%);
  color: white;
  border: none;
  padding: var(--izimza-spacing-5) var(--izimza-spacing-8);
  border-radius: var(--izimza-radius-xl);
  font-size: var(--izimza-font-size-xl);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
  box-shadow: var(--izimza-shadow-lg);
}

.sign-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}

.sign-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sign-btn.loading {
  background: linear-gradient(135deg, var(--izimza-text-secondary) 0%, #6b7280 100%);
}

.cancel-btn {
  background: white;
  color: var(--izimza-text-secondary);
  border: 2px solid var(--izimza-border-light);
  padding: var(--izimza-spacing-5) var(--izimza-spacing-8);
  border-radius: var(--izimza-radius-xl);
  font-size: var(--izimza-font-size-xl);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-3);
}

.cancel-btn:hover {
  border-color: var(--izimza-text-secondary);
  color: var(--izimza-text-primary);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.success-modal {
  background: white;
  border-radius: var(--izimza-radius-xl);
  padding: var(--izimza-spacing-8);
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--izimza-shadow-2xl);
}

.success-icon {
  font-size: 4rem;
  color: var(--izimza-success);
  margin-bottom: var(--izimza-spacing-4);
}

.success-modal h3 {
  font-size: var(--izimza-font-size-2xl);
  font-weight: 700;
  color: var(--izimza-text-primary);
  margin-bottom: var(--izimza-spacing-3);
}

.success-modal p {
  color: var(--izimza-text-secondary);
  margin-bottom: var(--izimza-spacing-6);
}

.modal-actions {
  display: flex;
  gap: var(--izimza-spacing-3);
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-dark) 100%);
  color: white;
  border: none;
  padding: var(--izimza-spacing-4) var(--izimza-spacing-6);
  border-radius: var(--izimza-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--izimza-shadow-lg);
}

.btn-secondary {
  background: white;
  color: var(--izimza-text-secondary);
  border: 2px solid var(--izimza-border-light);
  padding: var(--izimza-spacing-4) var(--izimza-spacing-6);
  border-radius: var(--izimza-radius-lg);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: var(--izimza-text-secondary);
  color: var(--izimza-text-primary);
}

@media (max-width: 768px) {
  .izimza-main-content {
    margin-left: 0;
  }
  
  .izimza-main-content.sidebar-collapsed {
    margin-left: 0;
  }
  
  .document-sign-content {
    padding: var(--izimza-spacing-4);
  }
  
  .page-title {
    font-size: var(--izimza-font-size-2xl);
  }
  
  .upload-area {
    padding: var(--izimza-spacing-4);
    min-height: 250px;
  }
  
  .radio-group {
    flex-direction: column;
  }
  
  .position-options {
    flex-direction: column;
  }
  
  .sign-actions {
    flex-direction: column;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
