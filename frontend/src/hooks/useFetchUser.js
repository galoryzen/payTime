import { useState, useEffect } from 'react';
import axios from 'axios';
import useToken from './useToken';

export default function useFetchUser() {
  const { token } = useToken();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  //fetch
  useEffect(() => {
    axios
      .get('http://localhost:3000/user/1', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUser(response.data);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
}