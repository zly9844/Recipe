# 私房菜谱 Web App

一个手机端优先的个人菜谱网页应用。

## 已实现功能

- 中文移动端菜谱主页、详情页、创建/编辑页
- 用户注册、登录、退出登录
- 每个用户拥有独立的菜谱数据
- 点餐式主界面：按凉菜、荤菜、蔬菜、汤品、主食选择菜品
- 已选菜品自动汇总成买菜清单
- 发现灵感：从公共菜谱池一键复制别人上传过的菜谱到自己的菜单
- 菜谱成品图上传
- 每个制作步骤单独上传照片
- 图片上传到服务端文件目录，菜谱数据只保存图片 URL
- 食材勾选与制作进度
- 收藏、搜索、按食材筛选
- 当前用户后台管理：统计、搜索、查看、编辑、删除菜谱
- Node.js 后端 API
- SQLite 数据库存储

## 本地运行

需要 Node.js 24 或更高版本。

```bash
npm start
```

打开：

```text
http://127.0.0.1:5173/
```

示例账号：

```text
邮箱：demo@example.com
密码：123456
```

## 数据与图片存储

默认数据目录：

```text
recipe-mobile-web/data
```

其中：

- `app.db` 保存用户、菜谱、食材、步骤等结构化数据
- `uploads/` 保存用户上传的图片

旧版本的 `recipes.json`、`users.json` 如果存在，会在首次启动 SQLite 版本时自动导入到 `app.db`。

线上部署时建议把 `DATA_DIR` 指向持久化磁盘，例如：

```bash
DATA_DIR=/var/lib/culinary-journal npm start
```

如果使用 Docker：

```bash
docker build -t culinary-journal .
docker run -p 5173:5173 -v culinary-data:/app/data culinary-journal
```

## SQLite

当前版本使用 Node 24 内置的 `node:sqlite`，不需要额外安装数据库依赖。

核心表：

```text
users
recipes
ingredients
steps
```

## API

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/recipes
POST   /api/recipes
PUT    /api/recipes/:id
DELETE /api/recipes/:id

POST   /api/uploads
GET    /uploads/:userId/:filename
```

菜谱、上传接口都需要登录 token。

## 上线建议

当前版本已经把 JSON 数据文件替换为 SQLite，并把图片从菜谱数据中拆出。正式生产环境建议进一步升级：

- 定时备份 `DATA_DIR`
- 图片存储迁移到阿里云 OSS、腾讯云 COS、七牛云、S3 或 Cloudflare R2
- HTTPS 和域名
- 登录限流、邮箱验证、找回密码
- 管理员角色和全站后台
- 日志、监控和错误告警
- 用户量明显增长后，再从 SQLite 迁移到 PostgreSQL

## Render 部署

项目已包含 `render.yaml`，适合通过 Render Blueprint 部署。

推荐流程：

1. 将 `recipe-mobile-web` 目录作为独立 GitHub 仓库推送。
2. Render 控制台选择 `New +` -> `Blueprint`。
3. 连接该 GitHub 仓库。
4. Render 会读取 `render.yaml` 并创建免费 Web Service。

当前配置：

```text
Runtime: Node
Node: 24.14.1
Region: Singapore
Plan: Free
DATA_DIR: /tmp/culinary-journal
Health Check: /api/health
```

注意：免费模式没有持久化磁盘，SQLite 数据和上传图片在服务重启或重新部署后可能丢失。正式使用请改回 Starter plan 并挂载 Persistent Disk。
