module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refreshTokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId',
        },
        onDelete: 'CASCADE',
      },
      tokenHash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      family: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      revokedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    })

    await queryInterface.addIndex('refreshTokens', ['tokenHash'])
    await queryInterface.addIndex('refreshTokens', ['family'])
    await queryInterface.addIndex('refreshTokens', ['userId'])

    await queryInterface.addColumn('users', 'tokenVersion', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('refreshTokens')
    await queryInterface.removeColumn('users', 'tokenVersion')
  },
}
