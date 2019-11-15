import {TimeLimitProvider} from '../../../../core/TimeLimit'

export const TimeLimitHandler = (config, {custom}, props) => {
  try {
    const {settings} = JSON.parse(custom)
    TimeLimitProvider.startTimeLimit({settings})
    return {}
  } catch (error) {
    console.error(error)
  }
}
