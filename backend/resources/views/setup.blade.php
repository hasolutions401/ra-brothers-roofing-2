<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Database setup</title>
    <style>
        body { font: 16px/1.5 system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1rem; color: #1f2937; }
        h1 { font-size: 1.5rem; }
        label { display: block; font-weight: 600; margin-bottom: .25rem; }
        input { width: 100%; padding: .6rem .75rem; font: inherit; border: 1px solid #6b7280; border-radius: 6px; box-sizing: border-box; }
        button { margin-top: 1rem; padding: .7rem 1.2rem; font: inherit; font-weight: 700; color: #fff; background: #1d4ed8; border: 0; border-radius: 6px; cursor: pointer; }
        pre { white-space: pre-wrap; background: #f3f4f6; padding: 1rem; border-radius: 6px; font-size: .85rem; }
        .error { color: #b91c1c; font-weight: 600; }
        .ok { color: #15803d; font-weight: 600; }
    </style>
</head>
<body>
    <h1>Database setup</h1>

    @isset($error)
        <p class="error" role="alert">{{ $error }}</p>
    @endisset

    @if ($result !== null)
        <p class="ok">Done. The tables exist and the admin account from .env is ready.</p>
        <pre>{{ $result }}</pre>
        <p>This page is now switched off. Remove <code>SETUP_TOKEN</code> from <code>.env</code>, then sign in at <a href="/admin/login/">/admin/login/</a>.</p>
    @else
        <p>Creates the database tables and the admin account from <code>.env</code>. Enter the <code>SETUP_TOKEN</code> value from <code>.env</code>.</p>
        <form method="post" action="">
            <label for="token">Setup token</label>
            <input id="token" name="token" type="password" autocomplete="off" required>
            <button type="submit">Run setup</button>
        </form>
    @endif
</body>
</html>
