import React from 'react'
import { Variants, motion, useScroll, useTransform } from 'framer-motion' // Import motion from framer-motion

import Translate from '@docusaurus/Translate'

import HeroMain from './img/hero_main.svg'

import styles from './styles.module.scss'
import SocialLinks from '@site/src/components/SocialLinks'

import { Icon, IconProps } from '@iconify/react'

const variants: Variants = {
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0, y: 30 },
}

function Logos() {
  const { scrollYProgress } = useScroll()

  // 往下滚动 元素向上移动
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-500%'], {
    clamp: false,
  })

  // 往下滚动 元素向下移动
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '500%'], {
    clamp: false,
  })

  const logos: IconProps[] = [
    {
      icon: 'logos:vue',
      style: { left: '1%', top: '1%' },
    },
    {
      icon: 'logos:mysql',
      style: { left: '4%', top: '5%' },
    },

    {
      icon: 'logos:nginx',
      style: { right: '2%', top: '11%' },
    },
    {
      icon: 'logos:redis',
      style: { right: '8%', top: '14%' },
    },

    {
      icon: 'logos:spring',
      style: { top: '5%', left: '52%' },
    },
    {
      icon: 'logos:python',
      style: { top: '9%', left: '58%' },
    },

    {
      icon: 'logos:maven',
      style: { top: '15%', left: '30%' },
    },
    {
      icon: 'logos:go',
      style: { top: '20%', left: '38%' },
    },

    {
      icon: 'logos:java',
      style: { top: '30%', left: '70%' },
    },

    {
      icon: 'logos:visual-studio-code',
      style: { bottom: '25%', right: '5%' },
    },
    {
      icon: 'logos:docker',
      style: { bottom: '1%', left: '1%' },
    },
  ]

  return (
    <>
      {logos.map((l, index) => {
        const yValue = index % 2 === 0 ? y1 : y2

        return (
          <motion.div
            className={styles.box}
            initial={{ opacity: 0.01, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: Math.random() * 2 + 0.5,
              delay: 0.5,
            }}
            style={{
              ...l.style,
              y: yValue,
            }}
          >
            <Icon icon={l.icon}></Icon>
          </motion.div>
        )
      })}
    </>
  )
}

function Background() {
  return (
    <>
      <motion.div className={styles.background}>
        <Logos />
        <HeroMain />
        <div className={styles.circle} />
      </motion.div>
    </>
  )
}

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      custom={1}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseMove={e => {
        e.currentTarget.style.setProperty('--x', `${e.clientX}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY}px`)
      }}
    >
      <Translate id="homepage.hero.greet">你好! 我是</Translate>
      <span
        className={styles.name}
        onMouseMove={e => {
          const bounding = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--positionX', `${bounding.x}px`)
          e.currentTarget.style.setProperty('--positionY', `${bounding.y}px`)
        }}
      >
        <Translate id="homepage.hero.name">KBWS</Translate>
      </span>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <motion.div className={styles.hero}>
      <div className={styles.intro}>
        <Name />
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <Translate id="homepage.hero.text">
            {`在这里我会分享博客、笔记和我自己的开源项目`}
          </Translate>
        </motion.p>
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          {/* <SocialLinks /> */}
        </motion.div>

        <motion.div
          className={styles.buttonGroup}
          custom={4}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <div className={styles.outer}>
            <div className={styles.gradient} />
            <a className={styles.button} href={'./about'}>
              <Translate id="hompage.hero.introduce">自我介绍</Translate>
            </a>
          </div>
        </motion.div>
      </div>
      <Background />
    </motion.div>
  )
}
