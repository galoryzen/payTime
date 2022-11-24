import { useState, useEffect } from 'react';
import axios from 'axios';
import useToken from './useToken';

export default function useFetchTransactions() {
  const { token } = useToken();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(false);

  //fetch
  useEffect(() => {
    setError(false);
    axios
      .get('http://localhost:3000/transaction/user/1', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTransactions(response.data);
      })
      .catch((err) => {
        setError(true);
        console.log("Hola");
      })
  }, []);
  return { transactions, error };
}
