# GitHub Public Worktree

这个工作树只放准备同步到 GitHub 的公开内容。

## 目录约定

- `gh-pages-site/`: GitHub Pages 或静态站点的上传目录
- 未来公开的 `README`、文档、可开源代码，都放在这个工作树中
- 完整本地开发内容继续留在 `../local/`

## 分支约定

- 当前工作树分支: `github`
- 目标远端主线: `origin/main`

注意: 截至 2026-03-31，本仓库远端还只有 `origin/gh-pages`，还没有 `origin/main`。本地结构已经按 `github -> origin/main` 的语义整理好，后续首次公开推送时再把远端主线切过去。
