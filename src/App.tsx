import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Repositories from './components/views/Repositories';
import UserDetails from './components/views/UserDetails';
import RepositoryDetails from './components/views/RepositoryDetails';
import Users from './components/views/Users';
import Search from './components/search/Search';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'repositories' | 'users'>('repositories');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const handleSearch = (query: string, type: 'repositories' | 'users') => {
    console.log('handleSearch');
    console.log(query);
    setSearchQuery(query);
    setSearchType(type);
    setShouldNavigate(true);
  };

  useEffect(() => {
    if (shouldNavigate) {
      setShouldNavigate(false);
    }
  }, [shouldNavigate]);

  return (
    <Router>
      <div className="App">
      <Layout>
        <Search onSearch={handleSearch} />
        {shouldNavigate && (
          <Navigate
            to={`/${searchType}?q=${encodeURIComponent(searchQuery)}`}
            replace
            state={{ fromSearch: true }}
          />
        )}
        <Routes>
          <Route path="/" element={<Repositories searchQuery={searchQuery} />} />
          <Route path="/repositories" element={<Repositories searchQuery={searchQuery} />} />
          <Route path="/users" element={<Users searchQuery={searchQuery} />} />
          <Route path="/user/:login" element={<UserDetails />} />
          <Route path="/repository/:owner/:name" element={<RepositoryDetails />} />
        </Routes>
      </Layout>
      </div>
    </Router>
  );
};

export default App;
