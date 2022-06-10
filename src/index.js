import * as rxdb from "rxdb";
import * as pouchdb from "rxdb/plugins/pouchdb";
import * as MemoryAdapter from "pouchdb-adapter-memory";
import * as IdbAdapter from "pouchdb-adapter-idb";
import * as PouchHttp from "pouchdb-adapter-http";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";

export const testDb = async () => {
  const doc = { id: "id-hello",
                document_type: "goodbye" };

  const addDoc = async () =>
    db.docs.atomicUpsert(doc).then((d) => {
      console.log("YES succeeded in upserting:", d.get());
    });

  const removeDoc = () =>
    db.docs
      .findOne()
      .where("id")
      .equals("id-hello")
      .remove()
      .then(() => console.log("hello BYE removed success"))
      .catch((e) => console.error(`hello FAIL removing the doc failed`, e));

  const printDocs = () =>
    db.docs
      .find()
      .exec()
      .then((ds) => Promise.all(ds.map((d) => d.get())))
      .then((ds) => console.log("PRINTING docs", ds));

  rxdb.addRxPlugin(RxDBQueryBuilderPlugin);
  pouchdb.addPouchPlugin(MemoryAdapter);
  pouchdb.addPouchPlugin(PouchHttp);
  pouchdb.addPouchPlugin(IdbAdapter);

  const db = await rxdb.createRxDatabase({
    name: "random-test",
    // storage: getRxStorageMemory(), // <-- this storage does not cause problems
    storage: pouchdb.getRxStoragePouch("memory"), // <-- this one does fail
    // storage: pouchdb.getRxStoragePouch("idb"), // <-- this one does, too
    cleanupPolicy: {},
    eventReduce: true,
  });

  await db.addCollections({
    docs: {
      schema: {
        version: 0,
        type: "object",
        primaryKey: "id",
        properties: {
          id: { type: "string", maxLength: 100 },
          document_type: { type: "string", maxLength: 100 },
        },
      },
    },
  });

  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await printDocs();
  await removeDoc();
  await printDocs();
  await addDoc();
  await removeDoc();

  await db.remove();
  console.log(`ended testing db`);
};

testDb();
