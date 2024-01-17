const { getDB } = require("./database");
const { ObjectId } = require("mongodb");

async function getAllEmployees(_, { employeeType }) {
  if (employeeType && employeeType === "retirement") {
    return getUpcomingRetirements();
  } else {
    const filter = {};
    if (employeeType) {
      filter.employeeType = employeeType;
    }
    let employees = await getDB()
      .collection("employees")
      .find(filter)
      .toArray();

    employees.map((employee) => {
      const retirementDate = getRetirementDate(employee);
      return {
        ...employee,
        expiryString: getRemainingDays(retirementDate),
      };
    });
    return employees;
  }
}

function getRemainingDays(date) {
  const now = new Date();
  const totalDays = Math.floor(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const years = Math.floor(totalDays / 365);
  const remainingDays = totalDays % 365;
  const months = Math.floor(remainingDays / 30);
  const days = remainingDays % 30;

  return `${years} years, ${months} months, ${days} days`;
}

function getRetirementDate(employee) {
  const now = new Date();
  const deadlineDate = new Date();
  deadlineDate.setMonth(now.getMonth() + 6);

  const retirementAge = 65;
  const remainingMonths = (retirementAge - +employee.age) * 12;

  const retirementDate = new Date(employee.dateOfJoining);
  retirementDate.setMonth(retirementDate.getMonth() + remainingMonths); // retirement Date

  return retirementDate;
}

/**
 * This gets the Employee based on the id which should be converted to ObjectId type
 * @param {*} _
 * @param {*} param1
 * @returns
 */
async function getEmployeeById(_, { id }) {
  const response = await getDB()
    .collection("employees")
    .findOne({ _id: ObjectId(id) });
  const retirementDate = getRetirementDate(response);
  const expiryString = getRemainingDays(retirementDate);

  return {
    ...response,
    expiryString,
  };
}

async function getUpcomingRetirements() {
  const now = new Date();
  const deadlineDate = new Date();
  deadlineDate.setMonth(now.getMonth() + 6);

  const employees = await getDB().collection("employees").find({}).toArray();

  return employees.filter((employee) => {
    const retirementDate = getRetirementDate(employee);
    return retirementDate >= now && retirementDate <= deadlineDate;
  });
}

module.exports = {
  getAllEmployees,
  getEmployeeById,
  getUpcomingRetirements,
};
