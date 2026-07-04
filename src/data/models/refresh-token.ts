export default (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    family: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    familyCreatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'refreshTokens',
    freezeTableName: true,
    timestamps: true,
    updatedAt: false,
  })

  RefreshToken.associate = function (models) {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    })
  }

  return RefreshToken
}
