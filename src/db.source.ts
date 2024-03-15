import { DataSourceOptions } from "typeorm"

const dbSource: DataSourceOptions = {
  type: 'postgres',
  host: "localhost",
  port: parseInt(process.env.POSTGRES_PORT),
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
}

export default dbSource;