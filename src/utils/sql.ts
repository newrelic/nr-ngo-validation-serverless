import { ValidationHistoryRequest } from "../types/database";

export const createSql = (
  params: ValidationHistoryRequest,
  isCountQuery: boolean
): string => {
  let query = createQueryBegin(isCountQuery);

  if (params.startDate && params.endDate) {
    query += "WHERE validation_date BETWEEN :start_date AND :end_date ";
  }

  if (params.accountId && params.orgId) {
    query += "AND account_id = :account_id AND org_id = :org_id ";
  }

  if (!isCountQuery) {
    if (params.orderAsc !== undefined && params.orderBy) {
      query += `ORDER BY ${params.orderBy} ${
        params.orderAsc ? "ASC" : "DESC"
      } `;
    }

    if (params.limit) {
      query += `LIMIT :limit `;
    }

    if (params.offset) {
      query += `OFFSET :offset `;
    }
  }

  return query;
};

export const createSqlAdm = (
  params: ValidationHistoryRequest,
  isCountQuery: boolean
): string => {
  let query = createQueryBegin(isCountQuery);

  if (params.startDate && params.endDate) {
    query += "WHERE validation_date BETWEEN :start_date AND :end_date ";
  }

  if (params.searchPhrase) {
    query += `AND (org_id ILIKE CONCAT('%', :search_phrase, '%') OR org_name ILIKE CONCAT('%', :search_phrase, '%') OR account_id ILIKE CONCAT('%', :search_phrase, '%')) `;
  }

  if (!isCountQuery) {
    if (params.orderAsc !== undefined && params.orderBy) {
      query += `ORDER BY ${params.orderBy} ${
        params.orderAsc ? "ASC" : "DESC"
      } `;
    }

    if (params.limit) {
      query += `LIMIT :limit `;
    }

    if (params.offset) {
      query += `OFFSET :offset `;
    }
  }

  return query;
};

export const createQueryBegin = (isCountQuery: boolean): string => {
  if (isCountQuery) {
    return `SELECT COUNT(*) FROM validation_attempts `;
  }

  return `SELECT * FROM validation_attempts `;
};

export const checkValidColumnName = (columnName: string): boolean => {
  const columnNames = [
    "account_id",
    "validation_date",
    "org_id",
    "org_name",
    "eligibility_status",
    "reason",
    "token",
  ];

  return columnNames.includes(columnName);
};
