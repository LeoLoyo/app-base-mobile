import {get} from 'lodash'
import {setProfileId} from '../../../core/Auth'

export const setfirstProfileIdAvaliable = async (data) => {
  const profileID = get(data, 'profiles.0._id')
  if (profileID) {
    await setProfileId(profileID)
  }
}
