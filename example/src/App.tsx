import React from 'react'

import CityCascader from 'city-cascader-component'
import 'city-cascader-component/dist/index.css'

const data = [
  {
    label: '湖北',
    value: 'provicen',
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
            children: [],
            loadData: [
              {
                label: '胸口_1',
                value: 'xk_1',
                children: []
              },
              {
                label: '胸口_2',
                value: 'xk_2',
                children: []
              }
            ]
          },
          {
            label: '浩口',
            value: 'hk',
            children: [
              {
                label: '浩口_1',
                value: 'hk_1',
                children: []
              },
              {
                label: '浩口_2',
                value: 'hk_2',
                children: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    label: '广东',
    value: 'guandong',
    loadData: [
      {
        label: '广州',
        value: 'guangzhou',
        loadData: [
          {
            label: '白云区',
            value: 'baiyun'
          },
          {
            label: '番禺区',
            value: 'pangyu'
          },
          {
            label: '珠江新城',
            value: 'zhujiang'
          },
          {
            label: '猎德',
            value: 'liede'
          }
        ]
      },
      {
        label: '深圳',
        value: 'shengzheng',
        loadData: [
          {
            label: '宝安区',
            value: 'baoan',
            loadData: [
              {
                label: '西乡街道',
                value: 'xixiangLoad',
                loadData: [
                  {
                    label: '西乡',
                    value: 'xixiang'
                  },
                  {
                    label: '平洲',
                    value: 'pz'
                  }
                ]
              },
              {
                label: '东乡街道',
                value: 'dongxiangLoad',
                loadData: [
                  {
                    label: '西乡',
                    value: 'dongxiang'
                  },
                  {
                    label: '东洲',
                    value: 'dz'
                  }
                ]
              }
            ]
          },
          {
            label: '南山区',
            value: 'nansan',
            loadData: [
              {
                label: '后海街道',
                value: 'houhai',
                loadData: [
                  {
                    label: '芒果往大厦',
                    value: 'mangguow',
                    loadData: [
                      {
                        label: '芒果往大厦_levei',
                        value: 'mgw_level'
                      }
                    ]
                  },
                  {
                    label: '腾讯大厦',
                    value: 'tenxun'
                  }
                ]
              }
            ]
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


  const handleChange = (e: any) => {
    console.log(e)
  }

  const fetchData = async (v: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(v.loadData || false)
      }, 500);
    })
  }
  

  return (
    <div className='wrap'>
      <CityCascader
        data={data}
        onChange={handleChange}
        onCheckedCity={fetchData}
        firstTabName='level_1'
      />
    </div>
  )
}

export default App
