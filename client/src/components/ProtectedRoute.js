import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute component to guard access
const ProtectedRoute = ({ children, auth }) => {
  if (!auth) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth" />;
  }
  return children; // Render the protected route if authenticated
};

export default ProtectedRoute;
