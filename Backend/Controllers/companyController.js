import Company from "../Models/companyModel.js";
import Student from "../Models/studentModel.js";
import Notification from "../Models/notificationModel.js";
import Application from "../Models/applicationModel.js";

// COMPANY CONTROLLER
// Handles company CRUD operations and creates notifications when a new company drive is added.

// CREATE COMPANY & BROADCAST NOTIFICATION
export const addCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    // Broadcast a single notification for all students.
    // studentId null means this is a global notification.
    await Notification.create({
      studentId: null,
      message: `${company.companyName} company drive started for ${company.role}`,
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL COMPANIES
// Return every company sorted with the newest first.
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE COMPANY DETAILS
// Update company information by ID.
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCompany = await Company.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMPANY & ASSOCIATED APPLICATIONS
// Remove a company and all applications linked to it.
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await Company.findByIdAndDelete(id);
    await Application.deleteMany({ company: id });

    res.status(200).json({ message: "Company and associated applications deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ELIGIBLE COMPANIES
// Return companies that the current student can apply to based on CGPA and branch.
export const getEligibleCompanies = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const companies = await Company.find({
      minimumCGPA: { $lte: student.cgpa },
      $or: [
        { eligibleBranches: { $exists: false } },
        { eligibleBranches: { $size: 0 } },
        { eligibleBranches: student.branch }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};