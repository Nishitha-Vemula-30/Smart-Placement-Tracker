import Application from "../Models/applicationModel.js";
import Student from "../Models/studentModel.js";
import Company from "../Models/companyModel.js";
import Notification from "../Models/notificationModel.js";

// APPLY TO COMPANY
// Handle student application submission for a company drive.
// Only students can apply and only if they meet eligibility rules.
export const applyCompany = async (req, res) => {
  try {
    // Admins are not allowed to apply.
    if (req.user.role === "admin") {
      return res.status(403).json({
        message: "Admins cannot apply for companies"
      });
    }

    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({
        message: "Company ID is required"
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Check CGPA and branch eligibility.
    const isCgpaEligible = student.cgpa >= company.minimumCGPA;
    const isBranchEligible =
      company.eligibleBranches.length === 0 ||
      company.eligibleBranches.includes(student.branch);

    if (!isCgpaEligible || !isBranchEligible) {
      return res.status(400).json({
        message: `You are not eligible. Requires CGPA >= ${company.minimumCGPA} and eligible branches: ${company.eligibleBranches.join(", ")}`
      });
    }

    // Prevent duplicate applications for the same student and company.
    const existingApplication = await Application.findOne({
      student: req.user.id,
      company: companyId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this company"
      });
    }

    const application = await Application.create({
      student: req.user.id,
      company: companyId
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET ALL APPLICATIONS
// Return every application in the system with student and company details.
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student")
      .populate("company");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET MY APPLICATIONS
// Return only the applications of the currently logged-in student.
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user.id
    })
      .populate("company")
      .sort({ appliedDate: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// UPDATE STATUS
// Change an application's status and notify the student about the update.
export const updateStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    application.status = req.body.status;
    await application.save();

    // Populate student and company details to generate the notification message.
    const populatedApp = await Application.findById(application._id)
      .populate("student")
      .populate("company");

    if (populatedApp && populatedApp.student && populatedApp.company) {
      const msg = `Your application status for ${populatedApp.company.companyName} has been updated to "${req.body.status}".`;

      await Notification.create({
        studentId: populatedApp.student._id,
        message: msg
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};