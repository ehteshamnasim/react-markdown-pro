import { expect, test } from "@playwright/test";

test("the demo presents multiline code, navigation, safe HTML, and a favicon", async ({ page, request }) => {
  await page.goto("/demo.html");

  await expect(page.locator(".hero-panel pre")).toContainText('import MarkdownPro from "react-markdown-pro";');
  await expect(page.locator(".hero-panel pre")).toContainText("export function Article()");
  await expect(page.getByRole("navigation", { name: "Demo sections" }).getByRole("link")).toHaveCount(9);
  await expect(page.locator("#security script")).toHaveCount(0);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", "./favicon.svg");

  const favicon = await request.get("/favicon.svg");
  expect(favicon.ok()).toBeTruthy();
});

test("the code example copies and the menu adapts on narrow screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo.html#code");

  await expect(page.locator(".layout > aside")).toHaveCSS("position", "static");
  await page.getByRole("button", { name: "Copy tsx code" }).click();
  await expect(page.getByRole("status")).toContainText("Copied tsx:");
});
