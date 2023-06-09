import {createRouter, createWebHistory} from 'vue-router';

const routes = [
    // ...
    {
        path: '/',
        redirect: {path: '/login'},
    },

    {
        path: '/login',
        name: "login",
        component: () => import('../pages/login/Login.vue'),
    },
    {
        path: '/register',
        name: "register",
        component: () => import('../pages/register/Register.vue'),
    },
    {
        path: '/main',
        name: "main",
        redirect: "/session",
        component: () => import('../pages/main/Main.vue'),
        children: [
            {
                path: '/session',
                name: "session",
                component: () => import('../pages/main/session/Session.vue'),
            },
            {
                path: '/contacts',
                name: "contacts",
                component: () => import('../pages/main/contacts/Contacts.vue'),
            },
            {
                path: '/my',
                name: "my",
                component: () => import('../pages/main/my/My.vue'),
            },
        ]
    },
    {
        path: '/chat',
        name: "chat",
        component: () => import('../pages/chat/Chat.vue'),
    },
    {
        path: '/photo',
        name: 'photo',
        component: () => import('../pages/chat/Photo.vue'),
    },
    {
        path: '/chess',
        name: 'chess',
        component: () => import('../pages/chat/Chess.vue'),
    },
    {
        path: '/admin',
        name: 'admin',
        redirect: "/admin/dashboard",
        component: () => import('../pages/admin/admin.vue'),
        children: [
            {
                path: '/admin/dashboard',
                name: 'dashboard',
                component: () => import('../pages/admin/dashboard/Dashboard.vue'),
            },
            {
                path: '/admin/usermgr',
                name: 'usermgr',
                component: () => import('../pages/admin/usrmgr/UserMgr.vue'),
            }
        ]
    }
    // ...
];

const router = createRouter({
    history: createWebHistory("/wchatgpt-fe"),
    routes,
});

export default router;
