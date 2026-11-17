import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { InventoryPortal } from '../components/inventory/InventoryPortal';
import { useSeoMeta } from '../utils/seo';

const AdminPortalPage: React.FC = () => {
  const { isAdminAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useSeoMeta({
    title: 'Admin Inventory Portal | Eudossier',
    canonical: 'https://eudossier.eu/admin/portal',
    robots: 'noindex, follow',
  });

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  return <InventoryPortal />;
};

export default AdminPortalPage;
