import { NotificationType } from "../components/NotificationCard";

export const notificationsData = [
    {
        id: "1",
        type: "success" as NotificationType,
        title: "Password Changed",
        message: "Your password has been updated successfully.",
        timestamp: "2 hours ago",
    },
    {
        id: "2",
        type: "error" as NotificationType,
        title: "Payment Failed",
        message: "Your recent payment of ₦5,000 failed. Please try again.",
        timestamp: "1 day ago",
    },
    {
        id: "3",
        type: "info" as NotificationType,
        title: "New Feature Alert",
        message: "You can now set up recurring savings plans. Check it out!",
        timestamp: "3 days ago",
    },
    {
        id: "4",
        type: "success" as NotificationType,
        title: "Savings Goal Reached",
        message:
            "Congratulations! You've reached your 'Vacation' savings goal.",
        timestamp: "5 days ago",
    },
];
