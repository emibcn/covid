import ContextCreator from '../Base/ContextCreator'
import Handler from './handler'
import { withIndex, withData } from './withHandlers'

const { Provider, withHandler, Consumer, useHandler, Context } = ContextCreator(
  Handler,
  'mapsDataHandler'
)

export default Provider
export { withHandler, Consumer, useHandler, Context, withIndex, withData }
