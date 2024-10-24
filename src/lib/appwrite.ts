import 'server-only';

import { cookies } from 'next/headers';
import { Account, Client, Databases } from 'node-appwrite';
import { AUTH_COOKIE } from './constants';

export async function createSessionClient() {
   const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

   const session = cookies().get(AUTH_COOKIE);
   if (!session || !session.value) throw new Error('Unauthorized request');

   client.setSession(session.value)


   return {
      get account() {
         return new Account(client);
      },
      get databases() {
         return new Databases(client);
      },
   };
}

export async function createAdminClient() {
   const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setKey(process.env.NEXT_APPWRITE_KEY!);

   return {
      get account() {
         return new Account(client);
      },
   };
}
