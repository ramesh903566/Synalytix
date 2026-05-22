export interface SubscriptionPlan {
  tier:        'free' | 'pro' | 'business' | 'enterprise'
  name:        string
  priceMonthly: number
  priceYearly:  number
  features:    string[]
  limits: {
    datasetRows:   number
    aiQueries:     number
    teamSeats:     number
    apiCalls:      number
  }
}

export interface BillingInfo {
  plan:               SubscriptionPlan
  currentPeriodStart: string
  currentPeriodEnd:   string
  cancelAtPeriodEnd:  boolean
  paymentMethod?: {
    brand:    string
    last4:    string
    expMonth: number
    expYear:  number
  }
}
