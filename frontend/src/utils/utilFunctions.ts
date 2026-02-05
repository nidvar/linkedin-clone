export const getRequest = async function(url: string){
  const res = await fetch(import.meta.env.VITE_BACKEND_API + url, {credentials: "include" as RequestCredentials});
  const data = await res.json();
  console.log(data);
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
  return data;
};