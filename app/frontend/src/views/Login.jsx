import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import styled from "styled-components";
import NavBar from "./NavBar"


export default function Login () {
  const { loginUser } = useContext(AuthContext);
  const { user, logoutUser } = useContext(AuthContext);
  const handleSubmit = e => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    username.length > 0 && loginUser(username, password);
  };

  return (
    <Section>
          {user ? (
              <>
                <NavBar />
              </>
          ) : (
            <>
              {/* <Link to="/login">Login</Link> */}
            </>
          )}
    
      <Row>
        <Col />
        <Col lg="8">         
            {user ? (
            <>
              {' '}
              </>
            ) : (
              <>
            <Card>
              <CardBody>
                <Section>
                  <form className="formblock"  onSubmit={handleSubmit}>
                    <Connexion>Connexion</Connexion>
                    <hr />
                    <Label htmlFor="username">Utilisateur : </Label><br></br>
                    <input className="username" type="text" id="username" placeholder="Nom d'utilisateur" /><br></br>
                    <br></br>

                    <Label htmlFor="password">Mot de passe : </Label><br></br>
                    <input type="password" id="password" placeholder="Mot de passe" /><br></br>
                    <br></br>
                    <Button type="submit" color="success">
                      Connexion
                    </Button>
                  </form>
                </Section>
              </CardBody>
            </Card>
              </>
            )}
        </Col>
        <Col />
      </Row>
    </Section>

  );
};

const Section = styled.div`
  .formblock {
    text-align: center;
  }
  
`
const ContainerStyled = styled.section`
  padding-top:10%
`
const Label = styled.label`
  color: #0f1e7a;
  // font-family: Brush Script MT, Brush Script Std, cursive;
  font-size: 3em;
  margin-bottom: 0;
`
const Connexion = styled.h1`
  color: #0f1e7a;
  // font-family: Brush Script MT, Brush Script Std, cursive;
  font-size: 7em;
  margin-bottom: 0;
`

