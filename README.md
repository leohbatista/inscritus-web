# InscritusWeb

1. [Introdução](#introdução)
1. [Funcionalidades](#funcionalidades)
    1. [Visão do participante](#visão-do-participante)
    1. [Visão do participante](#visão-do-administrador)

## Introdução

Inscritus Web é um sistema *white label* *open-source* para gerenciamento de evento. O projeto foi desenvolvido na disciplina **MC853 - Projeto em Sistemas de Programação**, oferecida pelo Instituto de Computação da Universidade Estadual de Campinas (IC/UNICAMP) no primeiro semestre letivo de 2020 (1S2020).

## Funcionalidades

O sistema é estruturado de forma que uma instância do sistema gerencia um único evento, o qual pode conter diversas atividades vinculadas. Dentre as funcionalidades implementadas temos:

### Visão do participante:

* Cadastro no evento
* Confirmação de e-mail
* Redefinição de senha
* Alteração de dados cadastrais e senha
* Identificação por QR Code para registro de presença
* Visualização de avisos gerais
* Visualização dos palestrantes do evento
* Visualização das atividades do evento
* Possibilidade de favoritar atividades
* Possibilidade de se inscrever em atividades
* Visualização das presenças em atividades

### Visão do administrador:

Todas as funcionalidades de usuário, além de:
* Gerenciamento de usuários:
  * Visualização
  * Edição
  * Bloqueio de acesso
* Gerenciamento de atividades
  * Criação
  * Visualização
  * Edição
  * Controle de disponibilidade para visualização pelo usuário
* Gerenciamento de palestrantes
  * Criação
  * Visualização
  * Edição
  * Remoção
* Gerenciamento de avisos
  * Criação
  * Visualização
  * Edição
  * Remoção
* Gerenciamento de locais
  * Criação
  * Visualização
  * Edição
  * Remoção
* Gerenciamento de tipos de atividade
  * Criação
  * Visualização
  * Edição
  * Remoção
* Gerenciamento de presenças em atividades
  * Registro
  * Remoção
  * Visualização
* Gerenciamento de inscrições em atividades
  * Registro
  * Remoção
  * Visualização
  * Definição de limite de vagas
  * Definição de momento da abertura das inscrições 

## Observações gerais sobre o projeto

Este projeto utiliza duas versões do `node.js` (v10 para o back-end e v12 para o front-end). Desta forma, recomenda-se a utilização do software `nvm` para fácil gerênciamento e troca entre as versões.

* [node.js](https://nodejs.org/)
* [nvm](https://github.com/nvm-sh/nvm)

Todos os comandos apresentados neste README são compatíveis com `npm` e `yarn` como gerenciadores de dependências. Nós recomendamos a utilização do `yarn` e, por esta razão, todos os comandos serão apresentados no formato deste gerenciador. Caso prefira utilizar o `npm`, basta utilizar a sintaxe exigida pelo mesmo.

* [yarn (Recomendado)](https://yarnpkg.com/)
* [npm](https://www.npmjs.com/)

### Infraestrutura


### Configurações gerais

## Informações sobre o Front-End

O front-end do projeto foi construído utilizando o framework Angular 9, utilizando padrões de design do Material UI através da biblioteca Angular Material. Devido ao uso do Firebase como plataforma de *cloud computing* a necessidade de uma estrutura de back-end diminui drasticamente, uma vez que o mesmo pemite comunicação direta do front-end com o banco de dados e o serviço de gerenciamento de autenticação.

### Instalação

Para instalar as dependências do front-end, basta executar o seguinte comando na **raiz do projeto**:

```
yarn
```

### Execução e Compilação

Para servir o código do front-end localmente, basta executar o seguinte comando:

```
yarn start
```

Para compilar o código do front-end em modo de **desenvolvimento**, execute:

```
yarn build
```

Para compilar o código do front-end em modo de **produção**, execute:

```
yarn build:prod
```

O código compilado, em ambos os modos, estará disponível na pasta `/dist/inscritus-web`, dentro do projeto.

### Deploy

Para lançar o front-end da aplicação usando o Firebase é necessário ter o firebase-cli instalado e configurado (saiba mais na seção [Configurando o Firebase](#)). Para efetuar o lançamento, execute:

```
firebase use <nome-do-projeto-no-firebase>
yarn deploy
```

Após o término da execução, a nova versão já estará disponível para uso.

**IMPORTANTE:** O código lançado é aquele que estiver disponível na pasta `/dist/inscritus-web`, dentro do projeto, no momento da execução dos comandos acima. Certifique-se de compilar o código adequadamente antes de realuzar o lançamento.

### Estrutura de pastas

### Configurações do projeto

## Informações sobre o Back-End

### Instalação

Para instalar as dependências do back-end, basta executar o seguinte comando na **pasta `functions`**:

```
yarn
```

### Execução e Compilação

Para servir o código localmente, basta executar o seguinte comando:

```
firebase use <nome-do-projeto>
yarn serve
```

Para compilar o código, execute:

```
firebase use <nome-do-projeto>
yarn build
```
O código compilado estará disponível na pasta `/functions/lib`, dentro do projeto.

### Deploy

Para lançar o back-end da aplicação usando o Firebase é necessário ter o firebase-cli instalado e configurado (saiba mais na seção [Configurando o Firebase](#)). Para efetuar o lançamento, execute:

```
firebase use <nome-do-projeto-no-firebase>
yarn deploy
```

### Estrutura de pastas

### Configurações do projeto
