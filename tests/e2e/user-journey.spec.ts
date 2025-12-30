import { test, expect } from "@playwright/test";
import { execSync } from "child_process";

test.describe.configure({ mode: "serial" });

test.describe("User Journey (Mobile)", () => {
  test.setTimeout(60000);

  // Use a mobile viewport
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeAll(() => {
    console.log("🧹 Reseting database to seed state...");
    try {
      execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
    } catch (e) {
      console.error("Seed failed:", e);
      throw e;
    }
  });

  test("should log in and add a subscription", async ({ page }) => {
    // 1. Log In
    await page.goto("/auth/login");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In with Email" }).click();
    await page.waitForURL("**/dashboard");

    // 2. Add Subscription (via Mobile Menu)
    // 👇 FIX: Open mobile menu first
    await page.getByTestId("btn-mobile-menu").click();

    // 👇 FIX: Click the link inside the menu
    await page.getByTestId("mobile-nav-subscriptions").click();

    // Ensure we landed on the right page
    await expect(page).toHaveURL(/.*\/subscriptions/);

    // 3. Open Modal
    await page.getByText("Add Subscription").click();

    // 4. Fill & Save
    await page.getByTestId("input-vendor-name").fill("Disney+");
    await page.getByTestId("input-cost").fill("12.99");
    await page.getByTestId("btn-save-subscription").click();

    // 5. Verify (Card List is visible on mobile)
    await expect(page.getByTestId("sub-card-disney-")).toBeVisible();
  });
});
