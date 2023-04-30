import React, { useState, useEffect } from "react";
import { ListGroup, Pagination, Container, Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { SearchRepositoriesDocument } from "../../generated/graphql";


interface Repository {
  id: string;
  name: string;
  owner: {
    login: string;
  };
  description: string;
  url: string;
}

interface RepositoriesProps {
  searchQuery: string;
}

const Repositories: React.FC<RepositoriesProps> = ({ searchQuery }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { loading, error, data, refetch } = useQuery(SearchRepositoriesDocument, {
    variables: {
      query: searchQuery,
      first: 10, // The number of results per page
      after: null, // Replace with logic for handling pagination
    },
    skip: !searchQuery || searchQuery.trim() === '',
  });

  useEffect(() => {
    if (data) {
      setRepositories(data.search.edges.map((edge: any) => edge.node));
      setTotalPages(
        data.search.pageInfo.hasNextPage ? currentPage + 1 : currentPage
      );
    }
  }, [data, currentPage]);

  useEffect(() => {
    if (searchQuery) {
      refetch();
    } else {
      setRepositories([]);
    }
  }, [searchQuery, currentPage, refetch]);

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
              {repositories.map((repo) => (
                <Col key={repo.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <a href={repo.url} target="_blank" rel="noreferrer">
                          {repo.name}
                        </a>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        by {repo.owner.login}
                      </Card.Subtitle>
                      <Card.Text>{repo.description}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
          {repositories.length > 0 && (
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

export default Repositories;
