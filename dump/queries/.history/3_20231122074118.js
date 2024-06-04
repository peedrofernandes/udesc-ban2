db.funcionarios.aggregate([
  {
    $project: {
      nome: 1,
      idade: {
        $floor: {
          $divide: [
            { $subtract: [new Date(), "$datanasc" ]},
            
          ]
        }
      }
    }
  }
])