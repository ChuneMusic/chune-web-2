import axios from 'axios';

export const getTokenToServer = (email, password, newUser) => {
  const data = JSON.stringify({
    email,
    password
  });
  if (newUser) {
    return axios.post('https://chune-api.herokuapp.com/api/v1/users/', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(response => response.data);
  }
  return axios.post('https://chune-api.herokuapp.com/api/v1/users/login', data, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(response => response.data.token);
};

export const getProfileUserSocial = (token) => {
  const url = `https://graph.facebook.com/v3.1/me${token}`;
  return axios.get(url)
    .then(response => response);
};