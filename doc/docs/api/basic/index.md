---
sidebar_position: 0
---

# basic

### 更快

`limu`让你像操作原生 js 对象一样操作不可变对象，提供一个回调函数让用户任意修改数据的副本，并以结构共享的方式，让引用变动只发生在产生数据变化的节点的途径路径上。

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
node caseOnlyRead.js // 触发测试执行，控制台回显结果
```

可通过注入`ST`值调整不同的测试策略，例如 `ST=1 node caseOnlyRead.js`，不注入时默认为 `4`

- ST=1，表示复用 base，启动冻结
- ST=2，表示不复用 base，启动冻结
- ST=3，表示复用 base，关闭冻结
- ST=4，表示不复用 base，关闭冻结

我们准备了 2 个用例，只读场景`caseOnlyRead`，和读写场景`caseReadWrite`，依次执行以下 8 组命令

```bash
ST=1 node caseOnlyRead.js // 复用base，启动冻结，只读草稿
ST=2 node caseOnlyRead.js // 不复用base，启动冻结，只读草稿
ST=3 node caseOnlyRead.js // 复用base，关闭冻结，只读草稿
ST=4 node caseOnlyRead.js // 不复用base，关闭冻结，只读草稿

ST=1 node caseReadWrite.js // 复用base，启动冻结，读写草稿
ST=2 node caseReadWrite.js // 复用base，启动冻结，读写草稿
ST=3 node caseReadWrite.js // 复用base，启动冻结，读写草稿
ST=4 node caseReadWrite.js // 复用base，启动冻结，读写草稿
```

测试结果如下

#### 只读

1 `ST=1 node caseOnlyRead.js`

```
loop: 200, immer avg spend 14.6 ms
loop: 200, limu avg spend 12.68 ms
loop: 200, pstr avg spend 4 ms
loop: 200, native avg spend 0.37 ms
```

2 `ST=2 node caseOnlyRead.js`

```
loop: 200, immer avg spend 16.63 ms
loop: 200, limu avg spend 15.02 ms
loop: 200, pstr avg spend 5.89 ms
loop: 200, native avg spend 1.345 ms
```

3 `ST=3 node caseOnlyRead.js`

```
loop: 200, immer avg spend 13.525 ms
loop: 200, limu avg spend 11.54 ms
loop: 200, pstr avg spend 3.79 ms
loop: 200, native avg spend 0.505 ms
```

4 `ST=4 node caseOnlyRead.js`

```
loop: 200, immer avg spend 12.965 ms
loop: 200, limu avg spend 11.2 ms
loop: 200, pstr avg spend 4.045 ms
loop: 200, native avg spend 1.065 ms
```

#### 读写

1 `ST=1 node caseReadWrite.js`

```
loop: 200, immer avg spend 4.045 ms
loop: 200, limu avg spend 4.47 ms
loop: 200, pstr avg spend 8.835 ms
loop: 200, native avg spend 0.225 ms
```

2 `ST=2 node caseReadWrite.js`

```
loop: 200, immer avg spend 8.44 ms
loop: 200, limu avg spend 5.855 ms
loop: 200, pstr avg spend 10.18 ms
loop: 200, native avg spend 0.895 ms
```

3 `ST=3 node caseReadWrite.js`

```
loop: 200, immer avg spend 10.025 ms
loop: 200, limu avg spend 0.89 ms
loop: 200, pstr avg spend 8.155 ms
loop: 200, native avg spend 0.155 ms
```

4 `ST=4 node caseReadWrite.js`

```
loop: 200, immer avg spend 11.025 ms
loop: 200, limu avg spend 1.61 ms
loop: 200, pstr avg spend 9.225 ms
loop: 200, native avg spend 0.915 ms
```
