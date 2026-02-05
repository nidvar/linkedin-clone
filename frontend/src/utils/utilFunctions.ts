export const getRequest = async function(url: string){
  try {
    const res = await fetch(import.meta.env.VITE_BACKEND_API + url, {credentials: "include" as RequestCredentials});  
    const data = await res.json();
    if(!res.ok){
      throw new Error(data.message || res.statusText);
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const postRequest = async function(url: string, payloadData: object){
  try {
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
    if(!res.ok){
      throw new Error(data.message || res.statusText);
    }
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};