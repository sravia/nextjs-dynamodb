import * as uuid from 'uuid';
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.ACCESS_KEY!,
    secretAccessKey: process.env.SECRET_KEY!
  },
  region: process.env.REGION
});

export const putItem = async (tableName: string, item: any) => {
  const { Attributes } = await client.send(
    new PutItemCommand({
      TableName: tableName,
      Item: {
        id: { S: uuid.v4() },
        ...item
      }
    })
  );
  return Attributes;
}

export const getItem = async (tableName: string, id: string) => {
  const { Item } = await client.send(
    new GetItemCommand({
      TableName: tableName,
      Key: {
        id: { S: id }
      }
    })
  );
  return Item;
}

export const updateItem = async (tableName: string, id: string, item: any) => {
  const { Attributes } = await client.send(
    new UpdateItemCommand({
      TableName: tableName,
      Key: {
        id: { S: id }
      },
      UpdateExpression: `set ${Object.keys(item).reduce((acc, v) => { acc += ` ${v} = :${v},`; return acc;}, "")}`,
      ExpressionAttributeValues: Object.keys(item).reduce((acc, v) => {
        const key = `:${v}`;
        acc[key] = { S: item[v]};
        return acc;
      }, {} as any),
      ReturnValues: 'ALL_NEW'
    })
  );
  return Attributes;
}

export const deleteItem = async (tableName: string, id: string) => {
  const { Attributes } = await client.send(
    new DeleteItemCommand({
      TableName: tableName,
      Key: {
        id: { S: id }
      }
    })
  );
  return Attributes;
}
