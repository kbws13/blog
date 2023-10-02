import React from 'react'
import clsx from 'clsx'
import Translate, { translate } from '@docusaurus/Translate'

import styles from './styles.module.scss'

import WebDeveloperSvg from '@site/static/svg/undraw_web_developer.svg'
import OpenSourceSvg from '@site/static/svg/undraw_open_source.svg'
import SpiderSvg from '@site/static/svg/undraw_spider.svg'
import SectionTitle from '../SectionTitle'

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<'svg'>>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.feature.developer',
      message: 'Java 后端开发',
    }),
    Svg: WebDeveloperSvg,
    description: (
      <>
        主方向Java后端开发，熟悉Java主流技术栈
      </>
    ),
  },
  // {
  //   title: translate({
  //     id: 'homepage.feature.spider',
  //     message: '会点逆向 & 爬虫',
  //   }),
  //   Svg: SpiderSvg,
  //   description: (
  //     <>
  //       作为一名曾学习与实践逆向工程两年半的开发者，对于逆向工程有着浓厚的兴趣，同时造就了超凡的阅读代码能力。没有看不懂的代码，只有不想看的代码。
  //     </>
  //   ),
  // },
  {
    title: translate({
      id: 'homepage.feature.enthusiast',
      message: '技术爱好者',
    }),
    Svg: OpenSourceSvg,
    description: (
      <>
        作为一名技术爱好者，自学过Python，Go，TS等语言，并有过相关项目实践经验。
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col', styles.feature)}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--left padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section
      className={clsx(styles.featureContainer, 'container padding-vert--sm')}
    >
      <SectionTitle icon={'ri:map-pin-user-line'}>
        <Translate id="homepage.feature.title">个人特点</Translate>
      </SectionTitle>
      <div className={clsx('row', styles.features)}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  )
}
