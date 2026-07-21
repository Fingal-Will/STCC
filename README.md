# 天行队聊天总结

此目录是一套可直接作为独立仓库根目录发布的 GitHub Pages 静态站点。

## 目录

```text
.
├── .nojekyll
├── .gitignore
├── 404.html
├── index.html
├── README.md
└── summaries/
    └── <时间段>/
        └── index.html
```

- `index.html`：聊天总结首页、全群统计、搜索筛选与分页。
- `summaries/<时间段>/index.html`：单期聊天总结。
- `404.html`：站内无效地址的返回页。
- `.nojekyll`：让 GitHub Pages 原样发布静态文件。
- `.gitignore`：排除 macOS 目录元数据。

发布目录不包含聊天原文、统计源数据、分析结果或实验页面。相关工作文件保存在主项目的 `work/tianxing/`，不要上传到公开站点。

## GitHub Pages 发布

1. 将此目录中的全部文件作为 GitHub 仓库根目录提交。
2. 在仓库 `Settings > Pages` 中选择 `Deploy from a branch`。
3. 选择发布分支和 `/(root)` 目录。
4. 保存后等待 GitHub Pages 完成部署。

页面链接均使用相对路径，可同时兼容项目子路径和自定义域名。
