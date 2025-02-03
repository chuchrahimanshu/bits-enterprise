import React from 'react'
// import { useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const TestApi = () => {
    const [data] = useSearchParams()
    // console.log("test api",data)
    for (const entry of data.entries()) {
        const [param, value] = entry;
        // console.log(param, value);
      }
  return (
    <div>API version 1.0.0</div>
  )
}

export default TestApi