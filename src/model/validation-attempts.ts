import * as dynamoose from 'dynamoose';

const schema = new dynamoose.Schema(
  {
    account_id: {
      type: Number,
      hashKey: true,
    },
    validation_date: {
      type: String,
      rangeKey: true,
    },
    org_id: {
      type: String,
    },
    org_name: {
      type: String,
    },
    eligibility_status: {
      type: String,
    },
    reason: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: ['createDate', 'creation'],
      updatedAt: ['updateDate', 'updated'],
    },
  },
);

export const ValidationAttemptsModel = dynamoose.model('ValidationAttempts', schema, { create: false });
