import React from "react";

const ActiveUsersList = ({ users }) => {
  return (
    <div className="p-4 border-l w-1/4 bg-white overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2">Active Users</h2>
      <ul className="space-y-1">
        {Object.entries(users).map(([id, user]) => (
          <li key={id} className="text-sm">
            🟢 {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsersList;
