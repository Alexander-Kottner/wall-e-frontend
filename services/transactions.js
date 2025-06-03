import api from './api';

export const p2pTransfer = async (recipientIdentifier, amount) => {
  const res = await api.post('/transactions/p2p', {
    recipientIdentifier,
    amount,
  });
  return res.data;
};

export const getAll = async () => {
  const res = await api.get('/transactions');
  return res.data;
};
