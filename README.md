# acmer-info

## 通过 Pull Requests 贡献页面内容

1. 进入 data 文件夹，找到对应的页面数据 ( xx.json 文件)。
2. 按照已有的格式，在文件里添加内容，保存并发起 Pull Request。
3. 等待 merge。

- 请注意，在编写 Pull Requests 时请遵循 JSON 语法，并且严格按照源文件关键字的格式进行添加。

## 通过 Issues 贡献页面内容

如果是增加群组请求，请按照 issue template 正确填写信息（如果群聊为邀请制，可不填写群号，在备注中填写联系人即可）。**现在 Github 会自动拉起一个对应的 Pull Request。**

否则可以发起空白 issue 并描述你想要添加的内容。

## 开发

CI 使用的 Node 版本为22, NPM 作为包管理器

本地开发推荐建议使用 bun 作为包管理器

```bash
git clone https://github.com/acmerindex/acmer-info.git
bun install
bun run dev
```
