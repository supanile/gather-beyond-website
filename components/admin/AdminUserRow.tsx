import React, { useState } from "react";
import { Mission, User } from "@/types/admin/adminTypes";
import {
  Award,
  DollarSign,
  Calendar,
  Send,
  Wallet,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";

interface UserRowProps {
  user: User;
  missions: Mission[];
}

// Custom X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const AdminUserRow = ({ user, missions }: UserRowProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Mission | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "submitted":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openModal = (mission: Mission) => {
    setSelectedSubmission(mission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const getLinkType = (url: string) => {
    if (url.includes("twitter.com") || url.includes("x.com")) return "X (Twitter)";
    if (url.includes("discord.com")) return "Discord";
    if (url.includes("github.com")) return "GitHub";
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "YouTube";
    if (url.includes("medium.com")) return "Medium";
    return "External Link";
  };

  const userMissions = missions.filter(
    (mission) => mission.user_id === user.discord_id
  );

  return (
    <>
      <div className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-500">ID: {user.discord_id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mb-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {user.missions_completed} missions completed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">
              {user.total_points} points
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Interests:</span>
            <span className="text-xs text-gray-700">{user.interests}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500">
              Joined: {formatDate(user.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-2 border-t border-gray-100">
          {user.telegram_id && (
            <div className="flex items-center space-x-1">
              <Send className="w-3 h-3 text-blue-500" />
              <span className="text-xs text-gray-600">{user.telegram_id}</span>
            </div>
          )}
          {user.twitter_handle && (
            <div className="flex items-center space-x-1">
              <XIcon className="w-3 h-3 text-gray-900" />
              <span className="text-xs text-gray-600">
                {user.twitter_handle}
              </span>
            </div>
          )}
          {user.wallet_address && (
            <div className="flex items-center space-x-1">
              <Wallet className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-600">
                {user.wallet_address}
              </span>
            </div>
          )}
        </div>

        {/* Missions Table */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Missions</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mission ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accepted At
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {userMissions.length > 0 ? (
                  userMissions.map((mission) => (
                    <tr
                      key={mission._id}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {mission.mission_id}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            mission.status
                          )}`}
                        >
                          {mission.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {mission.accepted_at === "NULL" ||
                        mission.accepted_at === null ||
                        !mission.accepted_at
                          ? "N/A"
                          : formatDate(mission.accepted_at)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {mission.submitted_at === "NULL" ||
                        mission.submitted_at === null ||
                        !mission.submitted_at
                          ? "N/A"
                          : formatDate(mission.submitted_at)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {mission.completed_at === "NULL" ||
                        mission.completed_at === null ||
                        !mission.completed_at
                          ? "N/A"
                          : formatDate(mission.completed_at)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {mission.submission_link === "NULL" ||
                        mission.submission_link === null ||
                        !mission.submission_link ? (
                          <span className="text-gray-400">N/A</span>
                        ) : (
                          <button
                            onClick={() => openModal(mission)}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No missions found for this user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Mission #{selectedSubmission.mission_id} Submission
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 mb-2">
                  Submission Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                      Link:
                    </span>
                    <div className="flex-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mb-1 inline-block">
                        {getLinkType(selectedSubmission.submission_link!)}
                      </span>
                      <p className="text-sm text-gray-900 break-all">
                        {selectedSubmission.submission_link}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500 min-w-[60px]">
                      Status:
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <a
                  href={selectedSubmission.submission_link!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Link
                </a>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUserRow;