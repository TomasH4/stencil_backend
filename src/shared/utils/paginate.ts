// BE-37: Pagination utility
// Converts page/limit into Prisma-compatible skip/take values.

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export interface PaginationOptions {
  skip: number;
  take: number;
  page: number;
  limit: number;
}

/**
 * Converts page + limit query params into Prisma skip/take.
 * Enforces sensible defaults and a maximum limit of 50.
 */
export function getPagination(
  rawPage?: number,
  rawLimit?: number,
): PaginationOptions {
  const page = Math.max(1, rawPage ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit ?? DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  return { skip, take: limit, page, limit };
}
