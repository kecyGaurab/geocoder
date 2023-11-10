import dotenv from 'dotenv';
import pkg from 'aws-sdk';
const { config, DynamoDB } = pkg;

import { v4 as uuidv4 } from 'uuid';

dotenv.config(); // Load environment variables from .env file

// Configure AWS SDK with environment variables
config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Create a DynamoDB document client
const docClient = new DynamoDB.DocumentClient();

// Dummy data with name and coordinates
const streetCoordinates = {
  'Elm Street': { latitude: 40.7, longitude: -74.0 },
  'Maple Avenue': { latitude: 40.71, longitude: -74.01 },
  'Oak Road': { latitude: 40.72, longitude: -74.02 },
  'Cedar Lane': { latitude: 40.73, longitude: -74.03 },
  'Willow Street': { latitude: 40.74, longitude: -74.04 },
};

// Street names
const streetNames = Object.keys(streetCoordinates);

// Set to keep track of used coordinates
const usedCoordinates = new Set();

// Function to generate unique coordinates for a given street
function getUniqueCoordinates(streetName, addressNumber) {
  const streetCoordinate = streetCoordinates[streetName];
  if (!streetCoordinate) {
    throw new Error(`Invalid street name: ${streetName}`);
  }

  const { latitude, longitude } = streetCoordinate;
  const latAdjustment = (Math.random() - 0.5) * 0.002; // Adjust within a small range
  const lonAdjustment = (Math.random() - 0.5) * 0.002; // Adjust within a small range

  const newLatitude = latitude + latAdjustment;
  const newLongitude = longitude + lonAdjustment;

  const coordinate = `${newLatitude},${newLongitude}`;

  if (usedCoordinates.has(coordinate)) {
    return getUniqueCoordinates(streetName, addressNumber); // Try again if coordinates are not unique
  }

  usedCoordinates.add(coordinate);
  return { latitude: newLatitude, longitude: newLongitude };
}


// Function to seed the DynamoDB table with dummy data
async function seedTable() {
  const tableName = process.env.DYNAMODB_TABLE_NAME; // Get the table name from environment variables

  for (let streetIndex = 0; streetIndex < streetNames.length; streetIndex++) {
    const streetName = streetNames[streetIndex];

    for (let addressNumber = 1; addressNumber <= 10; addressNumber++) {
      const streetAddress = `${streetName} ${addressNumber}`
      const { latitude, longitude } = getUniqueCoordinates(streetName, addressNumber);

      const params = {
        TableName: tableName,
        Item: {
          id: uuidv4(),
          streetAddress,
          latitude,
          longitude,
          streetName,
        },
        ConditionExpression: 'attribute_not_exists(id)', // Ensures the id doesn't already exist
      };

      try {
        await docClient.put(params).promise();
        console.log(`Inserted item ${streetAddress}`);
      } catch (err) {
        console.error(`Error inserting item ${streetAddress}: ${err.message}`);
      }
    }
  }
}

// Seed the DynamoDB table with data
seedTable();
