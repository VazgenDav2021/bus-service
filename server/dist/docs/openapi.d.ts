export declare function getOpenApiSpec(): {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
    };
    servers: {
        url: string;
    }[];
    components: {
        securitySchemes: {
            cookieAuth: {
                type: string;
                in: string;
                name: string;
            };
        };
    };
    paths: {
        '/auth/login': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/auth/refresh': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/auth/logout': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/driver/me': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/driver/scan/student': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/driver/scan/board': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/admin/students': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/admin/drivers': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/admin/buses': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/admin/owners': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/bus-owner/stats': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/bus-owner/buses': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/bus-owner/drivers': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/bus-owner/assignments': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    cookieAuth: never[];
                }[];
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
    };
};
//# sourceMappingURL=openapi.d.ts.map