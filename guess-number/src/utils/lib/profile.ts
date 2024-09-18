import axios from "axios";

export const playersProfile = async (id: string) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/getPlayer/${id}`);
};
