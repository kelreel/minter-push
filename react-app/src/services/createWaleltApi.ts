import qs from "qs";
import HTTP from "./http";
import config from '../config'

// export const getGames = async () => {
//   return HTTP.get(`${config.apiURL}/anagram/all`)
// }

export const newWallet = async (pass: string, name: string, payload: string, fromName: string) => {
  const data = {
    pass,
    name,
    payload,
    fromName
  };
  return await HTTP.post(`${config.apiURL}/new`, qs.stringify(data), {
    headers: { "content-type": "application/x-www-form-urlencoded" }
  });
};

export const getBalance = async (address: string) => {
  return await HTTP.get(`${config.nodeURL}address?address=${address}`);
}

// export const startGame = async (gameId: string) => {
//   const data = {
//     seed: localStorage.getItem("seed"),
//     gameId
//   };
//   return await HTTP.post(`${config.apiURL}/anagram/start`, qs.stringify(data), {
//     headers: { "content-type": "application/x-www-form-urlencoded" }
//   });
// }

// export const endGame = async (gameId: string, answers: []) => {
//   const data = {
//     seed: localStorage.getItem("seed"),
//     answers: JSON.stringify(answers),
//     gameId
//   }
//   return await HTTP.post(`${config.apiURL}/anagram/end`, qs.stringify(data), {
//     headers: { "content-type": "application/x-www-form-urlencoded" }
//   });
// }