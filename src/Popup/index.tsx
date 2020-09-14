import React, { useState, useEffect } from 'react'
import styles from './index.scss'
import Chain from '../chain'

interface ITab {
  tabs: string[]
  onClick: (i: number) => void
  currentIndex: number
}

const Tab: React.FC<ITab> = ({ tabs, onClick, currentIndex }) => {
  return (
    <ul className={styles.tab}>
      {tabs.map((item, i) => (
        <li
          key={item}
          onClick={() => onClick(i)}
          className={`${styles.cell} ${
            currentIndex === i && styles.cellActive
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

interface IBoard {
  data: IData[]
  value: string | number
  onClick: (v: IData) => void
  onReset: () => void
  fieldNames: FieldName
}
const Board: React.FC<IBoard> = ({
  data,
  value,
  onClick,
  onReset,
  fieldNames
}) => {
  return (
    <div className={styles.board}>
      <div className={styles.boardContent}>
        {data?.map((item) => (
          <div
            key={item[fieldNames.value]}
            onClick={() => onClick(item)}
            className={`${styles.boardCell} ${
              value === item[fieldNames.value] && styles.boarderCellActive
            }`}
          >
            {item[fieldNames.label]}
          </div>
        ))}
      </div>
      <div className={styles.borderFooter}>
        <span onClick={onReset} className={styles.button}>
          重置
        </span>
      </div>
    </div>
  )
}

interface IPopup {
  data: IData[]
  tabs?: string[]
  firstTabName?: string // 没传tabs时，需要传省份的tab名字
  value: Array<string | number>
  onChange: (v: Array<string | number>) => void
  onClose: () => void
  className?: string
  style?: { [key: string]: string }
  onReset: () => void
  fieldNames: FieldName
}

const initDisplayData = (
  chain: Chain<IPopupData>,
  source: IData[],
  target: Array<string | number>,
  tabs: Array<string | number>,
  fieldNames: FieldName
) => {
  if (!source?.length) {
    return []
  }
  if (!target?.length) {
    return []
  }

  target.reduce((pre, cur: string | number, curIndex) => {
    const next = pre.find((e) => e[fieldNames.value] === cur)
    if (next?.children?.length) {
      chain.push({
        tab: tabs?.[curIndex + 1] || next[fieldNames.label],
        data: next.children,
        value: next
      })
    }
    return next?.children || []
  }, source)
  return chain
}

let popupData: Chain<IPopupData> = null

const Popup: React.FC<IPopup> = ({
  data,
  tabs,
  firstTabName = '请选择',
  value,
  onChange,
  onClose,
  className,
  style,
  onReset,
  fieldNames
}) => {
  const [index, setIndex] = useState<number>(0)
  const [current, setCurrent] = useState<IData[]>(null)
  const [displayTabs, setDisPlayTabs] = useState<string[]>([])

  // useEffect(() => {
  //   if (data?.length && !popupData?.length) {
  //     popupData = new Chain({ tab: tabs?.[0] ?? firstTabName, value: null, data })
  //     refreshPopup(popupData)
  //   }

  //   if (value?.length && popupData?.length === 1) {
  //     initDisplayData(popupData, data, value, tabs, fieldNames)
  //     // 首次展示第一项
  //     popupData.at(0)
  //     refreshPopup(popupData)
  //     // 切换到城市，然后一会儿会自动跳到省份，是那个消息通知的数据更新导致的整个页面render造成的
  //     console.log('qie换')
  //   }

  //   return () => (popupData = null)
  // }, [data, value])

  useEffect(() => {
    if (data?.length && !popupData?.length) {
      popupData = new Chain({
        tab: tabs?.[0] || firstTabName,
        value: null,
        data
      })
      refreshPopup(popupData)
    }

    if (value?.length && popupData?.length === 1) {
      initDisplayData(popupData, data, value, tabs, fieldNames)
      // 首次展示第一项
      popupData.at(0)
      refreshPopup(popupData)
      // 切换到城市，然后一会儿会自动跳到省份，是那个消息通知的数据更新导致的整个页面render造成的
      // console.log('qie换')
    }

    return () => (popupData = null)
  }, [])

  const refreshPopup = (v: Chain<IPopupData>) => {
    const curr = v.pointer
    setCurrent(curr.element.data)

    setIndex(curr.index)
    setDisPlayTabs(tabs.slice(0, v.length))
  }

  const handleBoard = (v: IData) => {
    const child = v[fieldNames.children] || []
    if (child.length > 0) {
      popupData.removeAfterPointer()
      popupData.push({
        tab: tabs?.[index] || v[fieldNames.label],
        data: child,
        value: v
      })
      refreshPopup(popupData)
    } else {
      onChange([
        ...popupData.map((e) => e.value?.[fieldNames.value]),
        v[fieldNames.value]
      ])
      onClose()
    }
  }

  const handleTab = (i) => {
    if (i !== index) {
      popupData.at(i)
      refreshPopup(popupData)
    }
  }

  const handleReset = () => {
    onReset()
    onClose()
  }

  return (
    <div
      style={style}
      onClick={(e) => e.stopPropagation()}
      className={`${styles.popup} ${className}`}
    >
      <Tab onClick={handleTab} tabs={displayTabs} currentIndex={index} />
      <Board
        onReset={handleReset}
        onClick={handleBoard}
        data={current}
        value={value?.[index]}
        fieldNames={fieldNames}
      />
    </div>
  )
}

export default Popup
