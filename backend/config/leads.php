<?php

/*
 * Everything specific to handling leads from the website forms.
 */

return [

    /*
     * Allowed answers for every choice field. Shared with the Next.js forms,
     * which import the same JSON file.
     */
    'options' => json_decode(file_get_contents(__DIR__.'/form-options.json'), true, flags: JSON_THROW_ON_ERROR),

    /*
     * "Today" and "this week" on the dashboard, and the date filters, use the
     * business's own calendar. Timestamps are stored in UTC.
     */
    'timezone' => env('BUSINESS_TIMEZONE', 'America/New_York'),

    /*
     * A submission sent faster than this after the form appeared is treated
     * as a bot and silently discarded.
     */
    'min_fill_seconds' => 3,

    /*
     * Where new-lead emails go. Empty disables them (on a host that blocks
     * outgoing mail, leave it empty).
     */
    'notify_email' => env('LEAD_NOTIFY_EMAIL'),

    /*
     * Also email the customer a short "we received your request" note when
     * they gave an email address. Needs working mail, like notify_email.
     */
    'confirm_customer' => (bool) env('LEAD_CONFIRM_CUSTOMER', false),

    /*
     * The public site, including any base path. Used for the dashboard link
     * in new-lead emails and for CORS during local development.
     */
    'frontend_url' => rtrim((string) env('FRONTEND_URL', env('APP_URL', 'http://localhost')), '/'),

    /*
     * The one admin account, created or updated by AdminUserSeeder.
     */
    'admin' => [
        'name' => env('ADMIN_NAME', 'Admin'),
        'email' => env('ADMIN_EMAIL'),
        'password' => env('ADMIN_PASSWORD'),
    ],

    /*
     * One-time browser setup (runs migrations and creates the admin) for
     * hosts without SSH. Disabled unless this is at least 32 characters.
     */
    'setup_token' => env('SETUP_TOKEN'),

];
