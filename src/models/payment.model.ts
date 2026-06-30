export interface PaymentInitialiseRequest {
  farmId: string;
  amount: number;
  currency?: string;
  country?: string;
  redirect_url?: string;
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

export interface MpesaPaymentInitialiseResponse {
  tx_ref: string;
  transaction_id: string;
  status: string;
  message: string;
  flw_ref: string;
  amount: number;
  currency: string;
  farm_id: string;
  payment_method: string;
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

export type PaymentSubscription = {
  id: string;
  plan_key: string;
  status: string;
  entitled: boolean;
  customer_email: string;
  tx_ref: string;
  flutterwave_payment_plan_id: number;
  flutterwave_subscription_id: null;
  current_period_start: null;
  current_period_end: null;
  grace_period_ends_at: null;
  canceled_at: null;
  last_charge_at: null;
  last_transaction_id: null;
  created_at: string;
  updated_at: string;
};

export type PaymentSubscriptionReq = {
  plan_key: string;
  redirect_url: string;
  currency: string;
  country: string;
  customer: {
    email: string;
    name: string;
    phonenumber: string;
  };
};

export type PaymentSubscriptionRes = {
  payment_link: string;
  tx_ref: string;
  subscription_id: string;
  plan_key: string;
  amount: number;
  currency: string;
};
