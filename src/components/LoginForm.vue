<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-overlay"></div>
    </div>
    
    <div class="login-card izimza-card izimza-fade-in">
      <div class="login-header">
        <div class="izimza-logo">
          <i class="pi pi-shield" style="font-size: 2.5rem; color: var(--izimza-primary);"></i>
          <h1 class="izimza-title">İzİmza</h1>
        </div>
        <p class="izimza-subtitle">Türkiye'nin güvenilir elektronik imza çözümü</p>
      </div>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">
            <i class="pi pi-user"></i>
            Kullanıcı Adı / E-posta
          </label>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            class="izimza-input"
            placeholder="Kullanıcı adınızı veya e-posta adresinizi giriniz"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">
            <i class="pi pi-lock"></i>
            Şifre
          </label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            class="izimza-input"
            placeholder="Şifrenizi giriniz"
            required
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          <i class="pi pi-exclamation-triangle"></i>
          {{ errorMessage }}
        </div>

        <button 
          type="submit" 
          class="izimza-btn izimza-btn-primary login-button"
          :disabled="isLoading"
        >
          <i v-if="isLoading" class="pi pi-spin pi-spinner"></i>
          <i v-else class="pi pi-sign-in"></i>
          {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>

      <div class="login-footer">
        <div class="login-links">
          <a href="#" class="login-link" @click.prevent="showForgotPassword">
            <i class="pi pi-key"></i>
            Şifremi Unuttum
          </a>
          <a href="#" class="login-link" @click.prevent="showRegister">
            <i class="pi pi-user-plus"></i>
            Hesap Oluştur
          </a>
        </div>
        
        <div class="language-selector">
          <label for="language" class="language-label">
            <i class="pi pi-globe"></i>
            Dil:
          </label>
          <select id="language" v-model="selectedLanguage" class="language-select">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const username = ref<string>('');
const password = ref<string>('');
const errorMessage = ref<string>('');
const isLoading = ref<boolean>(false);
const selectedLanguage = ref<string>('tr');
const router = useRouter();
const authStore = useAuthStore();

const login = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Lütfen kullanıcı adı ve şifre giriniz';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const success = await authStore.login(username.value, password.value);
    
    if (success) {
      router.push('/dashboard');
    } else {
      errorMessage.value = 'Kullanıcı adı veya şifre hatalı';
    }
  } catch {
    errorMessage.value = 'Giriş yapılırken bir hata oluştu';
  } finally {
    isLoading.value = false;
  }
};

const showForgotPassword = () => {
  alert('Şifre sıfırlama özelliği yakında eklenecek');
};

const showRegister = () => {
  alert('Kayıt olma özelliği yakında eklenecek');
};
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--izimza-spacing-4);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--izimza-primary) 0%, var(--izimza-primary-dark) 50%, var(--izimza-secondary) 100%);
  z-index: -2;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  z-index: -1;
}

.login-card {
  width: 100%;
  max-width: 450px;
  padding: var(--izimza-spacing-8);
  background: white;
  border-radius: var(--izimza-radius-xl);
  box-shadow: var(--izimza-shadow-xl);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: var(--izimza-spacing-8);
}

.izimza-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--izimza-spacing-4);
}

.izimza-title {
  font-size: var(--izimza-font-size-3xl);
  font-weight: 700;
  color: var(--izimza-primary);
  margin: var(--izimza-spacing-2) 0 0 0;
}

.izimza-subtitle {
  color: var(--izimza-gray-600);
  font-size: var(--izimza-font-size-sm);
  margin: 0;
}

.login-form {
  margin-bottom: var(--izimza-spacing-6);
}

.form-group {
  margin-bottom: var(--izimza-spacing-5);
}

.form-label {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
  margin-bottom: var(--izimza-spacing-2);
  font-weight: 500;
  color: var(--izimza-gray-700);
  font-size: var(--izimza-font-size-sm);
}

.form-label i {
  color: var(--izimza-primary);
}

.error-message {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
  padding: var(--izimza-spacing-3);
  background-color: rgb(239 68 68 / 0.1);
  color: var(--izimza-error);
  border: 1px solid rgb(239 68 68 / 0.2);
  border-radius: var(--izimza-radius-md);
  font-size: var(--izimza-font-size-sm);
  margin-bottom: var(--izimza-spacing-4);
}

.login-button {
  width: 100%;
  padding: var(--izimza-spacing-4);
  font-size: var(--izimza-font-size-base);
  font-weight: 600;
  margin-top: var(--izimza-spacing-4);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer {
  border-top: 1px solid var(--izimza-gray-200);
  padding-top: var(--izimza-spacing-4);
  margin-bottom: var(--izimza-spacing-6);
}

.login-links {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--izimza-spacing-4);
}

.login-link {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-2);
  color: var(--izimza-primary);
  text-decoration: none;
  font-size: var(--izimza-font-size-sm);
  font-weight: 500;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: var(--izimza-primary-dark);
}

.language-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--izimza-spacing-2);
}

.language-label {
  display: flex;
  align-items: center;
  gap: var(--izimza-spacing-1);
  color: var(--izimza-gray-600);
  font-size: var(--izimza-font-size-sm);
}

.language-select {
  padding: var(--izimza-spacing-1) var(--izimza-spacing-2);
  border: 1px solid var(--izimza-gray-300);
  border-radius: var(--izimza-radius-sm);
  background: white;
  font-size: var(--izimza-font-size-sm);
}

.izimza-info-panel {
  display: flex;
  justify-content: space-around;
  padding: var(--izimza-spacing-4);
  background: linear-gradient(135deg, var(--izimza-gray-50) 0%, var(--izimza-gray-100) 100%);
  border-radius: var(--izimza-radius-lg);
  border: 1px solid var(--izimza-gray-200);
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--izimza-spacing-1);
  text-align: center;
}

.info-item i {
  color: var(--izimza-primary);
  font-size: var(--izimza-font-size-lg);
}

.info-item span {
  font-size: var(--izimza-font-size-xs);
  color: var(--izimza-gray-600);
  font-weight: 500;
}

@media (max-width: 480px) {
  .login-card {
    padding: var(--izimza-spacing-6);
    margin: var(--izimza-spacing-2);
  }
  
  .izimza-info-panel {
    flex-direction: column;
    gap: var(--izimza-spacing-3);
  }
  
  .login-links {
    flex-direction: column;
    gap: var(--izimza-spacing-2);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.izimza-fade-in {
  animation: slideInUp 0.6s ease-out;
}
</style>
