# 欢迎贡献

感谢你对 **ACMer.info** 感兴趣！我们非常欢迎社区成员通过以下方法来完善这个导航站。

## 内容贡献

### Pull Request

内容贡献只需要修改 data 目录下的对应 json 即可。提交 Pull Request 后，ACMer Index Team 的成员会尽快审核。由于大家均为抽出业余时间维护站点，所以有时审核时间可能较长。如果长时间没有收到回复，也可以尝试在 Pull Request 里 at 成员。

不同 json 对应含义如下（带有问号的义项为选填项）：

- announcements.json ：首页公告。此 json 只允许 ACMer Index Team 成员修改。
- blogs.json： 选手博客。
  ```typescript
  interface Blog {
    name: string; // 博客名称
    url: string; // 博客 URL
    owner: string; // 博主
    school?: string; // 学校缩写
    tags?: string[]; // 博客 tag
    notes?: string; // 博客简介
  }
  ```
- friends.json： 友情链接
  ```typescript
  interface Friend {
    name: string; // 友链名称
    url: string; // 友链 URL
    desc?: string; // 网站简介
    avatar?: string; // 如果手动填写了则优先使用，否则尝试自动获取网站 favicon
    maintainer?: string; // 站长
  }
  ```
- groups.json： 群组信息，请注意同时修改 recent 条目将你的群添加到 最近更新里，并删除最后一条最近更新。
- ```typescript
  interface Group {
      name: string; // 群聊名称
      groupid: int; // 群号
      owner?: string; // 群主
      notes?: string; // 长描述
      comments?: string; // 短备注
  }
  ```
- maintainers.json： 站点维护者信息，此 json 只允许 ACMer Index Team 成员修改。
- materials.json： 资料信息
  ```typescript
  interface Material {
      name: string; // 资料名称
      url: string; // 资料链接
      maintainer?: string; // 资料维护者
      desc?: string; // 长描述
      note?: string; // 短备注
  }
  ```

### Github Actions

迁站中，正在施工

### QQ Bot

正在施工

## 新增板块

请先开启 issue 进行讨论。
