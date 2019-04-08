const debug = require('../../util/debug').makeFileLogger(__dirname);
const { inspect } = require('util');
const path = require('path');
const dotenv = require('dotenv');
const envalid = require('envalid');
const camelspace = require('camelspace');
const { pick } = require('lodash');
// const hogan = require('hogan.js');

const buildpackVersion = require('../../../package.json').version;
const buildpackReleaseName = `PWA Studio Buildpack v${buildpackVersion}`;

// All environment variables Buildpack and PWA Studio use should be defined in
// envVarDefinitions.json, along with recent changes to those vars for logging.
const { sections, changes } = require('./envVarDefinitions.json');

/**
 * Turn the JSON entriesfrom envVarDefinitions.json, e.g.
 *
 *     {
 *        "name": "VARNAME",
 *        "type": "str",
 *        "desc": "foo"
 *     }
 *
 * into Envalid configuration calls, e.g.
 *
 *     {
 *        VARNAME: str({
 *           desc: "foo"
 *         })
 *     }
 */
const envalidValidationConfig = {};
for (const section of sections) {
    for (const variable of section.variables) {
        const typeFac = envalid[variable.type];
        if (typeof typeFac !== 'function') {
            throw new Error(
                `Bad environment variable definition. Section ${
                    section.name
                } variable ${JSON.stringify(
                    variable,
                    null,
                    1
                )} declares an unknown type ${variable.type}`
            );
        }
        envalidValidationConfig[variable.name] = envalid[variable.type]({
            desc: variable.desc,
            example: variable.example,
            default: variable.default
        });
    }
}

function configureEnvironment(dir, log = console) {
    /**
     * Ensure .env file is present. If not present and not in production mode,
     * a warning will be logged, but the app will still function if all
     * required environment variables are present via other means.
     */
    parseEnvFile(dir, log);

    /**
     * Now, process.env.should be populated with variables from the project
     * .env file. Check to see if any deprecated, changed, or renamed variables
     * are set, warn the developer, and reassign variables for legacy support.
     */
    const compatEnv = applyBackwardsCompatChanges(process.env, log);

    /**
     * Validate the environment object with envalid and throw errors for the
     * developer if an env var is missing or invalid.
     */
    const projectEnv = envalid.cleanEnv(compatEnv, envalidValidationConfig, {
        dotEnvPath: null // we parse dotEnv manually to do custom error msgs
    });

    if (debug.enabled) {
        // Only do this prettiness if we gotta
        debug(
            'Current known env',
            '\n  ' +
                inspect(
                    pick(projectEnv, Object.keys(envalidValidationConfig)),
                    {
                        colors: true,
                        compact: false
                    }
                )
                    .replace(/\s*[\{\}]\s*/gm, '')
                    .replace(/,\n\s+/gm, '\n  ') +
                '\n'
        );
    }

    // Make a provider that can return nice camelspaced versions of this big
    // list of environment variables.
    return {
        section(sectionPrefix) {
            return camelspace(sectionPrefix).fromEnv(projectEnv);
        },
        all() {
            return camelspace.fromEnv(projectEnv);
        }
    };
}

function parseEnvFile(dir, log) {
    const envPath = path.join(dir, '.env');
    try {
        const parsedEnv = dotenv.config({ path: envPath });
        // don't use console.log, which writes to stdout. writing to stdout
        // interferes with webpack json output
        log.info(`Using environment variables from ${envPath}`);
        debug('Env vars from .env:', parsedEnv);
    } catch (e) {
        if (process.env.NODE_ENV === 'production') {
            if (e.code === 'ENOENT') {
                log.warn(
                    `\nNo .env file in ${__dirname}\n\tYou may need to copy '.env.dist' to '.env' to begin, or create your own '.env' file manually.`
                );
            } else {
                log.warn(`\nCould not retrieve and parse ${envPath}.`, e);
            }
        }
    }
}

// display changes alphabetically by env var name
const sortedChanges = changes.slice().sort();
function applyBackwardsCompatChanges(env, log) {
    const mappedLegacyValues = {};
    for (const change of sortedChanges) {
        // the env isn't using the var with changes, no need to log
        const isSet = env.hasOwnProperty(change.name);
        switch (change.type) {
            case 'defaultChanged':
                // Default change only affects you if you have NOT set this var.
                if (!isSet) {
                    log.warn(
                        `Default value for ${
                            change.name
                        } has changed in ${buildpackReleaseName}, due to ${
                            change.reason
                        }.`,
                        `Old value: ${change.original} New value: ${
                            change.update
                        }`,
                        `This project does not set a custom value for ${
                            change.name
                        }, so this WILL affect the current configuration!`
                    );
                }
                break;
            case 'removed':
                if (isSet) {
                    log.warn(
                        `Environment variable ${
                            change.name
                        } has been removed in ${buildpackReleaseName}, because ${
                            change.reason
                        }.`,
                        `Current value is ${
                            env[change.name]
                        }, but it will be ignored.`
                    );
                }
                break;
            case 'renamed':
                if (isSet) {
                    log.warn(
                        `Environment variable ${
                            change.name
                        } has been renamed in ${buildpackReleaseName}`,
                        `Its new name is ${change.update}`
                    );
                    if (change.supportLegacy) {
                        if (!env.hasOwnProperty(change.update)) {
                            log.warn(
                                'The old variable will continue to work for the next several versions, but migrate it as soon as possible.'
                            );
                            mappedLegacyValues[change.update] =
                                env[change.name];
                        }
                    } else {
                        log.warn(
                            'The old variable is longer functional. Please migrate to the new ${change.update} variable as soon as possible.'
                        );
                    }
                }
                break;
            default:
                throw new Error(
                    `Found unknown change type "${
                        change.type
                    }" while trying to notify about changed env vars.`
                );
        }
    }
    return Object.assign({}, env, mappedLegacyValues);
}

module.exports = configureEnvironment;
