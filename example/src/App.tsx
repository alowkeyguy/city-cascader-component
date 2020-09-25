import React, { useState } from 'react'

import CityCascader from 'city-cascader-component'
import 'city-cascader-component/dist/index.css'

const data = [
  {
    label: '水果',
    value: 'shuiguo',
    children: [],
    loadData: [
      {
        label: '香蕉',
        value: 'balana',
        children: []
      }
    ]
  },
  {
    label: '省份',
    value: 'provicen',
    children: [],
    loadData: [
      {
        label: '荆州',
        value: 'jz',
        children: []
      },
      {
        label: '潜江',
        value: 'qj',
        children: [],
        loadData: [
          {
            label: '龙湾',
            value: 'lw',
            children: [],
            loadData: [
              {
                label: '坨口',
                value: 'tk',
                children: []
              },
              {
                label: '郑家湖村一',
                value: 'zjh1',
                children: []
              },
              {
                label: '郑家湖村二',
                value: 'zjh2',
                children: []
              }
            ]
          },
          {
            label: '熊口',
            value: 'xk',
            children: []
          },
          {
            label: '浩口',
            value: 'hk',
            children: []
          },
          {
            label: '张金',
            value: 'zj',
            children: []
          }
        ]
      }
    ]
  }
]


// const createCity = (n = 10) =>
//   Array.from({ length: n }, () => ({
//     label: Math.floor(Math.random() * 100),
//     value: Math.floor(Math.random() * 10000),
//     children: []
//   }))

const App = () => {
  const [index, setIndex] = useState(0)


  const handleChange = (e: any) => {
    console.log(e)
  }

  const fetchData = async (v: any, s = false) => {
    console.log(v, s)
    if (!s && index > 3) {
      return Promise.resolve(false)
    }
    !s && setIndex((pre) => pre + 1)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(v.loadData)
      }, 500);
    })
  }
  

  return (
    <div className='wrap'>
      <CityCascader
        data={data}
        onChange={handleChange}
        onCheckedCity={fetchData}
      />
    </div>
  )
}

export default App
