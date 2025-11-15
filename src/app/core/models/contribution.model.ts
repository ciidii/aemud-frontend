export interface ContributionModel {
  contributionId: string | null;
  memberId: string;
  sessionId: string;
  monthId: string;
  amount: number;
  paymentDate: [number, number, number];  // Format [année, mois, jour]
}
