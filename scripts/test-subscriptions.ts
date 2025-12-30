import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

// Initialize Firebase Admin
const serviceAccountPath = './service-account.json';
if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    if (getApps().length === 0) {
        initializeApp({
            credential: cert(serviceAccount)
        });
    }
} else {
    if (getApps().length === 0) {
        initializeApp();
    }
}

const db = getFirestore();

// WooCommerce configuration
const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL || 'https://buy.creativewaves.me';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

async function wooCommerceRequest<T>(endpoint: string): Promise<T> {
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        throw new Error('WooCommerce API credentials not configured');
    }

    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3${endpoint}`;
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(url, {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`WooCommerce API error: ${response.status} - ${error}`);
    }

    return response.json();
}

async function testSubscriptions() {
    console.log('🔍 Testing WooCommerce Subscription Integration\n');
    console.log('='.repeat(60));

    // Check environment variables
    console.log('\n📋 Configuration:');
    console.log(`   WooCommerce URL: ${WOOCOMMERCE_URL}`);
    console.log(`   Consumer Key: ${CONSUMER_KEY ? '✓ Set' : '✗ Missing'}`);
    console.log(`   Consumer Secret: ${CONSUMER_SECRET ? '✓ Set' : '✗ Missing'}`);

    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.log('\n❌ WooCommerce credentials not configured!');
        console.log('   Please set WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET');
        process.exit(1);
    }

    // Fetch all users from Firestore
    console.log('\n\n👥 Fetching users from Firestore...');
    const usersSnapshot = await db.collection('users').get();
    console.log(`   Found ${usersSnapshot.size} users`);

    // Filter users with subscriptionId or wooCommerceSubscriptionId
    const usersWithSubscriptions = usersSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() as any }))
        .filter(user => user.wooCommerceSubscriptionId || user.subscriptionId);

    console.log(`   ${usersWithSubscriptions.length} users have a subscription ID`);

    if (usersWithSubscriptions.length === 0) {
        console.log('\n✓ No users with subscription ID to test');
        return;
    }

    console.log('\n\n🔄 Testing WooCommerce API for each subscription...\n');
    console.log('='.repeat(60));

    for (const user of usersWithSubscriptions) {
        const subId = user.wooCommerceSubscriptionId || user.subscriptionId;
        console.log(`\n📧 ${user.email || user.id}`);
        console.log(`   Firestore ID: ${user.id}`);
        console.log(`   Subscription ID: ${subId}`);
        console.log(`   Local Status: ${user.subscriptionStatus || 'not set'}`);

        try {
            // Fetch subscription from WooCommerce
            const subscription = await wooCommerceRequest<any>(`/subscriptions/${subId}`);

            console.log(`   ✅ WooCommerce Status: ${subscription.status}`);
            console.log(`   💰 Amount: ${subscription.total} ${subscription.currency.toUpperCase()}`);
            console.log(`   📅 Next Payment: ${subscription.next_payment_date || 'N/A'}`);
            console.log(`   🔄 Billing: Every ${subscription.billing_interval} ${subscription.billing_period}`);

            // Check if local status matches WooCommerce
            if (user.subscriptionStatus !== subscription.status) {
                console.log(`   ⚠️  Status mismatch! Local: "${user.subscriptionStatus}" vs WooCommerce: "${subscription.status}"`);
            }

        } catch (error: any) {
            console.log(`   ❌ Error fetching from WooCommerce: ${error.message}`);
        }
    }

    console.log('\n\n' + '='.repeat(60));
    console.log('✓ Test complete!\n');
}

// Run the test
testSubscriptions().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
