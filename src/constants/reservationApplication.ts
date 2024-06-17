const ReservationApplicationStatusMapToStyle: Record<
  API.ReservationApplication.Instance['status'],
  { text: string; status: string }
> = {
  PENDING: { text: '待通知', status: 'default' },
  NOTIFIED: { text: '已通知', status: 'warning' },
  FULFILLED: { text: '已取书', status: 'success' },
  CANCELLED: { text: '已取消', status: 'default' },
};

const ReservationApplicationStatusOption: {
  value: API.ReservationApplication.Instance['status'];
  label: string;
}[] = [
  { value: 'PENDING', label: '待通知' },
  { value: 'NOTIFIED', label: '已通知' },
  { value: 'FULFILLED', label: '已取书' },
  { value: 'CANCELLED', label: '已取消' },
];

export const ReservationApplication = {
  ReservationApplicationStatusMapToStyle,
  ReservationApplicationStatusOption,
};
