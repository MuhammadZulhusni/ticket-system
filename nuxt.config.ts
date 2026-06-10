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
        endpoints: { // to send API requests
            csrf: '/sanctum/csrf-cookie',          
            login: '/api/login',                    
            logout: '/api/logout',                 
            user: '/api/user',                     
        },
        redirect: { // where to send the user on the screen
            onLogin: '/tickets',                    
            onLogout: '/login',                    
            onAuthOnly: '/login',                  
            onGuestOnly: '/tickets',               
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