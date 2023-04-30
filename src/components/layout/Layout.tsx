import React, { ReactNode } from "react";
import { Container, Navbar, Nav } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="md">
        <Navbar.Brand href="#home">GitHub Frontend</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
      <Container className="my-4">{children}</Container>
      <footer className="text-center py-4">
        <p>&copy; 2023 GitHub Frontend</p>
      </footer>
    </>
  );
};

export default Layout;
