export const getRequest = async function(url: string) {
  const res = await fetch(import.meta.env.VITE_BACKEND_API + url, {
    credentials: "include" as RequestCredentials,
  });
  const data = await res.json();
  if(data.message === 'Token expired'){
    const res = await fetch(import.meta.env.VITE_BACKEND_API + '/auth/refreshaccesstoken', {
      method: 'POST',
      credentials: "include" as RequestCredentials,
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if(data.message === 'Access token refreshed'){
      const res = await fetch(import.meta.env.VITE_BACKEND_API + url, {
        credentials: "include" as RequestCredentials,
      });
      const data = await res.json();
      return data;
    }
  };
  if (!res.ok) {
    throw data
  }
  return data;
};

export const postRequest = async function(url: string, payloadData: object){
  const payload = {
    method: 'POST',
    credentials: "include" as RequestCredentials,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payloadData),
  }
  const res = await fetch(import.meta.env.VITE_BACKEND_API + url, payload);
  const data = await res.json();
  console.log(data);
  if (!res.ok) {
    throw new Error(data.message || res.statusText);
  }
  return data;
};