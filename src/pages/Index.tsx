import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoPriceCards from "@/components/CryptoPriceCards";
import Layout from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('userToken');
    
    if (!userId || !token) {
      navigate('/landing');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <CryptoPriceCards />
    </Layout>
  );
};

export default Index;
