import { withMerchantScope } from './merchant-scope';

describe('withMerchantScope', () => {
  it('prevents a client merchantId from bypassing the authenticated merchant', () => {
    const scopedWhere = withMerchantScope(
      { id: 'transaction-b', merchantId: 'merchant-b' },
      'merchant-a',
    );

    expect(scopedWhere).toEqual({
      id: 'transaction-b',
      merchantId: 'merchant-a',
    });
  });

  it('scopes resource queries to the authenticated merchant', () => {
    expect(withMerchantScope({ id: 'transaction-a' }, 'merchant-a')).toEqual({
      id: 'transaction-a',
      merchantId: 'merchant-a',
    });
  });
});