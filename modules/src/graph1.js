import React, { useState } from 'react'

const Graph1 = () =>{
  const [state, setState] = useState(true)
  return(
    <div>
      Hello remote component1
    </div>
  )
}

export default Graph1