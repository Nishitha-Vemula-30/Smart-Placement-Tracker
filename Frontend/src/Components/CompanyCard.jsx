const CompanyCard = ({ company }) => {

  return (

    <div className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 duration-300">

      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        {company.companyName}
      </h1>

      <p className="mb-2">
        Role : {company.role}
      </p>

      <p className="mb-2">
        Package : {company.packageValue}
      </p>

      <p className="mb-4">
        Minimum CGPA : {company.minimumCGPA}
      </p>

      <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Apply
      </button>

    </div>
  )
}

export default CompanyCard      