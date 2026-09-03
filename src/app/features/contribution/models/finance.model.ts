export type ContributionStatus = 'PAID' | 'PENDING' | 'DELAYED' | 'NOT_APPLICABLE' | 'CANCELLED';

export type PaymentMethod = 'CASH' | 'WAVE_MONEY' | 'ORANGE_MONEY';

export interface ContributionDto {
  id: string;
  memberId: string;
  phaseId: string;
  month: string; // "2025-01"
  amountDue: number;
  amountPaid: number;
  status: ContributionStatus;
}

export interface PaymentReceiptDto {
  paymentId: string;
  receiptNumber: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
  transactionReference?: string;
  recordedBy?: string;
  notes?: string;
  memberId?: string;
  memberFullName?: string;
  memberNumber?: string;
  monthsCovered?: string[];
  paidContributionIds?: string[];
}

export interface FinancialDashboardDto {
  totalCollectedContributions: number;
  totalCollectedDonations: number;
  totalOverallCollected: number;
  cashTotal: number;
  waveTotal: number;
  orangeMoneyTotal: number;
  totalDelayedDebt: number;
  totalDebtorsCount: number;
  collectionRatePercentage: number;
  totalActiveMembersCount: number;
}

export interface MemberFinancialCalendarDto {
  memberId: string;
  memberFullName: string;
  memberNumber?: string;
  bourseLibelle: string;
  monthlyAmount: number;
  phaseId: string;
  phaseNom: string;
  totalPaid: number;
  totalDue: number;
  totalDebt: number;
  contributions: ContributionDto[];
}

export interface SmartPaymentRequest {
  memberId: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  recordedBy?: string;
  notes?: string;
}

export interface ManualPaymentRequest {
  contributionIds: string[];
  paymentMethod: string;
  transactionReference?: string;
  recordedBy?: string;
  notes?: string;
}

export interface DebtSummaryDto {
  memberId: string;
  totalDebt: number;
  unpaidMonthsCount: number;
  months: string[];
}

export interface DonationDto {
  id?: string;
  donorMemberId?: string;
  donorName: string;
  donorEmail?: string;
  amount: number;
  donationDate?: string;
  paymentMethod: string;
  purpose: string;
  receiptNumber?: string;
}
