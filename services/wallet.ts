import api from './api';

export const getBalance = async () => {
  const res = await api.get('/wallet/balance');
  return res.data;
};

export const requestDebin = async (amount: number) => {
  const res = await api.post('/wallet/topup/debin', { amount });
  return res.data;
};

export const getWalletDetails = async () => {
  const res = await api.get('/wallet');
  return res.data;
};
