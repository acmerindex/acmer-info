# Issue-based data updates

This repo now exposes issue forms for blog / contest / group / material contributions. The helper script `scripts/apply-issue-update.js` turns an issue body into changes in the `data/*.json` files.

## How the script works
- Detects type via labels (`data:blog`, `data:contest`, `data:group`, `data:material`) or title prefix `[blog]`, `[contest]`, `[group]`, `[material]`.
- Parses the issue body by heading (`### Heading`) and slugifies to keys (Chinese labels are supported via Unicode slugging).
- Upserts into the matching JSON file. Contests are sorted by `startTime` (desc).
- Groups: besides adding to the chosen category, it refreshes `recent` by keeping existing pinned rows and the newest three non-pinned entries (new submission is prepended). When 置顶为 "是"，the entry is added to the pinned block and removed from the non-pinned block.

## Local usage
```
node scripts/apply-issue-update.js --body ./issue.md --type group
```
`--type` accepts `blog`, `contest`, `group`, `material`.

## GitHub Actions example
```yaml
name: Apply data from issues
on:
  issues:
    types: [opened, edited]
permissions:
  contents: write
  issues: write
jobs:
  apply:
    if: github.event.action == 'opened' || github.event.action == 'edited'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.repository.default_branch }}
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Apply JSON update
        run: node scripts/apply-issue-update.js
      - name: Commit changes
        run: |
          git config user.name "github-actions"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add data
          git commit -m "chore: sync data from #${{ github.event.issue.number }}" || echo "no changes"
      - name: Push
        if: success()
        run: git push
```

## Notes
- Start time must be ISO 8601 (e.g. `2025-11-21T09:00:00+08:00`), duration is in seconds.
- Group IDs are stored as provided (string or number). Duplicates are matched by name (case-insensitive) or non-empty group ID.
- Materials accept categories `learning`, `tools`, `oj`.
- Groups accept categories `赛事/算法/企业/个人/游戏/找工/技术/行业/同城/玩乐/NSFW/其他` (automatically mapped to internal keys).
