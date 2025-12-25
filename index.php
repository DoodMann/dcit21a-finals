<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | CvSU Campus Map</title>
    <link rel="stylesheet" href="css/login.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
</head>

<body>
    <header>
        <h1 class="page-title">CvSU Campus Map</h1>
    </header>

    <main>
        <section class="login-box">
            <p class="main-text">Sign in as administrator or enter as a guest to explore the campus map.</p>

            <form class="login-form" action="login.php" method="post">
                <p class="admin-label">Administrator Login</p>
                <?php if (isset($_GET['error']) && $_GET['error'] === '1'): ?>
                    <p class="error">Invalid email or password.</p>
                <?php endif; ?>
                
                <label for="email" class="sr-only">Email</label>
                <input id="email" name="email" type="email" placeholder="Email" required>

                <label for="password" class="sr-only">Password</label>
                <input id="password" name="password" type="password" placeholder="Password" required minlength="5">

                <div class="action-row">
                    <button type="submit" class="submit-btn">Sign In</button>
                    <a href="login.php?guest=true" class="guest-btn">Enter as Guest</a>
                </div>
            </form>
        </section>
    </main>

</body>
</html>