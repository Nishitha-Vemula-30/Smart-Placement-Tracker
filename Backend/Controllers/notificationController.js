import Notification from "../Models/notificationModel.js";

// SEND NOTIFICATION
export const sendNotification = async (req, res) => {
  try {
    const { studentId, message } = req.body;

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