import { isTokenValid } from '../../src/utils/token-validator';

describe('Lookup API validation path', () => {
  it('Provided token has got proper format', () => {
    const correctToken = 'pin123@321handle';
    expect(isTokenValid(correctToken)).toEqual(true);
  });

  it('Provided token has got invalid format', () => {
    const invalidTokens = ['pinhandle', 'pin@pin@handle', 'pin@ handle'];
    invalidTokens.forEach((token) => {
      expect(isTokenValid(token)).toEqual(false);
    });
  });
});

// describe('Lookup response validation', () => {
//   it('Correct response from lookup api should pass the validation check', () => { });

//   it('Incorrect response (empty array) from lookup api should return no data for provided token', () => {

//   });
// });
