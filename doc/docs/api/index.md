---
sidebar_position: 0
---

# why limu

:::tip

😄 略以下阅读，跳转至👉🏼 ** [常用api](/docs/api/basic) **

:::

### 更快

`limu`让你像操作原生 js 对象一样操作不可变对象，提供一个回调函数让用户任意修改数据的副本，并以结构共享的方式，让引用变动只发生在产生数据变化的节点的途经路径上。

### 优化复制策略

区别于`immer`的写时复制机制，`limu`采用**读时浅克隆写时标记修改**机制，具体操作流程我们将以下图为例来讲解，使用`produce`接口生成草稿数据后，，`limu`只会用户读取草稿数据层的路径上完成相关节点的浅克隆

![shallow copy on read](/img/home/limu-1.png)

修改了目标节点下的值的时候，则会回溯该节点到跟节点的所有途径节点并标记这些节点为已修改 ![shallow copy on read](/img/home/limu-2.png)

最后结束草稿生成`final`对象时，`limu`只需要从根节点把所有标记修改的节点的副本替换到对应位置即可，没有标记修改的节点则不使用副本（注：生成副本不代表已被修改）

这样的机制在对象的原始层级关系较为复杂且修改路径不广的场景下，且不需要冻结原始对象时，性能表现异常优异，可达到比 immer 快 5 倍或更多，只有在修改数据逐渐遍及整个对象所有节点时，`limu`的性能才会呈线性下载趋势，逐步接近`immer`，但也要比`immer`快很多。

### 性能测试

为了验证上述结论，用户可按照以下流程获得针对`limu`与`immer`性能测试对比数据

```bash
git clone https://github.com/tnfe/limu
cd limu
npm i
cd benchmark
npm i
node opBigData.js // 触发测试执行，控制台回显结果
# or
node caseReadWrite.js
```

我们准备两个用例，一个改编自immer官方的性能测试[案例](https://github.com/immerjs/immer/blob/main/__performance_tests__/add-data.mjs)

执行 `node opBigData.js` 得到如下结果
![](https://user-images.githubusercontent.com/7334950/257369962-c0577e96-cb2c-48cb-8f65-c11979bfd506.png)

一个是我们自己准备的深层次json读写案例，结果如下

![test 2](https://user-images.githubusercontent.com/7334950/257380995-1bfc3652-1730-4ecd-ba1b-adaddd3db98d.png)

:::tip

可通过注入`ST`值调整不同的测试策略，例如 `ST=1 node caseReadWrite.js`，不注入时默认为 `1`

- ST=1，关闭冻结，不操作数组
- ST=2，关闭冻结，操作数组
- ST=3，开启冻结，不操作数组
- ST=4，开启冻结，操作数组

:::