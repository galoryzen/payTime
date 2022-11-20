import { useState, useEffect } from 'react';

export default function useFetchCards() {
  const tarjetasQuemadas = [
    {
      id: 1,
      nombre: 'Luisa Escobar',
      numero: '4534567890128998',
      mes: '12',
      ano: '2022',
      cvv: '123',
      issuer: 'visa',
    },
    {
      id: 2,
      nombre: 'Luisa Escobar',
      numero: '5555555555554444',
      mes: '12',
      ano: '2022',
      cvv: '123',
      issuer: 'mastercard',
    },
    {
      id: 3,
      nombre: 'Luisa Escobar',
      numero: '5234567890121556',
      mes: '12',
      ano: '2022',
      cvv: '123',
      issuer: 'mastercard',
    },
    {
      id: 4,
      nombre: 'Luisa Escobar',
      numero: '4111111111111111',
      mes: '11',
      ano: '25',
      cvv: '123',
      issuer: 'visa',
    },
    {
      id: 5,
      nombre: 'Luisa Escobar',
      numero: '378282246310005',
      mes: '11',
      ano: '25',
      cvv: '123',
      issuer: 'amex',
    },
  ];

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCards = () => {
    return tarjetasQuemadas;
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  //fetch
  useEffect(() => {
    setCards(fetchCards());
    sleep(1000).then(() => setLoading(false));
  }, []);

  return { cards, loading };
}
