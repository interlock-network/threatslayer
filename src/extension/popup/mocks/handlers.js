import { rest } from 'msw'
import { usernames } from './usernames.js';

export default [
    // NOTE: this will be done via Chrome storage, not an URL endpoint
    rest.get('/totalURLsVisited', (_req, res, ctx) => {
        return res(ctx.json(1337));
    }),
    // NOTE: this will be done via Chrome storage, not an URL endpoint
    rest.get('/totalMaliciousURLsVisited', (_req, res, ctx) => {
        return res(ctx.json(69));
    }),
    rest.post('/api/submit', (req, res, ctx) => {
        const { username, password, signature, unitedStates, termsOfService } = req.body;

        if (!unitedStates || !termsOfService || !username.length || !password.length || !signature) {
            return res(ctx.status());
        }

        return res(ctx.status(200), ctx.delay(2000));
    }),
    rest.post('/api/name', (req, res, ctx) => {
        const { name } = req.body;
        const errorMessages = {
            isDupe: `Username ${name} is already taken -- names are not case sensitive`,
        };
        const genericNameError = 400; // server code

        const isDupe = usernames.includes(name.toLowerCase());

        if (isDupe) {
            return res(
                ctx.status(genericNameError),
                ctx.json({
                    errorMessage: errorMessages.isDupe
                }, ctx.delay(250))
            );
        }

        return res(ctx.status(200), ctx.delay());
    })
]
