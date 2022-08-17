/// <reference types="cypress" />
import contrato from "../contracts/usuarios.contracts";
const faker = require("faker-br");
const Faker = require("faker-br/lib");

describe("Testes da API ServeRest - Funcionalidade Usuários", () => {
  it("Deve validar contrato de usuários", () => {
    cy.request("/usuarios").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request("/usuarios").then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.property("usuarios");
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    let nome = faker.name.firstName();
    let email = nome + "@" + faker.internet.domainName();
    let psw = faker.internet.password();

    cy.cadastrarUsuario(nome, email, psw, "true").then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar um usuário com email inválido", () => {
    let nome = faker.name.firstName();
    let email = "flavia#ebac";
    let psw = faker.internet.password();

    cy.cadastrarUsuario(nome, email, psw, "true").then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.email).to.equal("email deve ser um email válido");
    });
  });

  it("Deve validar um usuário com email repetido", () => {
    let nome1 = faker.name.firstName();
    let email1 = "novodenovo@ebac.com";
    let psw1 = faker.internet.password();

    cy.cadastrarUsuario(nome1, email1, psw1, "true")
    
    let nome2 = faker.name.firstName();
    let email2 = "novodenovo@ebac.com";
    let psw2 = faker.internet.password();

    cy.cadastrarUsuario(nome2, email2, psw2, "true").then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal("Este email já está sendo usado");
    });
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    let nome = faker.name.firstName();
    let email = nome + "@" + faker.internet.domainName();
    let psw = faker.internet.password();

    cy.cadastrarUsuario(nome, email, psw, "true").then((response) => {
      let id = response.body._id;

      cy.request({
        method: "PUT",
        url: `/usuarios/${id}`,
        body: {
          nome: nome + " editado",
          email: email,
          password: "editado",
          administrador: "true",
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });
    });
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    let nome = faker.name.firstName();
    let email = nome + "@" + faker.internet.domainName();
    let psw = faker.internet.password();

    cy.cadastrarUsuario(nome, email, psw, "true").then((response) => {
      let id = response.body._id;

      cy.request({
        method: "DELETE",
        url: `/usuarios/${id}`        
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso");
      });
    });
  });
});
