export function index(html) {
  console.log("Método index do SiteController");
  console.log('received: ', html);

  // user = User.find(1)

  // const data {
  //   user: user
  // }

  const data = {
      user: {
          name: 'João Silva',
          email: 'joao.silva@example.com',
          registrationDate: '2023-01-15',
          status: 'Ativo'
      },
      appVersion: '1.0.0'
  };

  return data;
}
