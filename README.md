# 保研经验帖

保研（推免）经验与资料的整理汇编，使用 VitePress 构建并发布到 GitHub Pages。

## 站点与本地开发

- **站点线上地址**：[https://yuhang234.github.io/baoyan-handbook/](https://yuhang234.github.io/baoyan-handbook/)
- **安装依赖**：
  ```bash
  npm ci
  ```
- **本地开发**：
  ```bash
  npm run docs:dev
  ```
- **构建生产静态文件**：
  ```bash
  npm run docs:build
  ```
- **本地预览构建产物**：
  ```bash
  npm run docs:preview
  ```
- **发布部署**：
  代码推送到 `main` 分支后，GitHub Actions 自动触发 `.github/workflows/deploy.yml` 工作流，构建 VitePress 站点并发布到 GitHub Pages。亦支持在 GitHub Actions 页面手动触发 `workflow_dispatch` 部署。
