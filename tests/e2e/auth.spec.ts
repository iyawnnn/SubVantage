import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("should allow a new user to sign up and login", async ({ page }) => {
    const timestamp = Date.now();
    const email = `auth-${timestamp}@example.com`;
    const password = "Password123!";

    console.log(`Testing Auth with: ${email}`);

    // 1. Sign Up
    await page.goto("/auth/signup");
    await page.getByLabel(/Full Name/i).fill("Auth Tester");
    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel(/Confirm Password/i).fill(password);
    
    // 👇 FIX: Be specific! Only click the button that says exactly "Create Account"
    await page.getByRole("button", { name: "Create Account", exact: true }).click();

    // 2. Login (App redirects here)
    await page.waitForURL("**/auth/login");
    await page.getByLabel(/Email/i).fill(email);
    await page.getByLabel(/Password/i).fill(password);
    await page.locator('button[type="submit"]').click();

    // 3. Verify Dashboard Access
    await page.waitForURL("**/dashboard");
    
    // Dismiss Onboarding safely by targeting the close button or clicking outside
    try {
        const dialog = page.getByRole("dialog");
        if (await dialog.isVisible({ timeout: 5000 })) {
            // Try to click a "Close" or "Get Started" button if your modal has one
            // Or force the escape key multiple times
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
        }
    } catch (e) {}

    // Check for dashboard element
    await expect(page.getByRole("link", { name: /Dashboard|Overview/i }).first()).toBeVisible({ timeout: 10000 });
  });
});