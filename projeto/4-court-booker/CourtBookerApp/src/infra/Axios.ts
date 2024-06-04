import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const SERVICE_URL = import.meta.env.VITE_SERVICE_URL
const __DEV__ = import.meta.env.VITE___DEV__

console.log("SERVICE URL && __DEV__")
console.log(SERVICE_URL)
console.log(__DEV__)

class AxiosAPI {
  private _instance: AxiosInstance

  private logRequest(config: AxiosRequestConfig<unknown>) {
    const { baseURL, url, method, params, headers, data } = config
    const fullURL = `${baseURL}${url}${params ? '?' + new URLSearchParams(params) : ''}`

    console.log("------------------------------------------------------------------")
    console.log(`Requisição ${method?.toUpperCase()} - ${fullURL}`)
    console.log(`Headers: ${JSON.stringify(headers)}`)
    if (method?.toUpperCase() === "POST" || method?.toUpperCase() === "UPDATE") {
      console.log(`Body: ${JSON.stringify(data)}`)
    }
  }

  constructor(serviceUrl: string) {
    console.log("AXIOS INSTANCE")
    console.log(serviceUrl)

    this._instance = axios.create({
      baseURL: `${serviceUrl}`,
      timeout: 20000,
    });

    this._instance.interceptors.request.use(
      (config) => {
        if (__DEV__) this.logRequest(config)
    
        return config;
      },
      (error) => {
        if (__DEV__) this.logRequest(error.config)
    
        return Promise.reject(error);
      }
    );

    this._instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const { baseURL, url, method, params, headers, data } = error.config;
          const fullURL = `${baseURL}${url}${params ? '?' + new URLSearchParams(params) : ''}`;
    
          console.error(`${error.response.status} no endpoint ${method.toUpperCase()} ${fullURL}!`)
          console.error("Mensagem:", error.response.data.message || `O erro ${error.response.data.message} não retornou nenhuma mensagem`);
          
          // Request
          console.error("Header da requisição:", headers);
          if (method.toUpperCase() !== "GET") {
            console.error("Payload da requisição:", data);
          }

          // Response
          console.error("Resposta: ")
          console.error(error.response)
          
        }

        return Promise.reject(error);
      }
    );
  }

  get instance() {
    return this._instance
  }
}

const axiosApi = new AxiosAPI(SERVICE_URL)

export default axiosApi
