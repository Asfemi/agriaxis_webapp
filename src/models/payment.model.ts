export interface PaymentInitialiseRequest {
  farmId: string;
  amount: number;
  currency: string;
  country?: string;
  redirect_url?: string
  customer: {
    email: string;
    name: string;
    phonenumber: string;
  };
}

export interface PaymentInitialiseResponse {
  payment_link: string;
  tx_ref: string;
  amount: number;
  currency: string;
  farm_id: string;
}

export interface PaymentVerifyRequest {
  farmId: string;
  amount: number;
  currency: string;
  txRef: string;
  transactionId: string;
  status: string;
  success: boolean;
}
