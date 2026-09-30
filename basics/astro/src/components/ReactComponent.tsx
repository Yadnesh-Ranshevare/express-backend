import React, { useState } from 'react'

export default function ReactComponent() {
    const [count, setCount] = useState(0);

    const increment = () => {
        setCount(count + 1);
        console.log(count);
    }
  return (
    <div>
      this is a react component
      <button onClick={increment}>count is {count}</button>
    </div>
  )
}
