import Company from "../Models/companyModel.js";
import Student from "../Models/studentModel.js";
import Notification from "../Models/notificationModel.js";
import Application from "../Models/applicationModel.js";
import { sendEmail } from "../Utils/sendEmail.js";

// CREATE COMPANY & AUTOMATICALLY NOTIFY ELIGIBLE STUDENTS
export const addCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    // Fetch all registered students
    const students = await Student.find({ role: "student" });

    // Filter eligible students
    const eligibleStudents = students.filter((student) => {
      const meetsCgpa = student.cgpa !== undefined && student.cgpa !== null
        ? Number(student.cgpa) >= Number(company.minimumCGPA)
        : false;

      const meetsBranch =
        !company.eligibleBranches ||
        company.eligibleBranches.length === 0 ||
        (student.branch && company.eligibleBranches.includes(student.branch));

      return meetsCgpa && meetsBranch;
    });

    // Create notifications for eligible students in-app
    await Promise.all(
      eligibleStudents.map(async (student) => {
        // Database Notification
        await Notification.create({
          studentId: student._id,
          message: `${company.companyName} company drive started for ${company.role}`,
        });
      })
    );

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL COMPANIES
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE COMPANY DETAILS
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

// DELETE COMPANY & ALL CORRESPONDING APPLICATIONS
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Delete company and associated applications
    await Company.findByIdAndDelete(id);
    await Application.deleteMany({ company: id });

    res.status(200).json({ message: "Company and associated applications deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ELIGIBLE COMPANIES
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