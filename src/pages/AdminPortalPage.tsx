import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { InventoryPortal } from '../components/inventory/InventoryPortal';

const AdminPortalPage: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  return <InventoryPortal />;
};

export default AdminPortalPage;
