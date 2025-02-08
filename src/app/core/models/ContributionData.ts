export interface ContributionData {
  contributionId: string | null;
  memberId: string;
  sessionId: string;
  monthId: string;
  amount: number;
  paymentDate: [number, number, number];  // Format [année, mois, jour]
}
