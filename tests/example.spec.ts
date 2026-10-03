import { expect, test } from "@playwright/test";

test.describe("Task App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("タスクを追加できる", async ({ page }) => {
    await page.getByLabel("タスク名").fill("牛乳を買う");
    await page.getByRole("button", { name: "追加" }).click();

    await expect(page.getByText("牛乳を買う")).toBeVisible();
    await expect(page.getByText("未完了: 1")).toBeVisible();
  });

  test("タスクを完了にできる", async ({ page }) => {
    await page.getByLabel("タスク名").fill("牛乳を買う");
    await page.getByRole("button", { name: "追加" }).click();

    const checkbox = page.getByRole("checkbox", {
      name: "牛乳を買うを完了にする",
    });

    await checkbox.check();

    await expect(checkbox).toBeChecked();
    await expect(page.getByText("未完了: 0")).toBeVisible();
  });

  test("タスクを削除できる", async ({ page }) => {
    await page.getByLabel("タスク名").fill("牛乳を買う");
    await page.getByRole("button", { name: "追加" }).click();

    await page.getByRole("button", { name: "牛乳を買うを削除" }).click();

    await expect(page.getByText("牛乳を買う")).not.toBeVisible();
    await expect(page.getByText("タスクはありません")).toBeVisible();
  });

  test("タスクがページを再読み込みしても残る", async ({ page }) => {
    await page.getByLabel("タスク名").fill("牛乳を買う");
    await page.getByRole("button", { name: "追加" }).click();

    await expect(page.getByText("牛乳を買う")).toBeVisible();

    await page.reload();

    await expect(page.getByText("牛乳を買う")).toBeVisible();
    await expect(page.getByText("未完了: 1")).toBeVisible();
  });
});
