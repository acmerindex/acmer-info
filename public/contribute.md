# 欢迎贡献

感谢你对 **ACMer.info** 感兴趣！我们非常欢迎社区成员通过以下方法来完善这个导航站。

## 宣传贡献

虽然在 ACMer Index Team 成员的不懈努力之下，本站已经被广大 ACMer 认可为一个综合的信息获取源，但仍有相当一部分 ACMer 因为不了解本站而会错过一些学习资料和总结好的信息。在此呼吁本站的用户在每年招新时将本站推荐给新入队的成员，以促进新成员快速成长。同时，在本站更新到 v3 以后，我们加回了比赛界面，并且增加了 “校赛” 的分类，配合 Hydro / RankLand 方便的托管榜单服务，你也可以将自校校赛放在本站进行展示。您的每次推荐，都可以帮助我们更好的服务更多选手。 —— qwedc001

## 内容贡献

### Github Actions

#### 提交流程

1) 打开仓库 Issue，选择对应的模板：

- 添加博客
- 添加比赛
- 添加群聊
- 添加资料

2) 按表单填写：

- 所有链接请使用完整的 `https://` 前缀。
- `title`、`labels` 已预设，请勿修改。
- 系统会自动指派 reviewer `qwedc001`。

3) 提交后等待审核与合并。若长时间未处理，可在 Issue 中 @ 维护者。

### Pull Request

内容贡献只需要修改 data 目录下的对应 json 即可。提交 Pull Request 后，ACMer Index Team 的成员会尽快审核。由于大家均为抽出业余时间维护站点，所以有时审核时间可能较长。如果长时间没有收到回复，也可以尝试在 Pull Request 里 at 成员。

不同 json 对应含义如下（带有问号的义项为选填项）：

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

### QQ Bot

正在施工

## 新增板块

请先开启 issue 进行讨论。

此处给出一个当前单个功能架构的参考：

- (module)/page.tsx: 页面组件，负责从 data 中获取数据传递给 view 以及定义页面 metadata。
- (module)/(module)-view.tsx: 负责页面视图状态管理和数据处理。
  - 对于卡片类，一般使用 ui/components/card.tsx 进行展示即可，无需特殊设计样式。如果有设计样式的必要，请参考下方的 table UI 组件设计。
- （对于表格类的） (module)/(module)-table.tsx: UI 组件，定义表头。
- （对于表格类的） (module)/(module)-row.tsx: UI 组件，根据传入数据具体处理表格展示内容。
