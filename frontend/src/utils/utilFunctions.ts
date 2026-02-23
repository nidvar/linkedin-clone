const BASE_URL = import.meta.env.MODE === "production" 
  ? "/api/v1" 
  : "http://localhost:5000/api/v1";

const refreshAccessToken = async function(){
  const res = await fetch(BASE_URL + '/auth/refreshaccesstoken', {
    method: 'POST',
    credentials: "include" as RequestCredentials,
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  console.log(data);
  return data;
};

export const getRequest = async function(url: string) {
  const res = await fetch(BASE_URL + url, {
    credentials: "include" as RequestCredentials,
  });
  const data = await res.json();

  if(data.message === 'Token expired' || data.message === 'Invalid token'){
    const refreshResult = await refreshAccessToken();
    if(refreshResult.message === 'Access token refreshed'){
      const res = await fetch(BASE_URL + url, {
        credentials: "include" as RequestCredentials,
      });
      const data = await res.json();
      return data;
    }else{
      throw new Error('refreshing token fail');
    }
  };

  if (!res.ok) {
    throw data
  }
  
  return data;
};

export const postRequest = async function(url: string, payloadData: object, method?: string) {
  const payload = {
    method: method ||'POST',
    credentials: "include" as RequestCredentials,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payloadData),
  }

  const res = await fetch(BASE_URL + url, payload);
  const data = await res.json();

  if(data.message === 'Token expired'){
    const refreshResult = await refreshAccessToken();
    if(refreshResult.message === 'Access token refreshed'){
      const res = await fetch(BASE_URL + url, payload);
      const data = await res.json();
      return data;
    }else{
      throw new Error('refreshing token fail');
    }
  };

  if (!res.ok) {
    throw data
  }

  return data;
};

export const fetchUser = async function(){
  try {
    const authUser = await getRequest('/auth/me');
    const user = authUser.user;
    return user || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function daysAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}
