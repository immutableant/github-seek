import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import { Card, ListGroup } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { GetUserDetailsDocument } from '../../generated/graphql';

interface UserDetails {
  id: string;
  login: string;
  avatarUrl: string;
  url: string;
  bio: string;
  name: string;
  email: string;
  location: string;
  createdAt: string;
  followers: {
    totalCount: number;
  };
  following: {
    totalCount: number;
  };
  repositories: {
    totalCount: number;
  };
}

const UserDetails: React.FC = () => {
  const { login } = useParams<{ login: string }>();
  const [user, setUser] = useState<UserDetails | null>(null);

  const { loading, error, data } = useQuery(GetUserDetailsDocument, {
    variables: {
      login,
    },
    skip: !login, // Skip the query if there is no login
  });

  useEffect(() => {
    if (data) {
      setUser(data.user);
    } else {
      setUser(null);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        user && (
          <Card>
            <Card.Header as="h5">
              <a href={user.url} target="_blank" rel="noopener noreferrer">
                {user.login}
              </a>
            </Card.Header>
            <Card.Body>
              <Card.Img variant="top" src={user.avatarUrl} />
              <Card.Text>{user.bio}</Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>Name: {user.name || 'N/A'}</ListGroup.Item>
                <ListGroup.Item>Email: {user.email || 'N/A'}</ListGroup.Item>
                <ListGroup.Item>Location: {user.location || 'N/A'}</ListGroup.Item>
                <ListGroup.Item>Joined: {new Date(user.createdAt).toLocaleDateString()}</ListGroup.Item>
                <ListGroup.Item>Followers: {user.followers.totalCount}</ListGroup.Item>
                <ListGroup.Item>Following: {user.following.totalCount}</ListGroup.Item>
                <ListGroup.Item>Repositories: {user.repositories.totalCount}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        )
      )}
    </>
  );
};

export default UserDetails;
