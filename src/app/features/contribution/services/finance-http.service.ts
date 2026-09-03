import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {ResponseEntityApi} from '../../../core/models/response-entity-api';
import {
  DebtSummaryDto,
  DonationDto,
  FinancialDashboardDto,
  ManualPaymentRequest,
  MemberFinancialCalendarDto,
  PaymentReceiptDto,
  SmartPaymentRequest,
  ContributionDto
} from '../models/finance.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceHttpService {

  private readonly baseUrl = `${environment.API_URL}/api/v1/finance`;
  private readonly donationsUrl = `${environment.API_URL}/api/v1/donations`;

  constructor(private http: HttpClient) {}

  public getDashboardStats(phaseId?: string): Observable<ResponseEntityApi<FinancialDashboardDto>> {
    let params = new HttpParams();
    if (phaseId) {
      params = params.set('phaseId', phaseId);
    }
    return this.http.get<ResponseEntityApi<FinancialDashboardDto>>(`${this.baseUrl}/dashboard/stats`, {params});
  }

  public getMemberCalendar(memberId: string, phaseId?: string): Observable<ResponseEntityApi<MemberFinancialCalendarDto>> {
    let params = new HttpParams();
    if (phaseId) {
      params = params.set('phaseId', phaseId);
    }
    return this.http.get<ResponseEntityApi<MemberFinancialCalendarDto>>(`${this.baseUrl}/members/${memberId}/calendar`, {params});
  }

  public getMemberContributions(memberId: string): Observable<ResponseEntityApi<ContributionDto[]>> {
    return this.http.get<ResponseEntityApi<ContributionDto[]>>(`${this.baseUrl}/members/${memberId}/contributions`);
  }

  public getDebtors(): Observable<ResponseEntityApi<DebtSummaryDto[]>> {
    return this.http.get<ResponseEntityApi<DebtSummaryDto[]>>(`${this.baseUrl}/debtors`);
  }

  public recordPayment(request: ManualPaymentRequest): Observable<ResponseEntityApi<PaymentReceiptDto>> {
    return this.http.post<ResponseEntityApi<PaymentReceiptDto>>(`${this.baseUrl}/payments`, request);
  }

  public recordSmartPayment(request: SmartPaymentRequest): Observable<ResponseEntityApi<PaymentReceiptDto>> {
    return this.http.post<ResponseEntityApi<PaymentReceiptDto>>(`${this.baseUrl}/payments/smart-allocate`, request);
  }

  public getPaymentReceipt(paymentId: string): Observable<ResponseEntityApi<PaymentReceiptDto>> {
    return this.http.get<ResponseEntityApi<PaymentReceiptDto>>(`${this.baseUrl}/payments/${paymentId}/receipt`);
  }

  public getRecentPayments(limit: number = 30): Observable<ResponseEntityApi<PaymentReceiptDto[]>> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<ResponseEntityApi<PaymentReceiptDto[]>>(`${this.baseUrl}/payments/recent`, {params});
  }

  public getAllDonations(): Observable<ResponseEntityApi<DonationDto[]>> {
    return this.http.get<ResponseEntityApi<DonationDto[]>>(`${this.donationsUrl}`);
  }

  public recordDonation(donation: DonationDto): Observable<ResponseEntityApi<DonationDto>> {
    return this.http.post<ResponseEntityApi<DonationDto>>(`${this.donationsUrl}`, donation);
  }
}
