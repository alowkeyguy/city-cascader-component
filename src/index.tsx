import React, { useEffect, useState, useRef, useMemo } from 'react'
// import Trigger, { BuildInPlacements, TriggerProps } from 'rc-trigger'
import './index.scss'
import Popup from './Popup'
// import { InputProps } from 'antd/lib/input'
import { addEvent, removeEvent } from './utils'
import { DEFAULT_FIELD_NAME } from './type'
import { DownOutlined } from '@ant-design/icons'

const CLASS_NAME_PREFIX = 'city-cascade'

interface IProps {
  data: IData[]
  // 选中的值的label、value结构数组
  value?: IData[]
  onChange: (checkedData?: IData[]) => void
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  fieldNames?: FieldName
  placeholder?: string
  onCheckedCity?: (v?: IData, d?: boolean) => Promise<any>
}

const CityCascade: React.FC<IProps> = ({
  data,
  value,
  style,
  className,
  disabled,
  onChange,
  fieldNames = DEFAULT_FIELD_NAME,
  onCheckedCity,
  placeholder = '请选择'
}) => {
  const [popupVisible, setPopupVisible] = useState<boolean>(false)
  const [popupPosition, setPopupPosition] = useState<string>(null)
  // 选中的对象集合
  const [checkedDataArr, setCheckedDataArr] = useState<IData[]>([])
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
    setCheckedDataArr(value)
  }, [value])

  const display = useMemo(
    () => checkedDataArr?.map((e) => e[fieldNames.label]).join('/'),
    [checkedDataArr]
  )

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

  const handleChange = (v: IData[]) => {
    setCheckedDataArr(v)
    onChange(v)
  }

  return (
    <div
      ref={ref}
      style={style}
      className={`${CLASS_NAME_PREFIX}-select ${className}`}
    >
      <div className={`${CLASS_NAME_PREFIX}-content`} onClick={handleInput}>
        <span className={`${CLASS_NAME_PREFIX}-text`}>
          <input
            className={`${CLASS_NAME_PREFIX}-input`}
            value={display}
            readOnly
            placeholder={placeholder}
          />
        </span>
        <DownOutlined
          className={`${CLASS_NAME_PREFIX}-icon ${
            popupVisible && CLASS_NAME_PREFIX + '-icon-active'
          }`}
        />
      </div>
      {popupVisible && (
        <Popup
          className={`${CLASS_NAME_PREFIX}-popup ${
            popupPosition === 'TOP' && CLASS_NAME_PREFIX + '-popup-top'
          }`}
          onChange={handleChange}
          value={checkedDataArr}
          data={data}
          onClose={() => setPopupVisible(false)}
          onReset={() => handleChange([])}
          fieldNames={fieldNames}
          onCheckedCity={onCheckedCity}
        />
      )}
    </div>
  )
}

export default CityCascade
