declare module 'firestore-store' {
    import { Firestore } from 'firebase-admin/firestore';
    import session from 'express-session';

    interface FirestoreStoreOptions {
        database: Firestore;
        collection?: string;
    }

    export class FirestoreStore extends session.Store {
        constructor(options: FirestoreStoreOptions);
    }
}
