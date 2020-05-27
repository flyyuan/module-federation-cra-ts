import React, { useState, useEffect } from 'react'

const Graph1 = ({number,name}) =>{
  const [state, setState] = useState(true)
  useEffect(()=>{
    console.log('number',number)
    console.log('name',name)
  },[])
  return(
    <div>
      Hello remote component1
    </div>
  )
}

export default Graph1