export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss', 'nuxt-auth-sanctum'],
    css: [
        '~/assets/css/main.css',
        '@arco-design/web-vue/dist/arco.css'
    ],

    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:8000/api', 
        },
    },

    sanctum: {
        baseUrl: 'http://localhost:8000',         
        mode: 'cookie',                            
        endpoints: {
            csrf: '/sanctum/csrf-cookie',          
            login: '/api/login',                    
            logout: '/api/logout',                 
            user: '/api/user',                     
        },
        redirect: {
            onLogin: '/tickets',                    // Redirect after login
            onLogout: '/login',                     // Redirect after logout
            onAuthOnly: '/login',                   // Redirect if not authenticated
            onGuestOnly: '/tickets',                // Redirect if already authenticated
        },
    },

    vite: {
        server: {
            warmup: {
                clientFiles: ['./app/**/*.vue'],   
            },
        },
    },

    devtools: { enabled: true },                   
    compatibilityDate: '2024-11-01',               
})