import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: '默认不冻结，在大对象小修改场景比immer快10倍或更多',
    color: '#f04231',
    imageUrl: 'https://user-images.githubusercontent.com/7334950/253807518-dee752ee-7f94-43fc-8186-3a5725bfc755.png',
    description: <div style={{ textAlign: 'left' }}>immer的冻结行为造成了大量性能损耗，且此配置关闭后性能仅有少许提升，limu采用读时浅复制写时标记修改的策略压榨出了更强劲的性能</div>,
  },
  {
    title: '更强的隐藏式代理机制，让用户像查看原生数据一样查看草稿数据任意节点',
    color: '#46ab5d',
    imageUrl: 'https://user-images.githubusercontent.com/7334950/253807641-03fe646e-41e3-4cb7-bf23-f37deabaf43f.png',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <div style={{ textAlign: 'left' }}>因层层代理导致调试模式下查看immer的草稿数据像进入黑盒世界，还需借助昂贵的current接口导出草稿的副本才能查看草稿数据全貌</div>,
  },
  {
    title: '默认支持Map、Set，兼容immer大部分接口，gzip后4.3kb',
    color: '#3f85c2',
    imageUrl: 'https://user-images.githubusercontent.com/7334950/253807413-88c1eb5f-fece-4c08-9a1c-039aa9f23890.png',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: <div style={{ textAlign: 'left' }}>limu设计为面向现代浏览器的不可变数据js库，只运行于支持proxy特性的js环境，相比immer 6.3kb大小容量接近减少1/3</div>,
  },
];

function Feature({ Svg, imageUrl, title, description, color = '#ad4e00' }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {imageUrl ? (
          <img src={imageUrl} width="180px" style={{ marginBottom: '12px' }}></img>
        ) : (
          <Svg className={styles.featureSvg} role="img" />
        )}
        {/* <Svg className={styles.featureSvg} role="img" /> */}
      </div>
      <div className="text--center padding-horiz--md">
        <h3 style={{ color }}>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
