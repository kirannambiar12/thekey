export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  total: number,
  { page, limit }: PaginationParams,
): PaginatedResult<T> {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
}

export function getOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}
