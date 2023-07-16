import * as limu from 'limu';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import MdViewer from '@site/src/components/MdViewer';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './index.module.css';
// import MdViewer from '@site/src/components/MonacoEditor';
import * as demoCode from '@site/src/components/demoCode';

globalThis.limu = limu;

// prism-react-renderer
// @uiw/react-markdown-preview

// 关闭语法验证，避免code示例里写 @ts-nocheck
// see https://github.com/microsoft/monaco-editor/issues/264
// monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//   noSemanticValidation: true,
//   noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
// });

function RadioBtn(props) {
  return (
    <label>
      <input checked={props.checked} name="demo" type="radio" value={props.value} onClick={props.onClick} />
      {props.children}
    </label>
  );
}

function DemoArea() {
  const [demoType, setDemoType] = React.useState('produce');
  const clickRadio = (e) => {
    setDemoType(e.target.value);
  };
  const checkedMap = {};
  ['produce', 'createDraft', 'onOperate'].forEach((item) => {
    checkedMap[item] = item === demoType;
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '780px', margin: '0 auto' }}>
        <RadioBtn checked={checkedMap['produce']} value="produce" onClick={clickRadio}>
          produce{'  '}
        </RadioBtn>
        <RadioBtn checked={checkedMap['createDraft']} value="createDraft" onClick={clickRadio}>
          createDraft/finishDraft{'  '}
        </RadioBtn>
        <RadioBtn checked={checkedMap['onOperate']} value="onOperate" onClick={clickRadio}>
          onOperate{'  '}
        </RadioBtn>
      </div>
      <MdViewer value={demoCode[demoType]} />
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header
      className={clsx('hero hero--primary', styles.heroBanner)}
      style={{ height: '400px' }}
    >
      <div className="container">
        <h1 className="hero__title" style={{ fontSize: '88px', fontWeight: 600 }}>
          {siteConfig.title}
        </h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/api/basic">
            快速开始 - 1 min ⏱️
          </Link>
          <div style={{ display: 'inline-block', width: '28px' }}></div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="A development solution of frontend dynamic micro component">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <DemoArea />
      </main>
      <span style={{ display: 'none' }}>for index cache expried at 2023-05-31</span>
    </Layout>
  );
}
