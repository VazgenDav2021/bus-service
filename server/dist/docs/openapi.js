export function getOpenApiSpec() {
    return {
        openapi: '3.0.3',
        info: {
            title: 'Student Transportation Management API',
            version: '1.0.0',
            description: 'API without trip and shift features.',
        },
        servers: [{ url: '/api' }],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'accessToken',
                },
            },
        },
        paths: {
            '/auth/login': { post: { summary: 'Login', tags: ['Auth'], responses: { '200': { description: 'OK' } } } },
            '/auth/refresh': { post: { summary: 'Refresh session', tags: ['Auth'], responses: { '200': { description: 'OK' } } } },
            '/auth/logout': { post: { summary: 'Logout', tags: ['Auth'], responses: { '200': { description: 'OK' } } } },
            '/driver/me': {
                get: {
                    summary: 'Get current driver',
                    tags: ['Driver'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/driver/scan/student': {
                get: {
                    summary: 'Get student by QR token',
                    tags: ['Driver'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/driver/scan/board': {
                post: {
                    summary: 'Submit student entrance to bus',
                    tags: ['Driver'],
                    security: [{ cookieAuth: [] }],
                    responses: { '201': { description: 'Created' } },
                },
            },
            '/admin/students': {
                get: {
                    summary: 'List students',
                    tags: ['Admin'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
                post: {
                    summary: 'Create student',
                    tags: ['Admin'],
                    security: [{ cookieAuth: [] }],
                    responses: { '201': { description: 'Created' } },
                },
            },
            '/admin/drivers': {
                get: {
                    summary: 'List drivers',
                    tags: ['Admin'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/admin/buses': {
                get: {
                    summary: 'List buses',
                    tags: ['Admin'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/admin/owners': {
                get: {
                    summary: 'List bus owners',
                    tags: ['Admin'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
                post: {
                    summary: 'Create bus owner',
                    tags: ['Admin'],
                    security: [{ cookieAuth: [] }],
                    responses: { '201': { description: 'Created' } },
                },
            },
            '/bus-owner/stats': {
                get: {
                    summary: 'Owner dashboard counts',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
            },
            '/bus-owner/buses': {
                get: {
                    summary: 'List owner buses',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
                post: {
                    summary: 'Create owner bus',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '201': { description: 'Created' } },
                },
            },
            '/bus-owner/drivers': {
                get: {
                    summary: 'List owner drivers',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
                post: {
                    summary: 'Create owner driver',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '201': { description: 'Created' } },
                },
            },
            '/bus-owner/assignments': {
                get: {
                    summary: 'List driver-bus assignments',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '200': { description: 'OK' } },
                },
                post: {
                    summary: 'Create driver-bus assignment with dates',
                    tags: ['Bus Owner'],
                    security: [{ cookieAuth: [] }],
                    responses: { '201': { description: 'Created' } },
                },
            },
        },
    };
}
