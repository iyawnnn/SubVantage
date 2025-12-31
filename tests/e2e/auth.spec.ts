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
    
    // Dismiss Onboarding
    try {
        if (await page.getByRole("dialog").isVisible({ timeout: 3000 })) {
            await page.keyboard.press('Escape');
        }
    } catch (e) {}

    // Check for dashboard element
    await expect(page.getByRole("link", { name: /Dashboard|Overview/i }).first()).toBeVisible();
  });
});