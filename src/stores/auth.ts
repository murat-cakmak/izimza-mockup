import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  type: 'Individual' | 'Lawyer'
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (username === 'admin' && password === 'admin123') {
        const userData: User = {
          id: '1',
          name: 'Murat Çakmak',
          email: 'murat.cakmak@example.com',
          type: 'Individual',
          username: 'admin'
        }
        const authToken = 'mock-jwt-token-' + Date.now()
        
        user.value = userData
        token.value = authToken
        
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('user_data', JSON.stringify(userData))
        
        return true
      } else if (username === 'avukat' && password === 'avukat') {
        const userData: User = {
          id: '2',
          name: 'Ali Yılmaz',
          email: 'avukat@example.com',
          type: 'Lawyer',
          username: 'avukat'
        }
        const authToken = 'mock-jwt-token-lawyer-' + Date.now()
        
        user.value = userData
        token.value = authToken
        
        localStorage.setItem('auth_token', authToken)
        localStorage.setItem('user_data', JSON.stringify(userData))
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user_data')
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout()
      }
    }
  }

  const updateUserType = (type: 'Individual' | 'Lawyer') => {
    if (user.value) {
      user.value.type = type
      localStorage.setItem('user_data', JSON.stringify(user.value))
    }
  }

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    
    login,
    logout,
    initializeAuth,
    updateUserType
  }
})
