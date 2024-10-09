import { MongoClient } from 'mongodb';
// import { ConfigModule } from '../config/config.module';
// import { ConfigService } from '../config/config.service';
// const MONGO_URL =  new ConfigService().get('DB_URL')

export const getDb = async () => {
  const client: any = await MongoClient.connect('mongodb://localhost/nest-js-sample');
  return client.db();
};