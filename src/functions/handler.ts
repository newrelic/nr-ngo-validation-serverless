import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda';

export const handle: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  _context: Context
) => {
  // eslint-disable-next-line no-console
  console.log(_context);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};
