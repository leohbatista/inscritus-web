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

## Estrutura geral do projeto

## Informações sobre o Front-End

## Informações sobre o Back-End



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
