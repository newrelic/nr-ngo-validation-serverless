export const SqlFixtures = {
  selectQueryBegin: "SELECT * FROM validation_attempts ",
  countQueryBegin: "SELECT COUNT(*) FROM validation_attempts ",
  minimumQuery:
    "SELECT * FROM validation_attempts WHERE validation_date BETWEEN :start_date AND :end_date ",
  queryWithAccountId:
    "SELECT * FROM validation_attempts WHERE validation_date BETWEEN :start_date AND :end_date AND account_id = :account_id ORDER BY validation_date ASC LIMIT :limit OFFSET :offset ",
  queryWithAccountIdAndNewrelicOrgId:
    "SELECT * FROM validation_attempts WHERE validation_date BETWEEN :start_date AND :end_date AND account_id = :account_id AND newrelic_org_id = :newrelic_org_id ORDER BY validation_date ASC LIMIT :limit OFFSET :offset ",
  queryWithoutOffset:
    "SELECT * FROM validation_attempts WHERE validation_date BETWEEN :start_date AND :end_date AND account_id = :account_id ORDER BY validation_date ASC LIMIT :limit ",
  queryWithSearchPhrase:
    "SELECT * FROM validation_attempts WHERE validation_date BETWEEN :start_date AND :end_date AND (org_id ILIKE CONCAT('%', :search_phrase, '%') OR org_name ILIKE CONCAT('%', :search_phrase, '%') OR account_id ILIKE CONCAT('%', :search_phrase, '%')) ORDER BY validation_date ASC LIMIT :limit ",
};
