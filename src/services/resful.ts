import axios from 'axios'
import domain from './domain'

// let key = "0cf5516973a145929ff36d3303183e5f";
<<<<<<< HEAD
// let key = 'dc575a112fc24c35b6c289d0a83ab8e6'
=======
// let key = "dc575a112fc24c35b6c289d0a83ab8e6";
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e
let url_string = window.location.href
let url = new URL(url_string)
let token = url.searchParams.get('access_token')

export const Resful = {
  post: (params: any, proceed: Function) => {
    const { access_token, path, body } = params

    axios
      .post(domain + path, body, {
        headers: {
          'Content-Type': 'application/json',
          token: access_token ? access_token : token,
<<<<<<< HEAD
          key: globalThis.$env.secret_key,
=======
          key: $env.secret_key,
>>>>>>> 891e938561e8b9cea2a9d09717a23beaa6256f4e
        },
      })
      .then((response) => {
        proceed(null, response)
      })
      .catch((error) => {
        proceed(error.response)
      })
  },
  chatbox_post: (url: string, body: Object, proceed: Function) => {
    axios
      .post(url, body)
      .then((response) => {
        proceed(null, response)
      })
      .catch((error) => {
        proceed(error.response)
      })
  },
}
