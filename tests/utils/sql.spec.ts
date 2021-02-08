import { createQueryBegin, createSql, checkValidColumnName } from '../../src/utils/sql';
import { SqlFixtures } from '../fixtures/sql-fixtures';
import { ValidationHistoryFixtures } from '../fixtures/validation-history-fixtures';

describe('Sql utils', () => {
  describe('Create Query Begin method', () => {
    it('Should return sql for select query', () => {
      const query = createQueryBegin(false);
      expect(query).toEqual(SqlFixtures.selectQueryBegin);
    });

    it('Should return sql for count query', () => {
      const query = createQueryBegin(true);
      expect(query).toEqual(SqlFixtures.countQueryBegin);
    });
  });

  describe('Create SQL Query method', () => {
    it('Should return select query with only start and end date', () => {
      const query = createSql(ValidationHistoryFixtures.validationHistoryMinimum, false);
      expect(query).toEqual(SqlFixtures.minimumQuery);
    });

    it('Should return select query based on account id', () => {
      const query = createSql(ValidationHistoryFixtures.validationHistoryAccountId, false);
      expect(query).toEqual(SqlFixtures.queryWithAccountId);
    });

    it('Should return select query based on account id, when offset is 0 then without it', () => {
      const query = createSql(ValidationHistoryFixtures.validationHistoryWithoutOffset, false);
      expect(query).toEqual(SqlFixtures.queryWithoutOffset);
    });

    it('Should return select query based on search phrase', () => {
      const query = createSql(ValidationHistoryFixtures.validationHistorySearchPhrase, false);
      expect(query).toEqual(SqlFixtures.queryWithSearchPhrase);
    });
  });

  describe('Check if given column name is correct', () => {
    it('Valid column name, should return true', () => {
      const columnName = 'account_id';
      expect(checkValidColumnName(columnName)).toBe(true);
    });

    it('Invalid column name, should return false', () => {
      const columnName = 'account_uuid';
      expect(checkValidColumnName(columnName)).toBe(false);
    });

    it('Non string and not existing column name, should return false', () => {
      const columnName = 123 as any;
      expect(checkValidColumnName(columnName)).toBe(false);
    });
  });
});
