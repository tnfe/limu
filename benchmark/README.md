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
![](https://user-images.githubusercontent.com/7334950/257363042-522b49bc-d4b5-4491-a7af-d1e3f65769e8.png)

### 测试深层次对象读写

可通过注入`ST`值调整不同的测试策略，例如 `ST=1 node caseOnlyRead.js`，不注入时默认为 `4`

- ST=1，关闭冻结，不操作数组
- ST=2，关闭冻结，操作数组
- ST=3，启用冻结，不操作数组
- ST=4，启用冻结，操作数组

目前准备了 2 个用例，读写场景`caseReadWrite`，和只读场景`caseOnlyRead`


### 读写
测试数据如下图
![](https://user-images.githubusercontent.com/7334950/257380638-ea5e9dc4-5e44-4bc8-ac81-86083d6601bf.png)

### 只读
测试数据如下图
![](https://github.com/tnfe/limu/assets/7334950/798d0f89-186b-450e-88f8-d964c6378183)