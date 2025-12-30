import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('User can signup, login, and add a subscription', async ({ page }) => {
  // 1. Setup Unique User Data
  const timestamp = Date.now();
  const user = {
    name: 'E2E Test User',
    email: `test-${timestamp}@example.com`,
    password: 'password123'
  };

  // --- STEP 1: SIGN UP ---
  await page.goto('/auth/signup');
  
  await page.fill('input[name="name"]', user.name);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.fill('input[name="confirmPassword"]', user.password);
  
  await page.click('button[type="submit"]');

  // Handle Cold Start / Redirect
  try {
    await expect(page).toHaveURL('/auth/login', { timeout: 30000 });
  } catch (error) {
    const errorMessage = await page.getByRole('alert').textContent().catch(() => null);
    if (errorMessage) throw new Error(`Signup failed: "${errorMessage}"`);
    throw error;
  }

  // --- STEP 2: LOGIN ---
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard', { timeout: 30000 });

  // --- STEP 2.5: COMPLETE ONBOARDING ---
  const onboardingHeading = page.getByRole('heading', { name: 'Welcome to SubTrack', exact: true });

  if (await onboardingHeading.isVisible({ timeout: 5000 })) {
      await page.click('button:has-text("Next")');
      await page.click('button:has-text("Next")');
      await page.click('button:has-text("Get Started")');
      await expect(onboardingHeading).toBeHidden({ timeout: 10000 });
  }

  // --- STEP 3: ADD SUBSCRIPTION ---
  await page.click('text=Add Subscription');
  await expect(page.getByRole('dialog')).toBeVisible();

  await page.fill('input[name="vendorName"]', 'Spotify Premium');
  await page.fill('input[name="cost"]', '12.99'); 

  // Select Category
  await page.getByRole('combobox', { name: 'Category' }).click();
  await page.click('div[role="option"]:has-text("Entertainment")');

  await page.click('button[type="submit"]');

  // --- STEP 4: VERIFY ---
  await expect(page.getByRole('dialog')).toBeHidden();

  // 👇 FIX: Update regex to require "/mo". 
  // This ensures we match the Subscription Card (which shows frequency) 
  // and NOT the Upcoming Bill (which shows the due date).
  await expect(page.getByRole('link', { name: /Spotify Premium.*12.99.*\/mo/i })).toBeVisible({ timeout: 20000 });
});