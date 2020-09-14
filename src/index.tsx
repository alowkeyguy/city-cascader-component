import React, { useEffect, useState, useRef } from 'react'
// import Trigger, { BuildInPlacements, TriggerProps } from 'rc-trigger'
import { Input } from 'antd'
import styles from './index.scss'
import Popup from './Popup'
// import { InputProps } from 'antd/lib/input'
import { addEvent, removeEvent } from './utils'
import arrayTreeFilter from 'array-tree-filter'
import { DEFAULT_FIELD_NAME } from './type'
import { DownOutlined } from '@ant-design/icons'

interface IProps {
  data: IData[]
  tabs: string[]
  value?: Array<string | number>
  onChange: (value?: Array<string | number>, checkedData?: IData[]) => void
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  fieldNames?: FieldName
  placeholder?: string
}

const CityCascader: React.FC<IProps> = ({
  tabs,
  data,
  value,
  style,
  className,
  disabled,
  onChange,
  fieldNames = DEFAULT_FIELD_NAME
}) => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [popupPosition, setPopupPosition] = useState<string>(null)
  // 选中的对象集合
  const [checkedDataArr, setCheckedDataArr] = useState<IData[]>([])
  // input里面显示的值
  const [display, setDisplay] = useState<string>('')
  const [initValue, setInitValue] = useState<Array<string | number>>([])
  const ref = useRef<HTMLDivElement>()

  const closePopup = (e?: any) => {
    if (!ref.current?.contains(e.srcElement)) {
      setPopupVisible(false)
      removerEventLister()
    }
  }

  const addEventLister = () => {
    addEvent(window, 'click', closePopup)
  }

  const removerEventLister = () => {
    removeEvent(window, 'click', closePopup)
  }

  useEffect(() => {
    return removerEventLister()
  }, [])

  useEffect(() => {
    if (value?.length && data?.length) {
      setCheckedDataArr(
        arrayTreeFilter(
          data,
          (item, level) => item[fieldNames.value] === value[level]
        )
      )
    }
    if (!initValue.length && value?.length) {
      setInitValue([...value])
    }
  }, [value, data])

  useEffect(() => {
    setDisplay(checkedDataArr.map((e) => e[fieldNames.label]).join('/'))
  }, [checkedDataArr])

  const getPosition = () => {
    const height = window.innerHeight
    const { bottom } = ref.current.getBoundingClientRect()
    if (height - bottom < 300) {
      setPopupPosition('TOP')
    } else {
      setPopupPosition(null)
    }
  }

  const handleInput = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (disabled) {
      return
    }
    getPosition()
    if (popupVisible) {
      setPopupVisible(false)
      removerEventLister()
    } else {
      setPopupVisible(true)
      addEventLister()
    }
  }

  const handleChange = (keys: Array<string | number>) => {
    const checkedData = arrayTreeFilter(
      data,
      (item, level) => item[fieldNames.value] === keys[level]
    )
    onChange(keys, checkedData)
  }

  return (
    <div ref={ref} style={style} className={`${styles.select} ${className}`}>
      <span className={styles.span} onClick={handleInput}>
        <Input
          disabled={disabled}
          readOnly
          className={styles.input}
          value={display}
          suffix={
            <DownOutlined
              className={`${styles.icon} ${popupVisible && styles.iconActive}`}
            />
          }
        />
      </span>
      {popupVisible && (
        <Popup
          className={`${styles.popup} ${
            popupPosition === 'TOP' && styles.popupTop
          }`}
          tabs={tabs}
          onChange={handleChange}
          value={value}
          data={data}
          onClose={() => setPopupVisible(false)}
          onReset={() => handleChange(initValue)}
          fieldNames={fieldNames}
        />
      )}
    </div>
  )
}

export default CityCascader
