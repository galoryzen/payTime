import { useState, useEffect } from 'react';
import useToken from './useToken';
import axios from 'axios';

export default function useFetchCard(id) {
  const { token } = useToken();
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(true);

  //fetch
  useEffect(() => {
    axios
      .get(`http://localhost:3000/paymentMethod/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setCard(response.data);
      })
      .then(() => {
        setLoading(false);
      });
  }, [id]);

  return { card, loading };
}
