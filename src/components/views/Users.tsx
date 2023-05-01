import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pagination, Container, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { SearchUsersDocument } from "../../generated/graphql";
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

  const [queryVariables, setQueryVariables] = useState({
    query: searchQuery,
    first: 10,
    after: null,
  });

  const { loading, error, data } = useQuery(SearchUsersDocument, {
    variables: queryVariables,
    skip: !searchQuery || searchQuery.trim() === "",
  });

  useEffect(() => {
    if (data) {
      setUsers(data.search.edges.map((edge: any) => edge.node));
      setTotalPages(
        data.search.pageInfo.hasNextPage ? currentPage + 1 : currentPage
      );
    } else {
      setUsers([]);
    }
  }, [data, currentPage]);

  useEffect(() => {
    setQueryVariables({ query: searchQuery, first: 10, after: null });
  }, [searchQuery]);

  const handlePagination = (direction: "previous" | "next") => {
    if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setQueryVariables({
        query: searchQuery,
        first: 10,
        after: data.search.pageInfo.startCursor,
      });
    } else if (direction === "next" && data?.search.pageInfo.hasNextPage) {
      setCurrentPage(currentPage + 1);
      setQueryVariables({
        query: searchQuery,
        first: 10,
        after: data.search.pageInfo.endCursor,
      });
    }
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
                <Col
                  key={user.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-4"
                >
                  <Link to={`/user/${user.login}`}>
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
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
          {users.length > 0 && (
            <Pagination className="justify-content-center mt-4">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePagination("previous")}
              />
              <Pagination.Item active>{currentPage}</Pagination.Item>
              <Pagination.Next
                disabled={!data?.search.pageInfo.hasNextPage}
                onClick={() => handlePagination("next")}
              />
            </Pagination>
          )}
        </>
      )}
    </>
  );
};

export default Users;
