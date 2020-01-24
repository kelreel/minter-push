import axios from 'axios'
import config from '../config'

export const getLastTxs = async (address: string) => {
  return (await axios.get(
      `${config.explorerURL}/addresses/${address}/transactions`
    )).data
}