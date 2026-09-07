# BHAVISHMART — GitHub Pages + Supabase

Marketplace-style BHAVISHMART storefront for `bhavishmart.shop`.

## Included
- Responsive storefront for desktop, tablet and mobile
- Product search, categories, deals and cart UI
- Customer sign-up, sign-in and logout using Supabase Auth
- Automatic `customers` record through the Supabase database trigger
- Seller login placeholder (seller auth should be added separately)
- CNAME for `bhavishmart.shop`

## Supabase connection
The browser uses the Supabase **Project URL** and **Publishable key**. Publishable keys are intended for frontend use; never put a Secret/Service Role key in this repository.

Project URL:
`https://uijghkxiofripwggvztr.supabase.co`

The Supabase project should keep Row Level Security enabled and use appropriate policies before production launch.

## Important production work still needed
- RLS policies for customer-owned data, orders, wishlist, reviews and seller/admin access
- Secure server-side payment integration (Razorpay/Cashfree/PayU/etc.)
- Order creation, inventory reservation and payment webhooks
- Shipping, returns, refunds and notifications
- Seller onboarding and seller authorization
- Marketplace API integrations (Amazon/Flipkart/Myntra) where approved
- Production email/SMTP configuration for branded account emails

Do not store passwords, service-role keys, payment secrets or other private credentials in frontend files.
