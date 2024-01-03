describe('Reservations', () => {
  let jwt: string;
  beforeAll(async () => {
    const user = {
      email: 'nikolagrizz@gmail.com',
      password: 'Password123.',
    };

    await fetch('http://auth:3001/users/', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const res = await fetch('http://auth:3001/auth/login/', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    jwt = await res.text();
  });
  test('Create', async () => {
    const response = await fetch('http://reservations:3002/reservations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authentication: jwt,
      },
      body: JSON.stringify({
        startDate: '02-01-2023',
        endDate: '02-05-2023',
        placeId: 123,
        charge: {
          amount: 13,
          card: {
            cvc: 413,
            exp_month: 12,
            exp_year: 2027,
            number: '4242 4242 4242 4242',
          },
        },
      }),
    });

    expect(response.ok).toBeTruthy();
    const reservation = await response.json();
  });
});
