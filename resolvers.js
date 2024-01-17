const { getAllEmployees, getEmployeeById, getUpcomingRetirements } = require("./queries");
const {
  addEmployee,
  updateEmployee,
  deleteEmployeeById,
} = require("./mutations");

// This exports all Queries and Mutation as default export Object
module.exports = {
  Query: {
    getAllEmployees,
    getEmployeeById,
    getUpcomingRetirements
  },
  Mutation: {
    addEmployee,
    updateEmployee,
    deleteEmployeeById,
  },
};
