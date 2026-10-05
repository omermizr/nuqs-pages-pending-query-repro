const { test, expect } = require('@playwright/test')

for (const navigate of [false, true]) {
  test(navigate ? 'a following navigation preserves the flushed count' : 'an empty update reads the latest flushed query', async ({ page }) => {
    await page.goto('/widgets/red?count=1')
    await expect(page.getByTestId('count')).toHaveText('1')
    await page.getByRole('button', {
      name: navigate ? 'Update and navigate' : 'Update and read snapshot'
    }).click()
    await expect(page.getByTestId('report')).not.toHaveText('null')
    const report = JSON.parse(await page.getByTestId('report').textContent())
    if (navigate) await expect(page).toHaveURL(/\/widgets\/blue\?/)
    console.log(JSON.stringify({ navigate, ...report, pathname: new URL(page.url()).pathname, finalSearch: new URL(page.url()).search }))
    expect(report.first).toBe('2')
    expect(report.second).toBe('2')
    if (navigate) expect(new URL(page.url()).searchParams.get('count')).toBe('2')
  })
}
