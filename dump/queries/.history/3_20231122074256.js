db.empregado.aggregate([
  {
    $project: {
      nome: 1,
      idade: {
        $floor: {
          $divide: [
            { $subtract: [new Date(), "$datanasc" ]},
            (365 * 24 * 60 * 60 * 1000)
          ]
        }
      }
    }
  }
])

db.empregado.aggregate([
  {
    $group: {
      _id: null,
      
    }
  }
])