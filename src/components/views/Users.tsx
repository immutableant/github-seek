import React, { useState, useEffect } from 'react';
import { Pagination, Container, Row, Col, Card } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { SearchUsersDocument } from '../../generated/graphql';
import "../CardStyles.css"; 

interface User {
  id: string;
  login: string;
  avatarUrl: string;
  url: string;
}

interface UsersProps {
  searchQuery: string;
}

const Users: React.FC<UsersProps> = ({ searchQuery }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log('Users.tsx');
  console.log(searchQuery);

  const { loading, error, data } = useQuery(SearchUsersDocument, {
    variables: {
      query: searchQuery,
      first: 10, // The number of results per page
      after: null, // Replace with logic for handling pagination
    },
    skip: !searchQuery || searchQuery.trim() === '',
  });

  useEffect(() => {
    if (data) {
      // Update the state with the fetched data
      setUsers(data.search.edges.map((edge: any) => edge.node));
      // Update totalPages based on the fetched data
      setTotalPages(data.search.pageInfo.hasNextPage ? currentPage + 1 : currentPage);
    } else {
      setUsers([]);
    }
  }, [data, currentPage]);

  const handlePagination = (eventKey: number) => {
    setCurrentPage(Math.max(1, Math.min(eventKey, totalPages)));
  };

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <Container>
            <Row>
              {users.map((user) => (
                <Col key={user.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <a href={user.url} target="_blank" rel="noreferrer">
                          {user.login}
                        </a>
                      </Card.Title>
                      <div className="text-center">
                        <img
                          src={user.avatarUrl}
                          alt={`${user.login} avatar`}
                          width="100"
                          height="100"
                          className="rounded-circle"
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
          {users.length > 0 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePagination(currentPage - 1)}
              />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePagination(currentPage + 1)}
              />
            </Pagination>
          )}
        </>
      )}
    </>
  );
  
};

export default Users;
