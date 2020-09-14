import React from 'react'

import CityCascader from 'city-cascader-component'
import 'city-cascader-component/dist/index.css'


const createCity = (n = 10) =>
  Array.from({ length: n }, () => ({
    label: Math.floor(Math.random() * 100),
    value: Math.floor(Math.random() * 10000),
    children: []
  }))

const App = () => {


  const handleChange = (e: any) => {
    console.log(e)
  }

  // const fetchData = async (n = 10) => {
  //   return await new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(createCity(n))
  //     }, 2000);
  //   })
  // }
  

  return (
    <div className="wrap">
      <CityCascader
        data={createCity(20)}
        tabs={['a', 'b', 'c', 'd']}
        onChange={handleChange}
      />
    </div>
  )
}

export default App
