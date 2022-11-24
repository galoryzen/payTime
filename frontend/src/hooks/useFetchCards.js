import { useState, useEffect } from 'react';
import axios from 'axios';
import useToken from './useToken';

export default function useFetchCards() {
  const { token } = useToken();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  //fetch
  useEffect(() => {
    axios
      .get('http://localhost:3000/paymentMethod/user/1', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCards(response.data);
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  return { cards, loading };
}
