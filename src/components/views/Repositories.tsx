import React, { useState, useEffect } from "react";
import {
  ListGroup,
  Pagination,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { SearchRepositoriesDocument } from "../../generated/graphql";
import { Link } from "react-router-dom";

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

  const [queryVariables, setQueryVariables] = useState({
    query: searchQuery,
    first: 10,
    after: null,
  });

  const { loading, error, data } = useQuery(SearchRepositoriesDocument, {
    variables: queryVariables,
    skip: !searchQuery || searchQuery.trim() === "",
  });

  useEffect(() => {
    if (data) {
      setRepositories(data.search.edges.map((edge: any) => edge.node));
      setTotalPages(
        data.search.pageInfo.hasNextPage ? currentPage + 1 : currentPage
      );
    } else {
      setRepositories([]);
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
              {repositories.map((repo) => (
                <Col
                  key={repo.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-4"
                >
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        <Link
                          to={`/repository/${repo.owner.login}/${repo.name}`}
                        >
                          {repo.name}
                        </Link>
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

export default Repositories;
