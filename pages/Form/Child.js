import  { memo } from 'react'
function Child({RenderFunction,data}) {
  return RenderFunction(data)
}
export default memo(Child)