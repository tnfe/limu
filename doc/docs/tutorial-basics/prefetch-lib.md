---
sidebar_position: 1
---

# preFetchLib

`preFetchLib`负责拉取并返回远程模块，远程模块通过对接 `hel-lib-proxy` 包的 [exposeLib](https://www.to-be-added.com/coming-soon) 接口弹射出去。

:::tip 面向模块使用方

该接口由模块使用方直接调用，可以基于此接口进一步封装到其他依赖注入框架或体系里

:::

## 基本用法

### 指定模块名

通过指定模块名称拉取模块，默认总是拉取最新版本，如当前用户在灰度名单里，则返回灰度版本

```ts
const lib = await preFetchLib('hel-tpl-remote-lib');
// lib.xxx 此处可以调用模块任意方法
```

### 指定版本号

**参数名称**：`IPreFetchLibOptions.versionId`

通过指定模块名称、版本号拉取模块

```ts
const lib = await preFetchLib('hel-tpl-remote-lib', { versionId: '1.0.0' });
// or
const lib = await preFetchLib('hel-tpl-remote-lib', '1.0.0');
```

:::tip 未指定版本号情况

未指定特殊的版本号情况下，`preFetchLib` 将拉取最新的版本

:::

### 指定平台值

**参数名称**：`IPreFetchLibOptions.platform`

通过指定模块名称、版本号、平台拉取模块，默认是`unpkg`, 当用户独立部署了`Hel Pack`服务并需要跨多个平台获取模块时，需指定平台值

```ts
const lib = await preFetchLib('hel-tpl-remote-lib', {
  versionId: 'hel-tpl-remote-lib_20220522003658',
  platform: 'hel',
});
```

| <div style={{width:'150px'}}>属性</div> | <div style={{width:'150px'}}>类型</div> | <div style={{width:'200px'}}>默认值</div> | <div style={{width:'355px'}}>描述</div> |
| --- | --- | --- | --- |
| platform | string | 'unpkg' | 指定获取模块元数据的平台 |
| versionId | string | undefined | 指定拉取的版本号, 对于 unpkg 服务来说，版本号级 package.json 里的 version 值<br />未指定版本的话，总是拉取最新版本模块元数据，如当前用户在灰度名单里，则拉取灰度版本模块元数据 |
| appendCss | boolean | true | 是否追加模块样式链接到 html 文档里 |
| cssAppendTypes | CssAppendType[] | ['static', 'build', 'relative'] | 该配置项在 appendCss 为 true 时有效，表示按要附加哪几种类型的 css 链接到 html 文档上<br />'static' 表示静态 css 链接文件<br/>'build' 表示每次构建新生成的 css 文件 |
| apiMode | 'get' \| 'jsonp' | 'jsonp' | api 请求方式 |
| enableDiskCache | boolean | false | 是否开启硬盘缓存 |

文档正在拼命建设中，有疑问可联系 [fantasticsoul](https://github.com/fantasticsoul) 或提 [issue](https://github.com/tnfe/hel/issues)，关注我的[掘金主页](https://juejin.cn/user/1732486056649880/posts)了解更多 ...
