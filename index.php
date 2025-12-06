<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="css/login.css">
</head>

<body>
    <header>
        <h1 class="page-title">Welcome to CvSU's plethora</h1>
    </header>

    <main>
        <section class="login-box">
            <p class="main-text">This is the landing page of CvSU's plethora of websites. Sign in below or enter as an aspiring Kabsuhenyo.</p>

            <form class="login-form" action="login.php" method="post">
                <p class="admin-label">Administrator login</p>
                <?php if (isset($_GET['error']) && $_GET['error'] === '1'): ?>
                    <p class="error">Invalid email or password.</p>
                <?php endif; ?>
                <label for="email" class="sr-only">Email</label>
                    <input id="email" name="email" type="email" placeholder="Email" required>


                <label for="password" class="sr-only">Password</label>
                    <input id="password" name="password" type="password" placeholder="Password" required minlength="5">

                <div class="action-row">
                    <button type="submit" class="submit-btn">Sign In as Administrator</button>
                    <a href="login.php?guest=true" class="alt-btn guest-btn">Or enter as a guest.</a>
                </div>
            </form>
        </section>
    </main>

</body>
</html>