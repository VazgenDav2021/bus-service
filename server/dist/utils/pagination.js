export function toPrismaPagination(params) {
    return {
        skip: (params.page - 1) * params.pageSize,
        take: params.pageSize,
    };
}
export function buildPaginationMeta(params, total) {
    return {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / params.pageSize)),
    };
}
