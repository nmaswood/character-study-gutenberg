import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import tough from "tough-cookie";

// Initialize a cookie jar
const cookieJar = new tough.CookieJar();
export const axiosClient = wrapper(axios.create({ jar: cookieJar }));
