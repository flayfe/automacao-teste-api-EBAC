/// <reference types="cypress"/>
import contrato from "../contracts/produtos.contracts";

describe("Testes da API ServeRest - Funcionalidade Produtos", () => {
  let token;

  before(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it("Deve validar contrato de produtos", () => {
    cy.request("/produtos").then((response) => {
      return contrato.validateAsync(response.body);
    });
  });

  it("Deve listar os produtos", () => {
    cy.request({
      method: "GET",
      url: "/produtos",
    }).then((response) => {
      expect(response.status).to.equal(200);
      // expect(response.body.produtos[0].nome).to.equal("Logitech MX Vertical");
      expect(response.body).to.have.property("produtos");
      expect(response.duration).to.be.lessThan(20);
    });
  });

  it("Deve cadastrar produto", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`;

    cy.request({
      method: "POST",
      url: "/produtos",
      headers: {
        authorization: token,
      },
      body: {
        nome: produto,
        preco: 480,
        descricao: "Teclado",
        quantidade: 10,
      },
    }).then((response) => {
      expect(response.status).to.equal(201);
      expect(response.body.message).to.equal("Cadastro realizado com sucesso");
    });
  });

  it("Deve validar mensagem de erro ao cadastrar produto repetido", () => {
    cy.cadastrarProduto(token, "Logitech MX Vertical", 470, "Mouse", 381).then(
      (response) => {
        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal(
          "Já existe produto com esse nome"
        );
      }
    );
  });

  it("Deve editar um produto ja cadastrado", () => {
    cy.request("/produtos").then((response) => {
      let id = response.body.produtos[1]._id;

      cy.request({
        method: "PUT",
        url: `/produtos/${id}`,
        headers: {
          authorization: token,
        },
        body: {
          nome: `Produto editado ${Math.floor(Math.random() * 10000000)}`,
          preco: 480,
          descricao: "Editado",
          quantidade: 10,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });
    });
  });

  it("Deve editar um produto cadastrado previamente", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`;

    cy.cadastrarProduto(
      token,
      produto,
      400,
      "Descricao do produto novo",
      100
    ).then((response) => {
      let id = response.body._id;

      cy.request({
        method: "PUT",
        url: `/produtos/${id}`,
        headers: {
          authorization: token,
        },
        body: {
          nome: produto + `${" editado"}`,
          preco: 200,
          descricao: "Editado",
          quantidade: 10,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro alterado com sucesso");
      });

      /* cy.request(`/produtos/${id}`).then(response => {
        cy.log(response.body.nome)
      }); */
    });
  });

  it("Deve deletar um produto cadastrado previamente", () => {
    let produto = `Produto EBAC ${Math.floor(Math.random() * 10000000)}`;

    cy.cadastrarProduto(
      token,
      produto,
      400,
      "Descricao do produto novo",
      100
    ).then((response) => {
      let id = response.body._id;

      cy.request({
        method: "DELETE",
        url: `/produtos/${id}`,
        headers: {
          authorization: token,
        },
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal("Registro excluído com sucesso");
      });
    });
  });
});
