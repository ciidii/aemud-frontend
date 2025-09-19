export interface ContributionCalendarItem {
  id: string;
  sessionID: string;
  memberID: string;
  month: [number, number];
  amountDue: number;
  amountPaid: number;
  status: 'PAID' | 'PENDING' | 'DELAYED' | 'NOT_APPLICABLE';
}
