'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password: '123456',
      firstName: 'tun',
      lastName: 'bui',
      address: 'vn',
      gender: 1,
      typeRole: 'ROLE',
      keyRole: 'R1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'admin1@gmail.com',
      password: '$2b$10$R8xmAZyS41k7e4jR43ArKOf79a9PxvaK9OGkTF/nlOkdDXS30gnvu',
      firstName: 'tun',
      lastName: 'bui',
      address: 'vn',
      gender: 1,
      typeRole: 'ROLE',
      keyRole: 'R1',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
