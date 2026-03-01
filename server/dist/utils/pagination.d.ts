export interface PaginationParams {
    page: number;
    pageSize: number;
}
export interface PaginationMeta extends PaginationParams {
    total: number;
    totalPages: number;
}
export declare function toPrismaPagination(params: PaginationParams): {
    skip: number;
    take: number;
};
export declare function buildPaginationMeta(params: PaginationParams, total: number): PaginationMeta;
//# sourceMappingURL=pagination.d.ts.map