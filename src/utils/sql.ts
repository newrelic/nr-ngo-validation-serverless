import { ValidationHistoryRequest } from '../types/database';

export const createSql = (params: ValidationHistoryRequest, isCountQuery: boolean): string => {
  let query = createQueryBegin(isCountQuery);

  if (params.startDate && params.endDate) {
    query += 'WHERE validation_date BETWEEN :start_date AND :end_date ';
  }

  if (params.accountId) {
    query += 'AND account_id = :account_id ';
  }

  if (params.searchPhrase) {
    query += `AND (org_id ILIKE '%${params.searchPhrase}%' OR org_name ILIKE '%${params.searchPhrase}%' OR account_id ILIKE '%${params.searchPhrase}%') `;
  }

  if (params.orderAsc !== undefined && params.orderBy) {
    query += `ORDER BY :column ${params.orderAsc ? 'ASC' : 'DESC'} `;
  }

  if (params.limit) {
    query += 'LIMIT :limit ';
  }

  if (params.offset) {
    query += 'OFFSET :offset ';
  }

  return query;
};

export const createQueryBegin = (isCountQuery: boolean): string => {
  if (isCountQuery) {
    return 'SELECT COUNT(*) FROM validation_attempts ';
  }

  return 'SELECT * FROM validation_attempts ';
};
