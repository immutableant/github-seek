import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';

interface SearchProps {
    onSearch: (query: string, type: 'repositories' | 'users') => void;
  }
  
const Search: React.FC<SearchProps> = ({ onSearch }) => {
const [query, setQuery] = useState('');
const [searchType, setSearchType] = useState<'repositories' | 'users'>('repositories');

const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query, searchType);
};

return (
    <Form onSubmit={handleSubmit} className="d-inline-flex justify-content-center">
    <Form.Control as="select" value={searchType} onChange={(e) => setSearchType(e.target.value as 'repositories' | 'users')}>
        <option value="repositories">Repositories</option>
        <option value="users">Users</option>
    </Form.Control>
    <FormControl type="text" placeholder="Search" className="mr-sm-2" value={query} onChange={(e) => setQuery(e.target.value)} />
    <Button type="submit" variant="outline-primary">Search</Button>
    </Form>
);
};

export default Search;
