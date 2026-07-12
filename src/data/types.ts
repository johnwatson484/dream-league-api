import type { Sequelize, ModelStatic, Model, DataTypes } from 'sequelize'

export type DataTypesStatic = typeof DataTypes

export interface Db {
  User: ModelStatic<Model>
  Manager: ModelStatic<Model>
  Player: ModelStatic<Model>
  Team: ModelStatic<Model>
  Division: ModelStatic<Model>
  Role: ModelStatic<Model>
  UserRole: ModelStatic<Model>
  RefreshToken: ModelStatic<Model>
  Goal: ModelStatic<Model>
  GoalReport: ModelStatic<Model>
  Concede: ModelStatic<Model>
  Cup: ModelStatic<Model>
  CupResult: ModelStatic<Model>
  Fixture: ModelStatic<Model>
  Gameweek: ModelStatic<Model>
  Group: ModelStatic<Model>
  ManagerGroup: ModelStatic<Model>
  ManagerKeeper: ModelStatic<Model>
  ManagerPlayer: ModelStatic<Model>
  Meeting: ModelStatic<Model>
  History: ModelStatic<Model>
  Email: ModelStatic<Model>
  Summary: ModelStatic<Model>
  Teamsheet: ModelStatic<Model>
  Transfer: ModelStatic<Model>
  sequelize: Sequelize
  Sequelize: typeof import('sequelize').Sequelize
}
