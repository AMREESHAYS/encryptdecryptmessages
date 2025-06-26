import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTab } from '../context/TabContest';
import Header from '../components/Header';
import EncryptionForm from '../components/EncryptionForm';
import DecryptionForm from '../components/DecryptionForm';
import MessageHistory from '../components/MessageHistory';
import SettingsPanel from '../components/SettingsPanels';

const AppLayout: React.FC = () => {
  const { tab } = useTab();

  const renderActiveTab = () => {
    switch (tab) {
      case 'encrypt':
        return <EncryptionForm />;
      case 'decrypt':
        return <DecryptionForm />;
      case 'history':
        return <MessageHistory />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <EncryptionForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-500">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {renderActiveTab()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;