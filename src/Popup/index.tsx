import React, { useState, useEffect, useMemo, useRef } from 'react'
import { LoadingOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import './index.scss'

const CLASS_NAME_PREFIX = 'city-cascade-popup'
const STEP = 40

interface ITab {
  tabs: string[]
  onClick: (i: number) => void
  currentIndex: number
}

const getScrollLeft = (ulElement: HTMLUListElement) => {
  const childCollection = ulElement?.children
  const len = childCollection?.length || 0
  if (len > 0) {
    const scrollWidth = Array.from(
      { length: len },
      (_v, i) => childCollection[i]
    ).reduce((pre, cur) => pre + cur.clientWidth, 0)

    return Math.max(scrollWidth - ulElement.clientWidth, 0)
  }

  return 0
}

const Tab: React.FC<ITab> = ({ tabs, onClick, currentIndex }) => {
  const ref = useRef<HTMLUListElement>(null)
  const [scrollLeft, setScrollLeft] = useState<number>(0)
  const [transformX, setTransformX] = useState<number>(0)

  const transformStyle = useMemo(
    () => ({
      transform: `translateX(${transformX}px)`
    }),
    [transformX]
  )

  const [disableLeft, disableRight] = useMemo(
    () =>
      scrollLeft
        ? [transformX === 0, transformX === -scrollLeft]
        : [true, true],
    [scrollLeft, transformX]
  )

  useEffect(() => {
    ref?.current && setScrollLeft(getScrollLeft(ref.current))
  }, [tabs])

  const handleArrow = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    v: 'LEFT' | 'RIGHT'
  ) => {
    e.preventDefault()
    e.stopPropagation()
    if (v === 'RIGHT' && !disableRight) {
      setTransformX((pre) => Math.max(pre - STEP, -scrollLeft))
    } else if (v === 'LEFT' && !disableLeft) {
      setTransformX((pre) => Math.min(pre + STEP, 0))
    }
  }

  return (
    <div className={`${CLASS_NAME_PREFIX}-tab`}>
      <a
        onClick={(e) => handleArrow(e, 'LEFT')}
        className={`${CLASS_NAME_PREFIX}-tab-icon ${
          scrollLeft > 0 && CLASS_NAME_PREFIX + '-tab-icon-active'
        }`}
      >
        <LeftOutlined />
      </a>
      <div className={`${CLASS_NAME_PREFIX}-tab-content`}>
        <ul
          ref={ref}
          style={transformStyle}
          className={`${CLASS_NAME_PREFIX}-tab-inner`}
        >
          {tabs.map((item, i) => (
            <li
              key={item}
              onClick={() => onClick(i)}
              className={`${CLASS_NAME_PREFIX}-tab-cell ${
                currentIndex === i && CLASS_NAME_PREFIX + '-tab-active'
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <a
        onClick={(e) => handleArrow(e, 'RIGHT')}
        className={`${CLASS_NAME_PREFIX}-tab-icon ${
          scrollLeft > 0 && CLASS_NAME_PREFIX + '-tab-icon-active'
        }`}
      >
        <RightOutlined />
      </a>
    </div>
  )
}

interface IBoard {
  data: IData[]
  value: IData
  onClick: (v: IData) => void
  onReset: () => void
  fieldNames: FieldName
  loadingKey: string
  boardLoading: boolean
}
const Board: React.FC<IBoard> = ({
  data,
  value,
  onClick,
  onReset,
  fieldNames,
  loadingKey,
  boardLoading
}) => {
  return (
    <div className={`${CLASS_NAME_PREFIX}-board`}>
      <div className={`${CLASS_NAME_PREFIX}-board-content`}>
        <div className={`${CLASS_NAME_PREFIX}-board-city`}>
          {data?.map((item) => (
            <div
              key={item[fieldNames.value]}
              className={`${CLASS_NAME_PREFIX}-board-cell ${
                value[fieldNames.value] === item[fieldNames.value] &&
                CLASS_NAME_PREFIX + '-board-active'
              }`}
              onClick={() => onClick(item)}
            >
              {item[fieldNames.label]}
              {loadingKey === item[fieldNames.value] && (
                <div className={`${CLASS_NAME_PREFIX}-board-spin`}>
                  <LoadingOutlined />
                </div>
              )}
            </div>
          ))}
        </div>
        {boardLoading && (
          <div className={`${CLASS_NAME_PREFIX}-board-loading`}>
            <LoadingOutlined />
          </div>
        )}
      </div>
      <div className={`${CLASS_NAME_PREFIX}-board-footer`}>
        <span onClick={onReset} className={`${CLASS_NAME_PREFIX}-board-button`}>
          重置
        </span>
      </div>
    </div>
  )
}

interface IPopup {
  data: IData[]
  firstTabName: string // 需要传省份的tab名字
  value: IData[]
  onChange: (v: IData[]) => void
  onClose: () => void
  // style?: { [key: string]: string }
  onReset: () => void
  fieldNames: FieldName
  // 选中城市后的回调
  onCheckedCity?: (v?: IData) => Promise<IData[]>
  className?: string
}

const Popup: React.FC<IPopup> = ({
  data,
  firstTabName = '请选择',
  value,
  onChange,
  onClose,
  onReset,
  fieldNames,
  onCheckedCity,
  className
}) => {
  const [index, setIndex] = useState<number>(0)
  // 选中的省、市、镇对象集合
  const [checkedData, setCheckedData] = useState<IData[]>([])
  // popup展示版数据集合
  const [popupDataList, setPopupDataList] = useState<IData[][]>([])

  const [loadingKey, setLoadingKey] = useState<string>('')
  const [boardLoading, setBoardLoading] = useState<boolean>(false)

  useEffect(() => {
    if (data?.length) {
      setPopupDataList([data])
    }
  }, [data])

  useEffect(() => {
    if (value?.length) {
      setCheckedData(value.filter((e, i) => i !== value.length - 1))
    }
  }, [value])

  // 当前popup展示的城市列表
  const currentPopup = useMemo(() => popupDataList?.[index] || [], [
    index,
    popupDataList
  ]) as IData[]

  const handleBoard = async (v: IData) => {
    let next: IData[]
    if (onCheckedCity) {
      setLoadingKey(v[fieldNames.value])
      const res = await onCheckedCity(v)
      if (res) {
        next = res
      }
      setLoadingKey('')
    }

    if (next?.length) {
      setCheckedData((pre) => [...pre.filter((e, i) => i < index), v])
      setPopupDataList((pre) => [...pre.filter((e, i) => i <= index), next])
      setIndex((pre) => pre + 1)
    } else {
      onChange([...checkedData.filter((e, i) => i < index), v])
      onClose()
    }
  }

  const handleTab = async (i) => {
    if (i !== index) {
      if (i !== 0 && !popupDataList[i]) {
        setBoardLoading(true)
        const res = await onCheckedCity(checkedData[i - 1])
        res &&
          setPopupDataList((pre) => {
            pre[i] = res
            return [...pre]
          })
        setBoardLoading(false)
      }
      setIndex(i)
    }
  }

  const handleReset = () => {
    onReset()
    onClose()
  }

  const currentValue = useMemo(() => checkedData?.[index] || {}, [
    index,
    checkedData
  ])

  const labels = useMemo(
    () => [firstTabName, ...checkedData.map((d) => d[fieldNames.label])],
    [checkedData]
  )

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`${CLASS_NAME_PREFIX}-wrap ${className}`}
    >
      <Tab onClick={handleTab} tabs={labels} currentIndex={index} />
      <Board
        loadingKey={loadingKey}
        boardLoading={boardLoading}
        onReset={handleReset}
        onClick={handleBoard}
        data={currentPopup}
        value={currentValue}
        fieldNames={fieldNames}
      />
    </div>
  )
}

export default Popup
