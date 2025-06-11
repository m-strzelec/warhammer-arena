module.exports = [
    // --- AUTH SERVICE ---
    { path: '/api/auth/register', method: 'POST', roles: ['PUBLIC'] },
    { path: '/api/auth/login', method: 'POST', roles: ['PUBLIC'] },
    { path: '/api/auth/logout', method: 'POST', roles: ['PUBLIC'] }, // Manages the token independently
    { path: '/api/auth/refresh', method: 'POST', roles: ['PUBLIC'] }, // Manages the token independently
    { path: '/api/auth/self', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/auth/users', method: 'GET', roles: ['ADMIN'] },
    { path: '/api/auth/users/:id', method: 'GET', roles: ['ADMIN'] },
    { path: '/api/auth/users/:id', method: 'PUT', roles: ['ADMIN'] },
    { path: '/api/auth/users/:id', method: 'DELETE', roles: ['ADMIN'] },

    // --- CHARACTER SERVICE ---
    { path: '/api/characters', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/characters/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/characters', method: 'POST', roles: ['USER', 'ADMIN'] },
    { path: '/api/characters/:id', method: 'PUT', roles: ['USER', 'ADMIN'] },
    { path: '/api/characters/:id', method: 'DELETE', roles: ['USER', 'ADMIN'] },

    // --- TRAIT SERVICE ---
    { path: '/api/traits', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/traits/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/traits', method: 'POST', roles: ['ADMIN'] },
    { path: '/api/traits/:id', method: 'PUT', roles: ['ADMIN'] },
    { path: '/api/traits/:id', method: 'DELETE', roles: ['ADMIN'] },

    // --- ARMOR SERVICE ---
    { path: '/api/armors', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/armors/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/armors', method: 'POST', roles: ['ADMIN'] },
    { path: '/api/armors/:id', method: 'PUT', roles: ['ADMIN'] },
    { path: '/api/armors/:id', method: 'DELETE', roles: ['ADMIN'] },

    // --- WEAPON SERVICE ---
    { path: '/api/weapons', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/weapons/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/weapons', method: 'POST', roles: ['ADMIN'] },
    { path: '/api/weapons/:id', method: 'PUT', roles: ['ADMIN'] },
    { path: '/api/weapons/:id', method: 'DELETE', roles: ['ADMIN'] },

    // --- SKILL SERVICE ---
    { path: '/api/skills', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/skills/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/skills', method: 'POST', roles: ['ADMIN'] },
    { path: '/api/skills/:id', method: 'PUT', roles: ['ADMIN'] },
    { path: '/api/skills/:id', method: 'DELETE', roles: ['ADMIN'] },

    // --- TALENT SERVICE ---
    { path: '/api/talents', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/talents/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/talents', method: 'POST', roles: ['ADMIN'] },
    { path: '/api/talents/:id', method: 'PUT', roles: ['ADMIN'] },
    { path: '/api/talents/:id', method: 'DELETE', roles: ['ADMIN'] },

    // --- FIGHT SERVICE ---
    { path: '/api/fights', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/fights/:id', method: 'GET', roles: ['USER', 'ADMIN'] },
    { path: '/api/fights', method: 'POST', roles: ['USER', 'ADMIN'] },
];
