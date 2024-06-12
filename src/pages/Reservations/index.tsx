import React, { memo } from 'react';

type props = {};
export type ReservationsProps = props;
export const Reservations: React.FC<
  React.PropsWithChildren<ReservationsProps>
> = memo((props) => {
  return <>预约管理</>;
});
Reservations.displayName = '';

export default Reservations;
