'use strict'
const mongoose = require('mongoose');
const KnowledgeSchema = new mongoose.Schema({
  root: {
    type: String,
    required: true
  },
  access: {
    type: String,
    default: "public",
    trim: true
  },
  relations: {
    abstractions : [{
         id: mongoose.Schema.Types.ObjectId,
         sync: { type: Number, default: Date.now()}
    }],
    elements : [{
         id: mongoose.Schema.Types.ObjectId,
         sync: { type: Number, default: Date.now()}
    }],
    subscribedBy: [{
       id: mongoose.Schema.Types.ObjectId,
       sync: { type: Number, default: Date.now()},
       access: { type: String, default: "public"},
       publish: { type: Boolean, default: false},
       subscribe: { type: Boolean, default: false}
    }],
    subscriberAt : [{
     id: mongoose.Schema.Types.ObjectId,
     sync: { type: Number, default: Date.now()},
     access: { type: String, default: "public"},
     publish: { type: Boolean, default: false},
     subscribe: { type: Boolean, default: false}
    }],
    ownedBy : [{
         id: mongoose.Schema.Types.ObjectId,
         sync: { type: Number, default: Date.now()}
     }],
    presentedBy : [{
          id: mongoose.Schema.Types.ObjectId,
          sync: { type: Number, default: Date.now()},
          access: { type: String, default: "public"},
          publish: { type: Boolean, default: false},
          subscribe: { type: Boolean, default: false}
    }],
    commentedAt : [{
      id: mongoose.Schema.Types.ObjectId,
      sync: { type: Number, default: Date.now()},
      access: { type: String, default: "public"},
      publish: { type: Boolean, default: false},
      subscribe: { type: Boolean, default: false}
    }],
    commentedBy : [{
      id: mongoose.Schema.Types.ObjectId,
      sync: { type: Number, default: Date.now()},
      access: { type: String, default: "public"},
      publish: { type: Boolean, default: false},
      subscribe: { type: Boolean, default: false}
    }],
    statedTo : [{
       id: mongoose.Schema.Types.ObjectId,
       sync: { type: Number, default: Date.now()}
    }],
    actedAt : [{
       id: mongoose.Schema.Types.ObjectId,
       sync: { type: Number, default: Date.now()}
    }],
    likedTo : [{
       id: mongoose.Schema.Types.ObjectId,
       sync: { type: Number, default: Date.now()},
       access: { type: String, default: "public"},
       publish: { type: Boolean, default: false},
       subscribe: { type: Boolean, default: false}
    }]
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  type: {
    type: String,
    enum: ['profile','social','actuator','sensor','topic','board','channel'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: {type: String, enum: ['Point'], required: true},
    coordinates: [],
    text: { type: String, default: "", trim: true}
  },
  connection: {
    host: { type: String, default: "0.0.0.0", trim: true },
    port: { type: Number, default: 0 }
  },
  version: {
    type: String,
    default: "0.0.1",
    trim: true
  },
  sync: { type: Number, default: Date.now() }
})

KnowledgeSchema.methods = {
  getAll: () => {
    return Knowledge.find({});
  },

  getById: (_id) => {
    return Knowledge.findOne({ _id });
  },

  getKnowledgeByType: (_type) => {
    return Knowledge.findOne({ "type": _type });
  },

  getKnowledgeByCategory: (_category) => {
    return Knowledge.findOne({ "category": _category });
  },

  getKnowledgeByKey: (_key) => {
    return Knowledge.findOne({ "key": _key });
  },

  getKnowledgeByCategoryKey: (_key, _category) => {
    return Knowledge.find({"key": _key, "category": _category});
  },

  getKnowledgeByTypeKey: (_key, _type) => {
    return Knowledge.find({"key": _key, "type": _type});
  },

  getKnowledgeByTypeCategory: (_type, _category) => {
    return Knowledge.find({"type": _type, "category": _category});
  },

  getKnowledgeByTypeCategoryKey: ( _key, _type, _category ) => {
    return Knowledge.find({"key": _key, "type": _type, "category": _category});
  },

  create: (transaction) => {
    return Knowledge.create(transaction);
  },

  update: (_id, transaction) => {
    return Knowledge.update({ _id }, transaction);
  },

  publishUpdates: (_id, changes) => {
    return Knowledge.update({ _id }, {$set: changes});
  },

  remove: (_id) => {
    return Knowledge.remove({ _id }, {active: false});
  },

  archive: (_key) => {
    return Knowledge.update({ "key": _key }, {active: false});
  }

}

mongoose.model('Knowledge', KnowledgeSchema);

/*
class Knowledge {
  constructor(tipo=0, valor=0, motivo=null, data=null, pago=false, obs=null) {
    this.tipo = tipo;
    this.valor = valor;
    this.motivo = motivo;
    this.data = data;
    this.pago = pago;
    this.obs = obs;
  }
}


*/
