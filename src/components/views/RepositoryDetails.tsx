import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import { Card, ListGroup } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { RepositoryDetailsDocument } from '../../generated/graphql';

interface RepositoryDetails {
  id: string;
  name: string;
  owner: {
    login: string;
  };
  description: string;
  url: string;
  stargazers: {
    totalCount: number;
  };
  forks: {
    totalCount: number;
  };
  primaryLanguage: {
    name: string;
  } | null;
  updatedAt: string;
}

const RepositoryDetails: React.FC = () => {
  const { owner, name } = useParams<{ owner: string; name: string }>();
  const [repository, setRepository] = useState<RepositoryDetails | null>(null);

  const { loading, error, data } = useQuery(RepositoryDetailsDocument, {
    variables: {
      owner,
      name,
    },
  });

  useEffect(() => {
    if (data) {
      setRepository(data.repository);
    } else {
      setRepository(null);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        repository && (<Card>
          <Card.Header as="h5">
            <a href={repository.url} target="_blank" rel="noopener noreferrer">
              {repository.name}
            </a>{' '}
            by {repository.owner.login}
          </Card.Header>
          <Card.Body>
            <Card.Text>{repository.description}</Card.Text>
            <ListGroup variant="flush">
              <ListGroup.Item>Stars: {repository.stargazers.totalCount}</ListGroup.Item>
              <ListGroup.Item>Forks: {repository.forks.totalCount}</ListGroup.Item>
              {repository.primaryLanguage && (
                <ListGroup.Item>Primary Language: {repository.primaryLanguage.name}</ListGroup.Item>
              )}
              <ListGroup.Item>Last Updated: {new Date(repository.updatedAt).toLocaleString()}</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        )
      )}
    </>
  );
};

export default RepositoryDetails;
