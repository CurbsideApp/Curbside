import { auth } from "./firebase";
import io from "socket.io-client";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
if (!BASE_API_URL) throw new Error('add env vars for REACT_APP_BASE_API_URL')


export default class CurbsideApiClient {
  base_url: string;

  constructor() {
    this.base_url = BASE_API_URL + '/api';
    try {
    } catch (e) {
      console.error(e)
    }
  }

  async request(options:options) {

    const userToken = await auth.currentUser?.getIdToken(true);
    const authHeaders: {'Authorization'?:string} = {};
    if (userToken){
      authHeaders.Authorization = `Bearer ${userToken}`
    }
    if (options.query) {
      Object.keys(options.query).forEach(key => options.query[key] === undefined && delete options.query[key])
    }
    let query = new URLSearchParams(options.query || {}).toString();
    if (query !== '') {
      query = '?' + query;
    }
    let response;
    try {
      response = await fetch(this.base_url + options.url + query, {
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': 'http://localhost:3000',
          ...authHeaders,
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : null,
      });
    } catch (error :any) {
      response = {
        ok: false,
        status: 500,
        json: async () => { return {
          code: 500,
          message: 'The server is unresponsive',
          description: error.toString(),
        }; }
      };
    }
    const res : {ok:boolean, status:number, body?:any} = {
      ok: response.ok,
      status: response.status,
    }

    try {
      res.body = response.status !== 204 ? await response.json() : null
    } catch (error ){
      res.body = error; // this should follow a format/
    }
    return res;
  }

  async get(url:string, query?:query, options?:options) {
    return this.request({method: 'GET', url, query, ...options})
  }

  async post(url:string, body:any, options?:options) {
    return this.request({method: 'POST', url, body, ...options})
  }

  async patch(url:string, body:any, options?:options) {
    return this.request({method:'PATCH', url, body, ...options})
  }

  async delete(url: string, body:any, options?:options){
    return this.request({method: 'DELETE', url, body,...options});
  }

  async getSocket() {
    const token = await auth.currentUser?.getIdToken(true)
    if (token && BASE_API_URL) {
      const socket = io(BASE_API_URL, {auth: {token: token}});
      return  socket;
    }
  }
}

interface options {
  method?: string,
  url?: string,
  body?: any, 
  headers?: {
    [key:string]:string | undefined
  }
  [key:string]: any;
}

interface query {
  [key:string] : number | string | undefined
}