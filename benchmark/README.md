## 测试流程

## 测试流程
准备工作
```bash
git clone https://github.com/tnfe/limu
cd limu
npm i
cd benchmark
npm i
```
然后参考以下步骤执行测试

### 测试大数组读写
遍历一个大数组执行读写逻辑，此用来改编自[immer性能测试用例](https://github.com/immerjs/immer/blob/main/__performance_tests__/add-data.mjs)
```bash
node opBigData.js
```

测试结果（机器配置 MacBook Pro 2021 M1）
```txt
 assign big list to base
immer (proxy) - without autofreeze * 100: 1274ms
limu (proxy) - without autofreeze * 100: 170ms
immer (proxy) - with autofreeze * 100: 944ms
limu (proxy) - with autofreeze * 100: 412ms

 assign big list to draft
immer (proxy) - without autofreeze * 100: 30ms
limu (proxy) - without autofreeze * 100: 58ms
immer (proxy) - with autofreeze * 100: 350ms
limu (proxy) - with autofreeze * 100: 198ms
```

### 测试深层次对象读写

可通过注入`ST`值调整不同的测试策略，例如 `ST=1 node caseOnlyRead.js`，不注入时默认为 `4`

- ST=1，表示复用 base，启动冻结
- ST=2，表示不复用 base，启动冻结
- ST=3，表示复用 base，关闭冻结
- ST=4，表示不复用 base，关闭冻结

目前准备了 2 个用例，只读场景`caseOnlyRead`，和读写场景`caseReadWrite`

> native 表示操作原始对象，pstr 包是使用 `JSON.parse(JSON.string(obj))` 做深克隆后操作

### 只读

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

### 读写

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
