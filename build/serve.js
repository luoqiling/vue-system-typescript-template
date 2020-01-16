#!/usr/bin/env node
const inquirer = require('inquirer');
const { run } = require('runjs');
const argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('serve', '开发环境', () => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'env',
          message: '请选择要本地运行的环境',
          choices: [
            {
              name: '本地代理（mock）',
              value: 'mock'
            },
            {
              name: '开发环境（dev）',
              value: 'dev'
            },
            {
              name: '测试环境（test）',
              value: 'test'
            },
            {
              name: '线上环境（prod）',
              value: 'prod'
            }
          ]
        }
      ])
      .then(({ env }) => {
        const _env = env.toUpperCase();
        run(`cross-env NODE_ENV=development vue-cli-service serve --mode ${_env}`);
      });
  })
  .help('h')
  .alias('h', 'help').argv;
