const {
  createUser, createAdmin
} = require("./users");

async function createInitialUsers() {
  console.log('Starting to create users...');
  try {
    await createAdmin({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'adminpassword'
    });

    const usersToCreate = [
      {
        username: 'albert',
        email: 'albert123@gmail.com',
        password: 'bertie99'
      },
      { 
        username: 'sandra', 
        email: 'sandra234@gmail.com',
        password: 'sandra123'
      },
      { 
        username: 'glamgal', 
        email: 'glamgal345@gmail.com',
        password: 'glamgal123'
      },
      { 
        username: 'minah', 
        email: 'minah456@gmail.com',
        password: 'passwordforminah456'
      },
      { 
        username: 'jooha', 
        email: 'jooha567@gmail.com',
        password: 'passwordforjooha567'
      },
      { 
        username: 'austin', 
        email: 'austin678@gmail.com',
        password: 'passwordforaustin67'
      },
      { 
        username: 'anna', 
        email: 'anna789@gmail.com',
        password: 'passwordforanna789'
      },
      { 
        username: 'matt', 
        email: 'matt890@gmail.com',
        password: 'passwordformatt890'
      },
      { 
        username: 'david', 
        email: 'david901@gmail.com',
        password: 'passwordfordavid901'
      },
      { 
        username: 'robert', 
        email: 'robert012@gmail.com',
        password: 'passwordforrobert012'
      },
    ]
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log('Users created:');
    console.log(users);
    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users!');
    throw error;
  }
}

module.exports = createInitialUsers;

