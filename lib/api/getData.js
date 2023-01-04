import axios from "axios";
import { API_URL } from "../../utils/connectionConfig";

export async function getData(type, prefix, locale) {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/${type}?locale=${locale}&${prefix}`
    );

    return data.data;
  } catch (error) {
    return [];
  }
}
export async function getShopDetails(locale) {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/shop-detail?locale=${locale}`
    );

    return data.data;
  } catch (error) {
    return null;
  }
}
