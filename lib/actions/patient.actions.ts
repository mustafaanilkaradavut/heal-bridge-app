'use server';

import { ID, Query, Storage, Users, Databases } from 'node-appwrite';
import fs from 'fs';

import {
   BUCKET_ID,
   DATABASE_ID,
   ENDPOINT,
   PATIENT_COLLECTION_ID,
   PROJECT_ID,
   databases,
   storage,
   users,
} from '../appwrite.config';
import { parseStringify } from '../utils';

type CreateUserParams = {
   email: string;
   phone: string;
   name: string;
};

type RegisterUserParams = {
   identificationDocument?: {
      blobFile: Blob;
      fileName: string;
   };
   userId: string;
   name: string;
   age: number;
};

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
   try {
      const newUser = await users.create(
         ID.unique(),
         user.email,
         user.phone,
         undefined,
         user.name
      );

      return parseStringify(newUser);
   } catch (error: any) {
      if (error?.code === 409) {
         const existingUser = await users.list([
            Query.equal('email', [user.email]),
         ]);

         return existingUser?.users?.[0] || null;
      }
      console.error('Error creating a new user:', error);
      throw error;
   }
};

// GET USER
export const getUser = async (userId: string) => {
   try {
      const user = await users.get(userId);
      return parseStringify(user);
   } catch (error) {
      console.error('Error retrieving user details:', error);
      throw error;
   }
};

// REGISTER PATIENT
export const registerPatient = async ({
   identificationDocument,
   ...patient
}: RegisterUserParams) => {
   try {
      let file;
      if (identificationDocument) {
         const filePath = `./temp/${identificationDocument.fileName}`;
         const inputFile = fs.createWriteStream(filePath);
         inputFile.write(
            Buffer.from(await identificationDocument.blobFile.arrayBuffer())
         );

         file = await storage.createFile(
            BUCKET_ID!,
            ID.unique(),
            fs.createReadStream(filePath)
         );
      }

      const newPatient = await databases.createDocument(
         DATABASE_ID!,
         PATIENT_COLLECTION_ID!,
         ID.unique(),
         {
            identificationDocumentId: file?.$id || null,
            identificationDocumentUrl: file?.$id
               ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${PROJECT_ID}`
               : null,
            ...patient,
         }
      );

      return parseStringify(newPatient);
   } catch (error) {
      console.error('Error creating a new patient:', error);
      throw error;
   }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
   try {
      const patients = await databases.listDocuments(
         DATABASE_ID!,
         PATIENT_COLLECTION_ID!,
         [Query.equal('userId', [userId])]
      );

      return patients.documents.length > 0
         ? parseStringify(patients.documents[0])
         : null;
   } catch (error) {
      console.error('Error retrieving patient details:', error);
      throw error;
   }
};
