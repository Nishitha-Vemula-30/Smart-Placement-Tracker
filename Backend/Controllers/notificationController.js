import Notification from "../Models/notificationModel.js";

// SEND NOTIFICATION
// Create a notification for a single student or broadcast to all students.
export const sendNotification = async (req, res) => {
  try {
    const { studentId, message } = req.body;

    // If studentId is "all" or missing, create a broadcast notification.
    const targetStudentId = (studentId === "all" || !studentId) ? null : studentId;

    const notification = await Notification.create({
      studentId: targetStudentId,
      message
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET NOTIFICATIONS
// Admins get all notifications; students get their own plus global broadcasts.
export const getNotifications = async (req, res) => {
  try {
    const query = req.user.role === "admin"
      ? {}
      : { $or: [{ studentId: req.user.id }, { studentId: null }] };

    const notifications = await Notification.find(query)
      .populate("studentId", "name email branch")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};