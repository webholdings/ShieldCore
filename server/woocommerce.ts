import type { Request, Response, NextFunction } from 'express';

// WooCommerce Subscription Status Types
export type SubscriptionStatus =
    | 'pending'
    | 'active'
    | 'on-hold'
    | 'pending-cancel'
    | 'cancelled'
    | 'expired'
    | 'trash';

export interface WooCommerceSubscription {
    id: number;
    parent_id: number;
    status: SubscriptionStatus;
    currency: string;
    date_created: string;
    date_modified: string;
    billing_period: string;
    billing_interval: string;
    start_date: string;
    next_payment_date: string;
    end_date: string | null;
    total: string;
    customer_id: number;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || 'https://buy.creativewaves.me';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

/**
 * Makes an authenticated request to the WooCommerce REST API
 */
async function wooCommerceRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.warn('WooCommerce API credentials not configured - skipping API call');
        // Return a mock response that will be handled gracefully by the caller
        // We cast to any to bypass the generic type constraint temporarily for this error case
        return {} as any;
    }

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3${endpoint}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url, {
        method,
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`WooCommerce API error: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Get a subscription by ID
 */
export async function getSubscription(subscriptionId: string): Promise<WooCommerceSubscription> {
    return wooCommerceRequest<WooCommerceSubscription>(`/subscriptions/${subscriptionId}`);
}

/**
 * Update a subscription (e.g., pause, cancel)
 */
export async function updateSubscription(
    subscriptionId: string,
    status: SubscriptionStatus
): Promise<WooCommerceSubscription> {
    return wooCommerceRequest<WooCommerceSubscription>(
        `/subscriptions/${subscriptionId}`,
        'PUT',
        { status }
    );
}

/**
 * Get all subscriptions for a customer by email
 */
export async function getCustomerSubscriptions(email: string): Promise<WooCommerceSubscription[]> {
    // First, search for the customer
    const customers = await wooCommerceRequest<any[]>(`/customers?email=${encodeURIComponent(email)}`);

    if (!customers || customers.length === 0) {
        return [];
    }

    const customerId = customers[0].id;

    // Get all subscriptions for this customer
    return wooCommerceRequest<WooCommerceSubscription[]>(`/subscriptions?customer=${customerId}`);
}

/**
 * Pause a subscription
 */
export async function pauseSubscription(subscriptionId: string): Promise<WooCommerceSubscription> {
    return updateSubscription(subscriptionId, 'on-hold');
}

/**
 * Resume a subscription
 */
export async function resumeSubscription(subscriptionId: string): Promise<WooCommerceSubscription> {
    return updateSubscription(subscriptionId, 'active');
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string): Promise<WooCommerceSubscription> {
    return updateSubscription(subscriptionId, 'cancelled');
}
