const { getDB } = require("./database");
const { ObjectId } = require("mongodb");

async function addEmployee(_, { employee }) {
  const result = await getDB().collection("employees").insertOne(employee);
  const insertedRecord = result.ops[0]; // Get the inserted record
  console.log(insertedRecord);
  return insertedRecord;
}

// Updated the Employee Details from the request body using $set operator
async function updateEmployee(_, { id, input }) {
  const response = await getDB()
    .collection("employees")
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: input },
      { returnDocument: "after" }
    );
  return response.value;
}

// Deleted particular employee record based on the provided objectId
async function deleteEmployeeById(_, { id }) {
  const employee = await getDB()
    .collection("employees")
    .findOne({ _id: ObjectId(id) });

  if (!employee) {
    // If employee not found, return an error
    return {
      error: "Employee not found",
      deletedEmployee: null,
    };
  }

  if (employee.currentStatus == "1") {
    // If the employee's current status is active, don't delete and return an error
    return {
      error: `CAN'T DELETE EMPLOYEE - STATUS ACTIVE`,
      deletedEmployee: null,
    };
  }

  // If the employee's current status is not active, proceed with deletion
  const deletedRecord = await getDB()
    .collection("employees")
    .findOneAndDelete({ _id: ObjectId(id) });

  return {
    error: null,
    deletedEmployee: deletedRecord.value,
  };
}

module.exports = {
  addEmployee,
  updateEmployee,
  deleteEmployeeById,
};
