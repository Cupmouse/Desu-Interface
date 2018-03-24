import moment from 'moment';

export const formatBigNumberTimestamp = (timestamp) => {
  const timestampMoment = moment.unix(timestamp.toNumber());
  return timestampMoment.format('YYYY/MM/DD HH:mm:ss');
};
