import { test, expect } from "@playwright/test";

test.describe("Subscription Management", () => {
  test.setTimeout(90000); 
  test.use({ viewport: { width: 1280, height: 800 } });

  async function createAndLoginUser(page) {
    const timestamp = Date.now();
    const user = { email: `sub-${timestamp}@example.com`, pass: "Password123!" };

    await page.goto("/auth/signup");
    await page.getByLabel(/Full Name/i).fill("Sub Tester");
    await page.getByLabel(/Email/i).fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.pass);
    await page.getByLabel(/Confirm Password/i).fill(user.pass);
    await page.getByRole("button", { name: "Create Account", exact: true }).click();

    await page.waitForURL("**/auth/login");
    await page.getByLabel(/Email/i).fill(user.email);
    await page.getByLabel(/Password/i).fill(user.pass);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/dashboard");
    
    try {
      if (await page.getByRole("dialog").isVisible({ timeout: 2000 })) {
          await page.keyboard.press('Escape');
      }
    } catch (e) {}
  }

  test("should add, archive, and then permanently delete a subscription", async ({ page }) => {
    await createAndLoginUser(page);

    await page.goto("/subscriptions");
    
    // --- STEP A: ADD ---
    console.log("Adding Subscription...");
    await page.getByRole("button", { name: /Add Subscription/i }).first().click();
    await page.getByTestId("input-vendor-name").fill("Spotify");
    await page.getByRole("combobox", { name: /Category/i }).click();
    await page.getByRole("option").first().click();
    await page.getByTestId("input-cost").click();
    await page.getByTestId("input-cost").fill("9.99");
    
    const dateBtn = page.getByRole("button", { name: /Pick date/i });
    if (await dateBtn.isVisible()) {
        await dateBtn.click();
        await page.locator('.rdp-day').first().click(); 
    }

    await page.getByTestId("btn-save-subscription").click();
    await expect(page.getByText("Spotify").first()).toBeVisible({ timeout: 10000 });
    
    // Ensure toasts are gone
    await expect(page.locator(".toast, li[data-sonner-toast]")).toHaveCount(0, { timeout: 20000 });

    // --- STEP B: ARCHIVE ---
    console.log("Navigating to Details...");
    await page.getByRole("cell", { name: "Spotify" }).first().click();
    await expect(page.getByText("Back to Subscriptions")).toBeVisible({ timeout: 10000 });

    console.log("Archiving...");
    const archiveBtn = page.locator("button").filter({ has: page.locator("svg.lucide-archive") }).first();
    await archiveBtn.click();

    await page.waitForURL("**/subscriptions");
    await expect(page.getByText("Spotify")).toHaveCount(0, { timeout: 10000 });

    // --- STEP C: DELETE FOREVER ---
    console.log("Navigating to Archive Page...");
    await page.goto("/archive");
    await expect(page.getByText("Spotify").first()).toBeVisible({ timeout: 15000 });

    console.log("Deleting Permanently...");
    // Find the row
    const archiveRow = page.locator("tr").filter({ has: page.getByText("Spotify") }).first();
    
    // 1. Hover first to trigger any group-hover states
    await archiveRow.hover();
    
    // 2. Target the MoreHorizontal button specifically
    const menuTrigger = archiveRow.locator('button').filter({ has: page.locator('svg') });
    
    // 3. Click it normally (Playwright handles scrolling and waiting)
    await menuTrigger.click();

    // 4. Look for the menu item
    // Your code uses "Delete Forever"
    const deleteOption = page.getByRole("menuitem", { name: /Delete Forever/i });
    
    // If the standard click didn't work, we try one more time with a force click
    if (!(await deleteOption.isVisible())) {
        await menuTrigger.click({ force: true });
    }

    await expect(deleteOption).toBeVisible({ timeout: 5000 });
    await deleteOption.click();

    // 5. Final check
    console.log("   - Waiting for deletion to reflect in UI...");
    await expect(page.getByText("Spotify")).toHaveCount(0, { timeout: 15000 });
    
    console.log("✅ Test Completed successfully!");
  });
});