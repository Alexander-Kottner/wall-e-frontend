import api from './api';

export const getBalance = async () => {
  const res = await api.get('/wallet/balance');
  return res.data;
};

export const requestDebin = async (amount) => {
  const res = await api.post('/wallet/topup/debin', { amount });
  return res.data;
};

export const getWalletDetails = async () => {
  const res = await api.get('/wallet');
  return res.data;
};

export const addMoneyManual = async (
  amount,
  method = 'BANK_ACCOUNT',
  sourceIdentifier,
) => {
  const res = await api.post('/wallet/topup/manual', {
    amount,
    method,
    sourceIdentifier,
  });
  return res.data;
};
