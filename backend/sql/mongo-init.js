db = db.getSiblingDB(process.env.MONGO_DB);

db.createCollection('traits');
db.createCollection('skills');
db.createCollection('abilities');
db.createCollection('weapons');
db.createCollection('armors');
db.createCollection('characters');
db.createCollection('fights');
