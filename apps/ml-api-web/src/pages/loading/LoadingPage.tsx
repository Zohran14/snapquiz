import { useEffect, useState } from 'react'
import Loading from './Loading'

const LoadingPage = () => {
  const [state, setState] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setState(state + 1)
    }, 4200)
    return () => clearInterval(interval)
  }, [state])
  return (
    <div key={state}>
        <Loading />
    </div>
  )
}

export default LoadingPage