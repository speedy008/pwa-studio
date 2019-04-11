// Simple colored console with icons; drop-in replacement for console object.
const chalk = require('chalk');
const figures = require('figures');
const wordwrap = require('word-wrap');

const formatWith = (level, color, figure) => (str, ...args) =>
    console[level](
        '\n' +
            color(
                wordwrap(`${figure}  ${str}`, {
                    width: process.stdout.columns - 5,
                    trim: true,
                    newline: '\n     '
                })
            ),
        ...args
    );

module.exports = {
    warn: formatWith('warn', chalk.yellowBright, figures.warning),
    log: formatWith('info', chalk.white, ''),
    info: formatWith('info', chalk.white, figures.info),
    error: formatWith('error', chalk.redBright, figures.circleCross)
};
