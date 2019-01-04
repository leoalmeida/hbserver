'use strict'
const mongoose = require('mongoose');
const DataSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['RAW','BPM','IBI'],
    default: 'RAW'
  },
  cycle: { type: Number, default: 1 },
  time: { type: Number, default: Date.now() }
})

DataSchema.methods = {
  getAll: () => {
    return Data.find({});
  },

  getById: (_id) => {
    return Data.findOne({ _id });
  },

  getDataByType: (_type) => {
    return Data.findOne({ "type": _type });
  },

  getDataByRange: (_range) => {
    return Data.find().where('time').gt(Date.now()-_range);
  },

  create: (transaction) => {
    return Data.create(transaction);
  },

  update: (_id, transaction) => {
    return Data.update({ _id }, transaction);
  },

  publishUpdates: (_id, changes) => {
    return Data.update({ _id }, {$set: changes});
  },

  remove: (_id) => {
    return Data.remove({ _id }, {active: false});
  },

  archive: (_cicle) => {
    return Data.update({ "cicle": _cicle }, {active: false});
  }

}

mongoose.model('Data', DataSchema);

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
